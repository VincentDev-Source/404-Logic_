import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Train, Zap, Search, Clock, ShieldCheck, MapPin, Gauge, AlertCircle, RefreshCw, ChevronRight, Info } from 'lucide-react';
import { REALTIME_TRAINS, INDONESIA_STATIONS } from '../data/indonesiaTransportData';

// Custom Leaflet Icons using SVG HTML
const createCustomMarkerIcon = (color = '#3b82f6', isWhoosh = false) => {
  const iconHtml = `
    <div style="
      background-color: ${color};
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      border: 2px solid white;
      box-shadow: 0 0 15px ${color};
      position: relative;
    ">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
        <line x1="4" y1="22" x2="4" y2="15"></line>
      </svg>
    </div>
  `;
  return L.divAnchor ? L.divIcon({
    html: iconHtml,
    className: isWhoosh ? 'pulse-whoosh-marker' : 'pulse-train-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  }) : L.divIcon({
    html: iconHtml,
    className: isWhoosh ? 'pulse-whoosh-marker' : 'pulse-train-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

const stationIcon = L.divIcon({
  html: `
    <div style="
      background: #0f172a;
      border: 2px solid #94a3b8;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(255,255,255,0.4);
    "></div>
  `,
  className: '',
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

// Helper component to auto-recenter map when selecting a train
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}

export const TrainTracker = ({ onSelectTrainForBooking }) => {
  const [trains, setTrains] = useState(REALTIME_TRAINS);
  const [selectedTrain, setSelectedTrain] = useState(REALTIME_TRAINS[0]);
  const [filterCategory, setFilterCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState([-6.6000, 107.3000]);
  const [mapZoom, setMapZoom] = useState(8);

  // Simulated train live movements across Indonesia
  useEffect(() => {
    const interval = setInterval(() => {
      setTrains((prevTrains) =>
        prevTrains.map((train) => {
          // Subtle position micro-movement to simulate live GPS telemetry
          const latOffset = (Math.random() - 0.5) * 0.003;
          const lngOffset = (Math.random() - 0.5) * 0.003;
          const speedVariance = Math.floor(Math.random() * 5) - 2;

          return {
            ...train,
            currentPos: {
              lat: train.currentPos.lat + latOffset,
              lng: train.currentPos.lng + lngOffset
            },
            speed: Math.max(40, train.speed + speedVariance)
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleTrainClick = (train) => {
    setSelectedTrain(train);
    setMapCenter([train.currentPos.lat, train.currentPos.lng]);
    setMapZoom(9);
  };

  const filteredTrains = trains.filter((t) => {
    const matchesCategory =
      filterCategory === 'Semua' ||
      (filterCategory === 'Kereta Cepat' && t.category.includes('Kereta Cepat')) ||
      (filterCategory === 'Eksekutif' && t.category.includes('Eksekutif')) ||
      (filterCategory === 'Commuter' && t.category.includes('Commuter'));
    
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.destination.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="glass-panel p-6 border-emerald-500/20 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge badge-emerald">Realtime GPS Telemetry</span>
              <span className="badge badge-blue">Pulau Jawa & Sumatra</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Pemantauan Kereta Api Indonesia (KAI & WHOOSH)
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Lacak posisi langsung, kecepatan perjalanan, estimasi stasiun berikutnya, dan jadwal operasional kereta api darat.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl flex items-center gap-4">
              <div className="text-center">
                <span className="text-[11px] text-slate-400 block font-semibold">Armada Active</span>
                <span className="text-lg font-bold text-emerald-400">{trains.length} Kereta</span>
              </div>
              <div className="h-8 w-[1px] bg-slate-800" />
              <div className="text-center">
                <span className="text-[11px] text-slate-400 block font-semibold">Top Speed</span>
                <span className="text-lg font-bold text-red-400">342 km/h</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Map, Right Interactive Fleet Control */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive Map (8 cols) */}
        <div className="lg:col-span-8 glass-panel p-3 min-h-[500px] flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 mb-3">
            <div className="flex items-center gap-2">
              <Train className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-sm text-slate-200">Peta Navigasi Kereta Darat Live</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span>Update Telemetry Tiap 3s</span>
            </div>
          </div>

          <div className="relative flex-1 rounded-xl overflow-hidden min-h-[440px]">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              scrollWheelZoom={true}
              style={{ width: '100%', height: '100%', minHeight: '440px' }}
            >
              <ChangeView center={mapCenter} zoom={mapZoom} />

              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />

              {/* Draw Stations */}
              {INDONESIA_STATIONS.map((station) => (
                <Marker
                  key={station.id}
                  position={[station.lat, station.lng]}
                  icon={stationIcon}
                >
                  <Popup>
                    <div className="p-1">
                      <div className="font-bold text-emerald-400 text-sm">{station.name}</div>
                      <div className="text-xs text-slate-300">{station.city}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{station.line}</div>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Draw Train Routes & Moving Markers */}
              {trains.map((train) => {
                const isWhoosh = train.category.includes('Kereta Cepat');
                const isSelected = selectedTrain?.id === train.id;

                return (
                  <React.Fragment key={train.id}>
                    {/* Polyline Route */}
                    <Polyline
                      positions={train.routePoints}
                      pathOptions={{
                        color: train.color,
                        weight: isSelected ? 4 : 2.5,
                        dashArray: isSelected ? undefined : '6, 6',
                        opacity: isSelected ? 0.9 : 0.6
                      }}
                    />

                    {/* Moving Train Marker */}
                    <Marker
                      position={[train.currentPos.lat, train.currentPos.lng]}
                      icon={createCustomMarkerIcon(train.color, isWhoosh)}
                      eventHandlers={{
                        click: () => handleTrainClick(train)
                      }}
                    >
                      <Popup>
                        <div className="p-2 min-w-[200px]">
                          <div className="flex items-center justify-between border-b border-slate-700 pb-1 mb-2">
                            <span className="font-extrabold text-white text-sm">{train.name}</span>
                            <span className="badge badge-emerald text-[9px]">{train.speed} km/h</span>
                          </div>
                          <p className="text-xs text-slate-300 font-medium">
                            {train.origin} → {train.destination}
                          </p>
                          <div className="mt-2 text-xs text-slate-400 space-y-1">
                            <div className="flex justify-between">
                              <span>Next Station:</span>
                              <strong className="text-slate-200">{train.nextStation}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span>ETA:</span>
                              <strong className="text-emerald-400">{train.etaNextStation}</strong>
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  </React.Fragment>
                );
              })}
            </MapContainer>
          </div>
        </div>

        {/* Fleet Control & Details Side Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Search & Filter */}
          <div className="glass-panel p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari kereta (e.g. WHOOSH, Argo, Taksaka)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-custom pl-10 py-2.5 text-xs"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {['Semua', 'Kereta Cepat', 'Eksekutif', 'Commuter'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    filterCategory === cat
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* List of Filtered Trains */}
          <div className="glass-panel p-4 space-y-3 max-h-[360px] overflow-y-auto">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Daftar Perjalanan Aktif ({filteredTrains.length})
            </h3>

            {filteredTrains.map((train) => {
              const isSelected = selectedTrain?.id === train.id;
              const isWhoosh = train.category.includes('Kereta Cepat');

              return (
                <div
                  key={train.id}
                  onClick={() => handleTrainClick(train)}
                  className={`p-3.5 rounded-xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-900/40 border-white/5 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: train.color }}
                      />
                      <span className="font-bold text-sm text-white">{train.name}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isWhoosh ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {train.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mb-2 truncate">
                    {train.origin} ➔ {train.destination}
                  </p>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800 text-slate-400">
                    <div className="flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-semibold text-slate-200">{train.speed} km/h</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Next: <strong className="text-white">{train.nextStation}</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Train Quick Telemetry Info */}
          {selectedTrain && (
            <div className="glass-panel p-5 border-emerald-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                    Telemetri Terpilih
                  </span>
                  <h4 className="text-lg font-bold text-white">{selectedTrain.name}</h4>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Status Operasi</span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800">
                    {selectedTrain.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Next Station ETA</span>
                  <span className="font-bold text-amber-400 text-sm mt-0.5 block">{selectedTrain.etaNextStation}</span>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Kapasitas Kursi</span>
                  <span className="font-bold text-emerald-400 text-sm mt-0.5 block">{selectedTrain.occupancy}% Terisi</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Fasilitas Dalam Kereta:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTrain.facilities.map((fac, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">
                      ✓ {fac}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onSelectTrainForBooking(selectedTrain)}
                className="w-full btn-primary text-xs py-3"
              >
                <span>Hubungkan dengan Ojol Penjemputan Stasiun</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
