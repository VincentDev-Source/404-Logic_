import React, { useState } from 'react';
import { Bus, Clock, Search, ShieldCheck, Ticket, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { BUS_SHUTTLE_SCHEDULES } from '../data/indonesiaTransportData';
import { formatIDR } from '../services/stripeService';

export const BusSchedule = ({ onBookShuttle }) => {
  const [search, setSearch] = useState('');
  const [selectedBus, setSelectedBus] = useState(null);

  const filteredBuses = BUS_SHUTTLE_SCHEDULES.filter(
    (b) =>
      b.operator.toLowerCase().includes(search.toLowerCase()) ||
      b.route.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 border-emerald-500/20 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge badge-amber">AKAP & Shuttle Interkota</span>
              <span className="badge badge-emerald">Jalur Tol Trans-Jawa</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Jadwal Bus Antarkota & Travel Shuttle
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Temukan armada bus eksekutif DAMRI, Primajasa, dan shuttle Cititrans / DayTrans untuk perjalanan darat Indonesia.
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari rute bus (e.g. Bandung, Gambir, Semarang)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-custom pl-10 py-2.5 text-xs min-w-[260px]"
            />
          </div>
        </div>
      </div>

      {/* Grid of Bus Operators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBuses.map((bus) => (
          <div
            key={bus.id}
            className="glass-card p-5 space-y-3 flex flex-col justify-between border-slate-800 hover:border-emerald-500/40"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-white text-base flex items-center gap-2">
                  <Bus className="w-5 h-5 text-emerald-400" />
                  <span>{bus.operator}</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                  {bus.type}
                </span>
              </div>

              <p className="text-xs text-slate-300 font-semibold mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>{bus.route}</span>
              </p>

              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1 text-xs text-slate-400 mb-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Jadwal Keberangkatan:</span>
                  </span>
                  <strong className="text-slate-200">{bus.time}</strong>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {bus.amenities.map((am, idx) => (
                  <span key={idx} className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                    ✓ {am}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div>
                <span className="text-[11px] text-slate-400 block">Tarif Per Tiket:</span>
                <span className="text-lg font-extrabold text-emerald-400">{formatIDR(bus.price)}</span>
              </div>
              <button
                onClick={() => onBookShuttle(bus)}
                className="btn-primary text-xs py-2.5 px-4"
              >
                <span>Pesan Tiket Shuttle</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
