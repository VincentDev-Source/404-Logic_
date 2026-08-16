import React from 'react';
import { Train, ShieldCheck, Heart, Lock, Globe } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-16 border-t border-white/10 bg-slate-950/80 pt-12 pb-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
                NT
              </div>
              <span className="font-extrabold text-lg text-white">NusaTransit Indonesia</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Pusat Akomodasi & Transportasi Darat Terpadu Wilayah Republik Indonesia. Menyediakan pelacakan kereta api KAI & WHOOSH secara real-time, simulator pemesanan Ojol interaktif, serta integrasi gateway pembayaran resmi Stripe.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <span className="badge badge-emerald">Stripe Payments Enabled</span>
              <span className="badge badge-blue">KAI & KCIC Integrated</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Layanan Transportasi</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-emerald-400 transition">Kereta Cepat WHOOSH</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition">KAI Eksekutif & Luxury</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition">NusaRide Ojol Motor & Mobil</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition">Bus Interkota DAMRI & Primajasa</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Keamanan & Pembayaran</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-emerald-400" /> Stripe SSL 256-Bit</li>
              <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Asuransi Perjalanan Jasa Raharja</li>
              <li className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-amber-400" /> Coverage: Jawa, Bali & Sumatra</li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} NusaTransit. Pusat Transportasi Darat Indonesia. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-1">
            <span>Dibuat dengan</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" />
            <span>untuk Kemajuan Mobility Darat Indonesia</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
