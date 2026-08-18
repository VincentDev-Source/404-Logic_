import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  X, 
  Ticket, 
  ThumbsUp, 
  Compass, 
  Trash2,
  Navigation,
  Loader2
} from 'lucide-react';
import { CATEGORIES } from '../data/mockReports';

// Fix Leaflet default icon asset paths in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function InteractiveMap({ reports, onUpvote, onTrackTicket, onDeleteReport, theme }) {
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterCategory, setFilterCategory] = useState('semua');
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const isDark = theme === 'dark';

  const filteredReports = filterCategory === 'semua'
    ? reports
    : reports.filter(r => r.category === filterCategory);

  // Initialize and manage real Leaflet map instance
  useEffect(() => {
    if (!mapRef.current) return;

    // Default center: Indonesia / Jakarta (Lat -6.2088, Lng 106.8456)
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        center: [-6.2088, 106.8456],
        zoom: 10,
        zoomControl: true,
      });
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Choose map tile provider based on Light/Dark theme
    const tileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const attribution = isDark
      ? '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

    // Remove old tile layers to update theme tile seamlessly
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution,
    }).addTo(map);

    // Clear old markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    // Custom Emerald Pin Icon
    const createCustomIcon = (isSelected) => {
      return L.divIcon({
        className: 'custom-leaflet-pin',
        html: `
          <div style="
            background-color: ${isSelected ? '#10b981' : isDark ? '#ffffff' : '#000000'};
            color: ${isSelected ? '#000000' : isDark ? '#000000' : '#ffffff'};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
            border: 2px solid #10b981;
            transition: transform 0.2s;
          ">
            📍
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      });
    };

    // Add markers for all report GPS positions
    const bounds = [];
    filteredReports.forEach((report) => {
      const lat = report.coordinates?.lat || -6.2088;
      const lng = report.coordinates?.lng || 106.8456;
      bounds.push([lat, lng]);

      const isSelected = selectedReport?.id === report.id;
      const marker = L.marker([lat, lng], { icon: createCustomIcon(isSelected) }).addTo(map);

      // Popup Content
      const popupHtml = `
        <div style="font-family: sans-serif; padding: 4px; max-width: 220px;">
          <div style="font-size: 10px; font-weight: 800; color: #10b981; margin-bottom: 2px;">#${report.id} • ${report.category}</div>
          <div style="font-size: 12px; font-weight: 700; margin-bottom: 4px; line-clamp: 2;">${report.title}</div>
          <div style="font-size: 11px; opacity: 0.8; margin-bottom: 6px;">${report.location}</div>
        </div>
      `;
      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        setSelectedReport(report);
      });

      markersRef.current.push(marker);
    });

    // Automatically fit bounds if markers exist
    if (bounds.length > 0) {
      const group = new L.featureGroup(markersRef.current);
      if (group.getBounds().isValid()) {
        map.fitBounds(group.getBounds().pad(0.15));
      }
    }

  }, [filteredReports, isDark, selectedReport]);

  // Jump to user's real browser GPS location
  const handleLocateUserOnMap = () => {
    if (!navigator.geolocation) {
      alert('Browser Anda tidak mendukung Geolocation GPS.');
      return;
    }

    setIsLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([lat, lng], 15, { duration: 1.5 });

          // Temporary user location marker
          const userMarker = L.marker([lat, lng], {
            icon: L.divIcon({
              className: 'user-gps-pulse',
              html: `
                <div style="
                  background-color: #3b82f6;
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  border: 3px solid #ffffff;
                  box-shadow: 0 0 15px #3b82f6;
                "></div>
              `,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })
          }).addTo(mapInstanceRef.current);

          userMarker.bindPopup('<b>Lokasi Real GPS Anda Saat Ini</b>').openPopup();
        }
        setIsLocatingUser(false);
      },
      (err) => {
        console.error('GPS error:', err);
        alert('Gagal mendeteksi lokasi GPS Anda.');
        setIsLocatingUser(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-4">
      
      {/* Map Control Bar */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 shadow-sm transition-colors">
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-black border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-emerald-500">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-neutral-900 dark:text-white">Peta OpenStreetMap Dunia & Real GPS Marker</h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">Visualisasi titik aduan warga di peta dunia nyata</p>
          </div>
        </div>

        {/* Action Controls & Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto">
          
          <button
            onClick={handleLocateUserOnMap}
            disabled={isLocatingUser}
            className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-1.5 transition-all shrink-0 shadow"
          >
            {isLocatingUser ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Mencari GPS...</span>
              </>
            ) : (
              <>
                <Navigation className="w-3.5 h-3.5" />
                <span>Ke Lokasi GPS Saya</span>
              </>
            )}
          </button>

          <button
            onClick={() => setFilterCategory('semua')}
            className={`px-3 py-1 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all ${
              filterCategory === 'semua'
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-black shadow-sm'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700'
            }`}
          >
            Semua Marker ({reports.length})
          </button>

          {CATEGORIES.filter(c => c.id !== 'semua').map((c) => (
            <button
              key={c.id}
              onClick={() => setFilterCategory(c.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap border transition-all ${
                filterCategory === c.id
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-black border-neutral-900 dark:border-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

      </div>

      {/* Real Leaflet Map Container */}
      <div className="relative w-full h-[520px] rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-md transition-colors z-10">
        <div ref={mapRef} className="w-full h-full min-h-[520px]" />

        {/* Selected Report Drawer Overlay */}
        {selectedReport && (
          <div className="absolute bottom-4 left-4 right-4 max-w-md mx-auto bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-2xl z-[1000] space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded bg-emerald-500 text-black font-mono text-[10px] font-extrabold">
                  #{selectedReport.id}
                </span>
                <h4 className="text-xs font-black text-neutral-900 dark:text-white mt-1 line-clamp-1">
                  {selectedReport.title}
                </h4>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed font-medium">
              {selectedReport.description}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onUpvote(selectedReport.id)}
                  className="px-3 py-1 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white hover:text-emerald-500 font-bold text-xs flex items-center gap-1 border border-neutral-200 dark:border-neutral-800"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{selectedReport.upvotes}</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(`Apakah Anda yakin ingin menghapus aduan #${selectedReport.id}?`)) {
                      onDeleteReport(selectedReport.id);
                      setSelectedReport(null);
                    }
                  }}
                  className="p-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
                  title="Hapus Aduan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => onTrackTicket(selectedReport.id)}
                className="px-3 py-1 rounded bg-emerald-500 text-black font-bold text-xs flex items-center gap-1"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Detail Tiket</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
