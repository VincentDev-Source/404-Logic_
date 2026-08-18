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
  Loader2,
  Maximize2
} from 'lucide-react';
import { CATEGORIES } from '../data/mockReports';

// Fix Leaflet default icon asset paths in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function InteractiveMap({ 
  reports, 
  onUpvote, 
  onTrackTicket, 
  onDeleteReport, 
  openConfirm, 
  openAlert, 
  theme 
}) {
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterCategory, setFilterCategory] = useState('semua');
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const tempClickMarkerRef = useRef(null);

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

      // Enable Click-to-Pick pin placement anywhere on map
      map.on('click', async (e) => {
        const { lat, lng } = e.latlng;

        if (tempClickMarkerRef.current) {
          map.removeLayer(tempClickMarkerRef.current);
        }

        const clickMarker = L.marker([lat, lng], {
          icon: L.divIcon({
            className: 'click-pin-pulse',
            html: `
              <div style="
                background-color: #10b981;
                color: #000000;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                box-shadow: 0 0 20px #10b981;
                border: 3px solid #ffffff;
                animation: radarPulse 2s infinite ease-in-out;
              ">📌</div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          })
        }).addTo(map);

        tempClickMarkerRef.current = clickMarker;

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
          const data = await res.json();
          const address = data?.display_name || `Koordinat GPS: Lat ${lat.toFixed(5)}, Lng ${lng.toFixed(5)}`;

          clickMarker.bindPopup(`
            <div style="font-family: sans-serif; padding: 6px; max-width: 210px;">
              <div style="font-size: 10px; font-weight: 800; color: #10b981; margin-bottom: 2px;">📍 TITIK LOKASI DIPILIH</div>
              <div style="font-size: 11px; font-weight: 600; line-clamp: 2; opacity: 0.9;">${address}</div>
            </div>
          `).openPopup();
        } catch (err) {
          clickMarker.bindPopup(`<b>Titik GPS Dipilih:</b><br/>Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`).openPopup();
        }
      });

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Choose map tile provider based on Light/Dark theme (Native high contrast without CSS invert filters)
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

    // Category emoji badge helper
    const getCategoryEmoji = (cat) => {
      switch (cat) {
        case 'Jalan Rusak': return '🛣️';
        case 'Sampah/Limbah': return '🗑️';
        case 'Lampu Jalan': return '💡';
        case 'Banjir/Drainase': return '🌊';
        default: return '📍';
      }
    };

    // Ultra-Modern Teardrop Leaflet Marker Pin with Radar Pulse Ring
    const createCustomIcon = (report, isSelected) => {
      const emoji = getCategoryEmoji(report.category);
      const isResolved = report.status === 'Selesai';
      const isProcessing = report.status === 'Sedang Ditangani';

      const badgeBg = isSelected 
        ? '#10b981' 
        : isResolved 
        ? '#10b981' 
        : isProcessing 
        ? '#f59e0b' 
        : isDark ? '#ffffff' : '#000000';

      const textColor = isSelected || isResolved ? '#000000' : isDark ? '#000000' : '#ffffff';

      return L.divIcon({
        className: 'custom-leaflet-pin-wrapper',
        html: `
          <div style="position: relative; width: 42px; height: 48px; display: flex; align-items: center; justify-content: center;">
            
            <!-- Pulsating Radar Ring -->
            <div style="
              position: absolute;
              top: 6px;
              left: 6px;
              width: 30px;
              height: 30px;
              border-radius: 50%;
              background: rgba(16, 185, 129, 0.4);
              animation: radarPulse 2.2s infinite ease-in-out;
              pointer-events: none;
            "></div>

            <!-- Main Teardrop Badge Pin -->
            <div style="
              position: relative;
              background-color: ${badgeBg};
              color: ${textColor};
              width: 36px;
              height: 36px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 8px 20px rgba(0,0,0,0.5);
              border: 2.5px solid #10b981;
              cursor: pointer;
            ">
              <span style="transform: rotate(45deg); font-size: 17px; display: block; line-height: 1;">
                ${emoji}
              </span>
            </div>

          </div>
        `,
        iconSize: [42, 48],
        iconAnchor: [21, 44],
        popupAnchor: [0, -40]
      });
    };

    // Add markers for all report GPS positions
    const bounds = [];
    filteredReports.forEach((report) => {
      const lat = report.coordinates?.lat || -6.2088;
      const lng = report.coordinates?.lng || 106.8456;
      bounds.push([lat, lng]);

      const isSelected = selectedReport?.id === report.id;
      const marker = L.marker([lat, lng], { icon: createCustomIcon(report, isSelected) }).addTo(map);

      // Popup Preview Content
      const popupHtml = `
        <div style="font-family: sans-serif; padding: 6px; max-width: 220px;">
          <div style="display: flex; items-center; justify-content: space-between; gap: 4px; margin-bottom: 3px;">
            <span style="font-size: 10px; font-weight: 900; color: #10b981;">#${report.id}</span>
            <span style="font-size: 9px; font-weight: 800; padding: 1px 5px; border-radius: 4px; background: rgba(16,185,129,0.15); color: #10b981;">${report.category}</span>
          </div>
          <div style="font-size: 12px; font-weight: 800; margin-bottom: 4px; line-clamp: 2;">${report.title}</div>
          <div style="font-size: 11px; opacity: 0.8; margin-bottom: 4px; line-clamp: 1;">📍 ${report.location}</div>
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

  // High-Precision Hardware GPS Geolocation (enableHighAccuracy: true, maximumAge: 0, zoom=17 street focus)
  const handleLocateUserOnMap = async () => {
    setIsLocatingUser(true);

    const tryHighPrecisionBrowserGeo = () => {
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          resolve(null);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => resolve(null),
          { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
        );
      });
    };

    let targetCoords = await tryHighPrecisionBrowserGeo();

    if (!targetCoords) {
      // IP-based Geolocation Fallback
      try {
        const res = await fetch('https://ipapi.co/json/').catch(() => null);
        if (res && res.ok) {
          const data = await res.json();
          if (data && data.latitude && data.longitude) {
            targetCoords = { lat: data.latitude, lng: data.longitude, city: data.city };
          }
        }
      } catch (err) {
        console.warn('IP Geolocation fallback failed:', err);
      }
    }

    if (!targetCoords) {
      targetCoords = { lat: -6.2088, lng: 106.8456, city: 'Jakarta' };
    }

    if (mapInstanceRef.current && targetCoords) {
      const { lat, lng } = targetCoords;
      // Fly to exact street view zoom level 17
      mapInstanceRef.current.flyTo([lat, lng], 17, { duration: 1.5 });

      const userMarker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: 'user-gps-pulse',
          html: `
            <div style="
              background-color: #3b82f6;
              width: 26px;
              height: 26px;
              border-radius: 50%;
              border: 3.5px solid #ffffff;
              box-shadow: 0 0 25px #3b82f6;
              animation: radarPulse 1.8s infinite ease-in-out;
            "></div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        })
      }).addTo(mapInstanceRef.current);

      userMarker.bindPopup(`<b>Lokasi Presisi GPS Anda</b><br/>Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`).openPopup();
    }

    setIsLocatingUser(false);
  };

  const handleConfirmDeleteOnMap = (reportId) => {
    if (openConfirm) {
      openConfirm({
        title: 'Hapus Aduan Fasilitas',
        message: `Apakah Anda yakin ingin menghapus aduan #${reportId} secara permanen? Data yang dihapus tidak dapat dikembalikan.`,
        confirmText: 'Ya, Hapus Aduan',
        cancelText: 'Batal',
        type: 'danger',
        onConfirm: () => {
          onDeleteReport(reportId);
          setSelectedReport(null);
        }
      });
    } else {
      onDeleteReport(reportId);
      setSelectedReport(null);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Map Control Bar */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 shadow-sm transition-colors">
        
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-black border border-emerald-500/30 flex items-center justify-center text-emerald-500 animate-pulse">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black text-neutral-900 dark:text-white flex items-center gap-1.5">
              Peta OpenStreetMap Dunia & Marker Radar
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono text-[10px] font-extrabold border border-emerald-500/20">
                LIVE GPS
              </span>
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">Klik di mana saja pada peta untuk menandai titik aduan baru</p>
          </div>
        </div>

        {/* Action Controls & Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto">
          
          <button
            onClick={handleLocateUserOnMap}
            disabled={isLocatingUser}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-extrabold text-xs flex items-center gap-1.5 transition-all shrink-0 shadow-md"
          >
            {isLocatingUser ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Mengunci GPS Hardware...</span>
              </>
            ) : (
              <>
                <Navigation className="w-3.5 h-3.5" />
                <span>Deteksi Lokasi Saya (Presisi High-Accuracy)</span>
              </>
            )}
          </button>

          <button
            onClick={() => setFilterCategory('semua')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all active:scale-95 ${
              filterCategory === 'semua'
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-black shadow-sm'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700'
            }`}
          >
            Semua ({reports.length})
          </button>

          {CATEGORIES.filter(c => c.id !== 'semua').map((c) => (
            <button
              key={c.id}
              onClick={() => setFilterCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all active:scale-95 ${
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
      <div className="relative w-full h-[540px] rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-xl transition-colors z-10">
        <div ref={mapRef} className="w-full h-full min-h-[540px]" />

        {/* High-Aesthetic Glassmorphism Bottom Drawer Overlay Card */}
        {selectedReport && (
          <div className="absolute bottom-4 left-4 right-4 max-w-lg mx-auto bg-white/95 dark:bg-black/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-2xl z-[1000] space-y-3 animate-fade-in-up">
            
            <div className="flex items-start gap-3">
              {/* Photo Thumbnail */}
              <div 
                onClick={() => setPreviewImage(selectedReport.image)}
                className="relative w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 shrink-0 border border-neutral-200 dark:border-neutral-800 cursor-pointer group"
              >
                <img 
                  src={selectedReport.image} 
                  alt={selectedReport.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Content Detail */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-500 text-black font-mono text-[10px] font-extrabold">
                      #{selectedReport.id}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold text-[10px] border border-neutral-200 dark:border-neutral-700">
                      {selectedReport.category}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedReport(null)}
                    className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <h4 className="text-xs font-black text-neutral-900 dark:text-white line-clamp-1 leading-snug">
                  {selectedReport.title}
                </h4>

                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed font-medium">
                  {selectedReport.description}
                </p>

                <div className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 flex items-center gap-1 pt-0.5">
                  <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span className="truncate">{selectedReport.location}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onUpvote(selectedReport.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all active:scale-95 ${
                    selectedReport.upvotedByUser
                      ? 'bg-emerald-500 text-black shadow-sm'
                      : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white hover:text-emerald-500 border border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{selectedReport.upvotes} Dukungan</span>
                </button>

                <button
                  onClick={() => handleConfirmDeleteOnMap(selectedReport.id)}
                  className="p-2 rounded-xl bg-red-600/90 hover:bg-red-500 text-white font-bold text-xs active:scale-95 transition-all"
                  title="Hapus Aduan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => onTrackTicket(selectedReport.id)}
                className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Detail Tiket</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-white dark:bg-black rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <span className="text-xs font-bold text-neutral-900 dark:text-white">Pratinjau Foto Bukti</span>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 max-h-[75vh] flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
              <img src={previewImage} alt="Preview" className="max-h-[70vh] object-contain rounded" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
