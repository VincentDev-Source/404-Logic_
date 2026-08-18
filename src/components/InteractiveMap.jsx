import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  X, 
  Ticket, 
  ThumbsUp, 
  Compass, 
  Trash2,
  Building2 
} from 'lucide-react';
import { CATEGORIES } from '../data/mockReports';

export default function InteractiveMap({ reports, onUpvote, onTrackTicket, onDeleteReport, theme }) {
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterCategory, setFilterCategory] = useState('semua');
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const isDark = theme === 'dark';

  const filteredReports = filterCategory === 'semua'
    ? reports
    : reports.filter(r => r.category === filterCategory);

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!mapRef.current) return;

    // Center on Indonesia (Jakarta as center)
    const initialLat = -6.2088;
    const initialLng = 106.8456;
    const initialZoom = 11;

    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        center: [initialLat, initialLng],
        zoom: initialZoom,
        zoomControl: true,
      });

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Tile Layer: OpenStreetMap for Light Mode, CartoDB Dark Matter for Dark Mode
    const tileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const attribution = isDark
      ? '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution,
    }).addTo(map);

    // Clear existing markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    // Add markers for each report in Indonesia
    filteredReports.forEach((report) => {
      const lat = report.coordinates?.lat || -6.2088;
      const lng = report.coordinates?.lng || 106.8456;

      const markerHtml = `
        <div style="
          background-color: ${selectedReport?.id === report.id ? '#10b981' : isDark ? '#ffffff' : '#000000'};
          color: ${selectedReport?.id === report.id ? '#000000' : isDark ? '#000000' : '#ffffff'};
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
          border: 2px solid #10b981;
          cursor: pointer;
        ">
          📍
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: markerHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
      
      marker.on('click', () => {
        setSelectedReport(report);
      });

      markersRef.current.push(marker);
    });

    // Fit bounds if reports exist
    if (filteredReports.length > 0) {
      const group = new L.featureGroup(markersRef.current);
      if (group.getBounds().isValid()) {
        map.fitBounds(group.getBounds().pad(0.2));
      }
    }

  }, [filteredReports, isDark, selectedReport]);

  return (
    <div className="space-y-4">
      {/* Map Control Bar */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 shadow-sm transition-colors">
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-black border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-emerald-500">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-neutral-900 dark:text-white">Peta OpenStreetMap Indonesia</h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">Lacak titik aduan real warga di seluruh kota Indonesia</p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setFilterCategory('semua')}
            className={`px-3 py-1 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all ${
              filterCategory === 'semua'
                ? 'bg-emerald-500 text-black shadow-sm'
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
                  ? 'bg-emerald-500 text-black border-emerald-500'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

      </div>

      {/* Real Leaflet Map Container */}
      <div className="relative w-full h-[520px] rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm transition-colors">
        <div ref={mapRef} className="w-full h-full" />

        {/* Selected Report Drawer Card */}
        {selectedReport && (
          <div className="absolute bottom-4 left-4 right-4 max-w-md mx-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-2xl z-[1000] space-y-3">
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

            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
              {selectedReport.description}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onUpvote(selectedReport.id)}
                  className="px-3 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:text-emerald-500 font-bold text-xs flex items-center gap-1"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{selectedReport.upvotes}</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(`Hapus aduan #${selectedReport.id}?`)) {
                      onDeleteReport(selectedReport.id);
                      setSelectedReport(null);
                    }
                  }}
                  className="p-1.5 rounded bg-red-600/90 text-white font-bold text-xs"
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
