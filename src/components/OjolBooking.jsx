import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import confetti from 'canvas-confetti';
import {
  Navigation, MapPin, Bike, Car, Truck, Sparkles, Phone, MessageSquare,
  Star, CheckCircle2, ShieldCheck, CreditCard, ArrowRight, Tag, RefreshCw, X, Shield
} from 'lucide-react';
import { OJOL_SERVICES, OJOL_PRESET_LOCATIONS, DUMMY_DRIVERS } from '../data/indonesiaTransportData';
import { formatIDR, formatUSD } from '../services/stripeService';

// Custom Leaflet Icons for Ojol
const pickupPinIcon = L.divIcon({
  html: `
    <div style="background: #10b981; color: white; border: 2px solid white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; box-shadow: 0 0 10px rgba(16,185,129,0.8);">
      A
    </div>
  `,
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const dropoffPinIcon = L.divIcon({
  html: `
    <div style="background: #ef4444; color: white; border: 2px solid white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; box-shadow: 0 0 10px rgba(239,68,68,0.8);">
      B
    </div>
  `,
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const driverMapIcon = L.divIcon({
  html: `
    <div style="background: #0f172a; border: 2px solid #10b981; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; color: #10b981; box-shadow: 0 0 15px rgba(16,185,129,0.9);" class="pulse-ojol-marker">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="1" y="3" width="15" height="13" rx="2"></rect>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
        <circle cx="5.5" cy="18.5" r="2.5"></circle>
        <circle cx="18.5" cy="18.5" r="2.5"></circle>
      </svg>
    </div>
  `,
  className: '',
  iconSize: [34, 34],
  iconAnchor: [17, 17]
});

function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 13);
  }, [center, map]);
  return null;
}

// Distance calculator (Haversine formula in KM)
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = R * c;
  return Math.max(1.2, parseFloat(dist.toFixed(1)));
}

export const OjolBooking = ({ onRequestPayment, activeBookingState, onResetBooking }) => {
  // Preset defaults (Gambir -> Monas)
  const [pickup, setPickup] = useState({
    name: 'Stasiun Gambir (Pintu Selatan)',
    lat: -6.1767,
    lng: 106.8306
  });

  const [destination, setDestination] = useState({
    name: 'Grand Indonesia Mall',
    lat: -6.1951,
    lng: 106.8202
  });

  const [selectedService, setSelectedService] = useState(OJOL_SERVICES[0]);
  const [promoCode, setPromoCode] = useState('NUSA50');
  const [discountAmount, setDiscountAmount] = useState(15000);
  const [promoApplied, setPromoApplied] = useState(true);

  // Live simulation states
  const [bookingStep, setBookingStep] = useState(activeBookingState?.step || 'IDLE'); 
  // IDLE -> SEARCHING -> MATCHED -> TRIP_IN_PROGRESS -> COMPLETED
  const [assignedDriver, setAssignedDriver] = useState(null);
  const [driverPos, setDriverPos] = useState(null);
  const [tripProgressPercent, setTripProgressPercent] = useState(0);
  const [tripStatusText, setTripStatusText] = useState('');

  // Calculate distance & fare
  const distanceKm = calculateDistanceKm(pickup.lat, pickup.lng, destination.lat, destination.lng);
  const rawFare = Math.round(selectedService.baseFare + (distanceKm * selectedService.pricePerKm));
  const finalFare = Math.max(4000, rawFare - (promoApplied ? discountAmount : 0));

  // Handle preset spot selection
  const handleSelectSpot = (spot, type) => {
    if (type === 'PICKUP') {
      setPickup(spot);
    } else {
      setDestination(spot);
    }
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'NUSA50') {
      setDiscountAmount(15000);
      setPromoApplied(true);
    } else if (promoCode.trim().toUpperCase() === 'OJOLJUARA') {
      setDiscountAmount(10000);
      setPromoApplied(true);
    } else if (promoCode.trim().toUpperCase() === 'RAMADAN50') {
      setDiscountAmount(20000);
      setPromoApplied(true);
    } else {
      alert('Kode Promo tidak ditemukan. Coba: NUSA50, OJOLJUARA, atau RAMADAN50');
    }
  };

  // Trigger Stripe Payment Modal
  const handleProceedToPayment = () => {
    const bookingDetails = {
      pickup,
      destination,
      service: selectedService,
      distanceKm,
      rawFare,
      discountAmount: promoApplied ? discountAmount : 0,
      finalFare
    };
    onRequestPayment(bookingDetails);
  };

  // Watch external booking state from parent (after Stripe payment succeeds)
  useEffect(() => {
    if (activeBookingState?.status === 'PAID') {
      startDriverMatchingWorkflow();
    }
  }, [activeBookingState]);

  // Workflow simulation after successful payment
  const startDriverMatchingWorkflow = () => {
    setBookingStep('SEARCHING');

    // Simulate 3s radar driver matching
    setTimeout(() => {
      const driver = DUMMY_DRIVERS[Math.floor(Math.random() * DUMMY_DRIVERS.length)];
      setAssignedDriver(driver);
      setBookingStep('MATCHED');

      // Set initial driver position slightly away from pickup
      const initDriverLat = pickup.lat + 0.008;
      const initDriverLng = pickup.lng + 0.008;
      setDriverPos({ lat: initDriverLat, lng: initDriverLng });
      setTripStatusText(`Driver ${driver.name} sedang menuju lokasi penjemputan (${pickup.name})...`);

      // Start movement simulation towards pickup then destination
      let stepCount = 0;
      const totalSteps = 20;

      const timer = setInterval(() => {
        stepCount++;
        const progress = Math.min(100, Math.round((stepCount / totalSteps) * 100));
        setTripProgressPercent(progress);

        if (stepCount <= 8) {
          // Phase 1: Moving to pickup
          setBookingStep('TRIP_IN_PROGRESS');
          setTripStatusText(`Menuju Lokasi Penjemputan (${progress}%)...`);
          const ratio = stepCount / 8;
          setDriverPos({
            lat: initDriverLat + (pickup.lat - initDriverLat) * ratio,
            lng: initDriverLng + (pickup.lng - initDriverLng) * ratio
          });
        } else if (stepCount <= 19) {
          // Phase 2: Moving from pickup to destination
          setTripStatusText(`Dalam Perjalanan ke ${destination.name} (${progress}%)...`);
          const ratio = (stepCount - 8) / 11;
          setDriverPos({
            lat: pickup.lat + (destination.lat - pickup.lat) * ratio,
            lng: pickup.lng + (destination.lng - pickup.lng) * ratio
          });
        } else {
          // Phase 3: Arrived & Completed
          clearInterval(timer);
          setDriverPos({ lat: destination.lat, lng: destination.lng });
          setBookingStep('COMPLETED');
          setTripStatusText('Perjalanan Selesai! Terima kasih telah menggunakan NusaRide.');
          
          // Fire celebration confetti
          try {
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          } catch (e) {
            console.log(e);
          }
        }
      }, 900);

    }, 3000);
  };

  const handleResetTrip = () => {
    setBookingStep('IDLE');
    setAssignedDriver(null);
    setDriverPos(null);
    setTripProgressPercent(0);
    if (onResetBooking) onResetBooking();
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 border-emerald-500/20 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge badge-emerald">NusaRide Ojol Simulator</span>
              <span className="badge badge-blue">Stripe Checkout Ready</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Pesan Ojol Dummy Interaktif
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Pilih lokasi awal & tujuan di Indonesia, tentukan armada (Motor/Mobil), bayar via Stripe modal, dan pantau animasi driver live di peta.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <div>
              <span className="text-xs text-slate-300 font-bold block">100% Asuransi Perjalanan</span>
              <span className="text-[11px] text-slate-400">Proteksi Penumpang Jasa Raharja</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form & Services OR Live Tracking Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* STATE 1: Booking Form */}
          {bookingStep === 'IDLE' && (
            <div className="glass-panel p-5 space-y-4">
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <Navigation className="w-5 h-5 text-emerald-400" />
                <span>Atur Perjalanan NusaRide</span>
              </h2>

              {/* Pickup & Destination Controls */}
              <div className="space-y-3 relative">
                <div className="absolute left-[19px] top-9 bottom-9 w-0.5 bg-slate-700 border-dashed border-l border-slate-600 pointer-events-none" />

                {/* Pickup Field */}
                <div>
                  <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mb-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    <span>Lokasi Penjemputan (Titik A)</span>
                  </label>
                  <input
                    type="text"
                    value={pickup.name}
                    onChange={(e) => setPickup({ ...pickup, name: e.target.value })}
                    className="input-custom text-xs font-semibold"
                  />
                </div>

                {/* Destination Field */}
                <div>
                  <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mb-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                    <span>Lokasi Tujuan (Titik B)</span>
                  </label>
                  <input
                    type="text"
                    value={destination.name}
                    onChange={(e) => setDestination({ ...destination, name: e.target.value })}
                    className="input-custom text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Quick Presets Picker */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Pilihan Lokasi Populer Indonesia:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {OJOL_PRESET_LOCATIONS[0].spots.slice(0, 4).map((spot, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSpot(spot, 'DROP')}
                      className="text-[10px] bg-slate-900/80 hover:bg-slate-800 text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
                    >
                      📍 {spot.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vehicle Options Grid */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-xs font-bold text-slate-400 block">Pilih Jenis Kendaraan:</label>
                <div className="grid grid-cols-2 gap-2">
                  {OJOL_SERVICES.map((srv) => {
                    const isSelected = selectedService.id === srv.id;
                    const calculatedPrice = Math.round(srv.baseFare + (distanceKm * srv.pricePerKm));

                    return (
                      <div
                        key={srv.id}
                        onClick={() => setSelectedService(srv)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-slate-800/90 border-emerald-500 shadow-md shadow-emerald-500/10'
                            : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-white">{srv.name}</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                            {srv.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mb-1">{srv.tagline}</p>
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                          <span className="text-slate-400">{srv.estimatedMin}</span>
                          <span className="font-bold text-emerald-400">{formatIDR(calculatedPrice)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Promo Code Input */}
              <div className="pt-2 border-t border-slate-800">
                <label className="text-xs font-bold text-slate-400 flex items-center gap-1 mb-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kode Voucher Diskon Promo:</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="input-custom py-2 text-xs uppercase font-mono tracking-wider"
                    placeholder="E.g. NUSA50"
                  />
                  <button onClick={handleApplyPromo} className="btn-secondary py-2 text-xs">
                    Gunakan
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                    ✓ Voucher Terpasang: Potongan Diskon {formatIDR(discountAmount)}
                  </p>
                )}
              </div>

              {/* Fare Summary & Stripe Trigger Button */}
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Jarak Perkiraan:</span>
                  <span className="font-bold text-slate-200">{distanceKm} KM</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Tarif Normal:</span>
                  <span>{formatIDR(rawFare)}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-xs text-emerald-400">
                    <span>Diskon Promo ({promoCode}):</span>
                    <span>-{formatIDR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-slate-800">
                  <span>Total Biaya:</span>
                  <span className="text-emerald-400 text-base">{formatIDR(finalFare)}</span>
                </div>

                <button
                  onClick={handleProceedToPayment}
                  className="w-full btn-primary py-3 text-sm mt-3"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Bayar {formatIDR(finalFare)} via Stripe</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* STATE 2: Searching Driver Radar */}
          {bookingStep === 'SEARCHING' && (
            <div className="glass-panel p-8 text-center space-y-4 border-emerald-500/40">
              <div className="radar-container">
                <div className="radar-sweep" />
                <Bike className="w-10 h-10 text-emerald-400 relative z-10 animate-bounce" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">Mencari Pengemudi Terdekat...</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Sistem NusaRide sedang menghubungkan pesanan Anda dengan mitra pengemudi terdekat di sekitar {pickup.name}.
                </p>
              </div>
              <div className="inline-block bg-slate-900 px-4 py-2 rounded-xl text-xs text-emerald-400 font-mono border border-emerald-800/50">
                Stripe Payment Confirmed ✓
              </div>
            </div>
          )}

          {/* STATE 3 & 4: Matched & Trip in Progress */}
          {(bookingStep === 'MATCHED' || bookingStep === 'TRIP_IN_PROGRESS') && assignedDriver && (
            <div className="glass-panel p-5 space-y-4 border-emerald-500/40">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="badge badge-emerald text-[10px] mb-1">Pengemudi Ditemukan</span>
                  <h3 className="text-base font-extrabold text-white">{assignedDriver.name}</h3>
                </div>
                <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-lg text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{assignedDriver.rating}</span>
                </div>
              </div>

              {/* Driver Card Info */}
              <div className="flex items-center gap-4 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <img
                  src={assignedDriver.photo}
                  alt={assignedDriver.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500"
                />
                <div className="space-y-0.5">
                  <p className="text-xs font-extrabold text-white">{assignedDriver.vehicleName}</p>
                  <span className="inline-block bg-slate-800 text-emerald-400 font-mono text-xs font-bold px-2 py-0.5 rounded">
                    {assignedDriver.plateNumber}
                  </span>
                  <p className="text-[10px] text-slate-400">{assignedDriver.trips} • Mitra {assignedDriver.joinedYears}</p>
                </div>
              </div>

              {/* Live Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">{tripStatusText}</span>
                  <span className="text-emerald-400 font-mono">{tripProgressPercent}%</span>
                </div>
                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
                    style={{ width: `${tripProgressPercent}%` }}
                  />
                </div>
              </div>

              {/* Call / Chat Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => alert(`Menghubungi telepon driver: ${assignedDriver.phone}`)}
                  className="flex-1 btn-secondary text-xs py-2.5"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Telepon</span>
                </button>
                <button
                  onClick={() => alert('Membuka obrolan chat dengan mitra pengemudi...')}
                  className="flex-1 btn-secondary text-xs py-2.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                  <span>Chat Driver</span>
                </button>
              </div>
            </div>
          )}

          {/* STATE 5: Trip Completed Summary */}
          {bookingStep === 'COMPLETED' && assignedDriver && (
            <div className="glass-panel p-6 text-center space-y-4 border-emerald-500">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">Perjalanan Selesai!</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Anda telah sampai di tujuan: <strong className="text-white">{destination.name}</strong>.
                </p>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Mitra Pengemudi:</span>
                  <span className="font-bold text-white">{assignedDriver.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Terbayar (Stripe):</span>
                  <span className="font-bold text-emerald-400">{formatIDR(finalFare)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status Pembayaran:</span>
                  <span className="text-emerald-400 font-bold">LUNAS / VERIFIED ✓</span>
                </div>
              </div>

              <button onClick={handleResetTrip} className="w-full btn-primary py-3 text-sm">
                <span>Pesan Perjalanan Baru</span>
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

        {/* Right Column: Interactive Map (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-3 min-h-[520px] flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-sm text-slate-200">Peta Rute & Visualisasi Live Driver</span>
            </div>
            <span className="text-xs text-slate-400">Distance: {distanceKm} KM</span>
          </div>

          <div className="relative flex-1 rounded-xl overflow-hidden min-h-[460px]">
            <MapContainer
              center={[pickup.lat, pickup.lng]}
              zoom={13}
              scrollWheelZoom={true}
              style={{ width: '100%', height: '100%', minHeight: '460px' }}
            >
              <RecenterMap center={driverPos ? [driverPos.lat, driverPos.lng] : [pickup.lat, pickup.lng]} />

              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />

              {/* Point A: Pickup Marker */}
              <Marker position={[pickup.lat, pickup.lng]} icon={pickupPinIcon}>
                <Popup>
                  <div className="p-1">
                    <span className="font-bold text-emerald-400 text-xs">Penjemputan (A)</span>
                    <p className="text-xs text-slate-200">{pickup.name}</p>
                  </div>
                </Popup>
              </Marker>

              {/* Point B: Destination Marker */}
              <Marker position={[destination.lat, destination.lng]} icon={dropoffPinIcon}>
                <Popup>
                  <div className="p-1">
                    <span className="font-bold text-red-400 text-xs">Tujuan (B)</span>
                    <p className="text-xs text-slate-200">{destination.name}</p>
                  </div>
                </Popup>
              </Marker>

              {/* Route Polyline */}
              <Polyline
                positions={[
                  [pickup.lat, pickup.lng],
                  [destination.lat, destination.lng]
                ]}
                pathOptions={{
                  color: '#10b981',
                  weight: 4,
                  dashArray: '8, 8',
                  opacity: 0.8
                }}
              />

              {/* Live Animated Driver Position Marker */}
              {driverPos && (
                <Marker position={[driverPos.lat, driverPos.lng]} icon={driverMapIcon}>
                  <Popup>
                    <div className="p-1">
                      <span className="font-bold text-emerald-400 text-xs">Pengemudi NusaRide</span>
                      <p className="text-xs text-white">{assignedDriver?.name} ({assignedDriver?.plateNumber})</p>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
