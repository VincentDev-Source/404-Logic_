import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  Trophy, 
  TrendingUp, 
  Building2, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Award,
  Sparkles
} from 'lucide-react';
import { DISTRICT_LEADERBOARD } from '../data/mockReports';

export default function AnalyticsDashboard({ reports }) {

  // Compute category breakdown from reports
  const categoryCounts = reports.reduce((acc, report) => {
    acc[report.category] = (acc[report.category] || 0) + 1;
    return acc;
  }, {});

  const barChartData = Object.keys(categoryCounts).map(cat => ({
    name: cat,
    Laporan: categoryCounts[cat]
  }));

  // Compute status breakdown from reports
  const statusCounts = reports.reduce((acc, report) => {
    acc[report.status] = (acc[report.status] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = [
    { name: 'Selesai', value: statusCounts['Selesai'] || 0, color: '#10b981' },
    { name: 'Sedang Ditangani', value: statusCounts['Sedang Ditangani'] || 0, color: '#0ea5e9' },
    { name: 'Menunggu Verifikasi', value: statusCounts['Menunggu Verifikasi'] || 0, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Smart City Insights & Data Visualizations</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Statistik Partisipasi Publik SDG 11
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Analisis tren aduan warga, rasio efisiensi penanganan dinas, dan pemeringkatan wilayah terresponsif.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <span className="text-[10px] text-slate-400 block uppercase">Indeks Transparansi</span>
            <span className="text-sm font-extrabold text-emerald-400">98.5%</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-center">
            <span className="text-[10px] text-slate-400 block uppercase">Efisiensi Respon</span>
            <span className="text-sm font-extrabold text-sky-400">⚡ High</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bar Chart: Kategori Masalah Terbanyak */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Kategori Aduan Masuk Bulan Ini</h3>
                <p className="text-[11px] text-slate-400">Distribusi jumlah laporan per kategori fasilitas</p>
              </div>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="Laporan" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie/Donut Chart: Rasio Penyelesaian Aduan */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <PieChartIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Rasio Status Penyelesaian Aduan</h3>
                <p className="text-[11px] text-slate-400">Persentase laporan yang telah diselesaikan vs diproses</p>
              </div>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend 
                  formatter={(value) => <span className="text-slate-300 text-xs font-semibold">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Leaderboard Table: Wilayah Terresponsif */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Leaderboard Wilayah Terresponsif</h3>
              <p className="text-xs text-slate-400">Kecamatan dengan kecepatan respon dan tingkat penyelesaian tertinggi</p>
            </div>
          </div>

          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
            Pembaruan Mingguan
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Peringkat</th>
                <th className="py-3 px-4">Wilayah / Kecamatan</th>
                <th className="py-3 px-4">Tingkat Penyelesaian</th>
                <th className="py-3 px-4">Rata-rata Respon</th>
                <th className="py-3 px-4">Total Aduan</th>
                <th className="py-3 px-4 text-right">Skor Performa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {DISTRICT_LEADERBOARD.map((district, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold">
                    <span className={`w-6 h-6 rounded-lg inline-flex items-center justify-center text-xs ${
                      idx === 0 ? 'bg-amber-500 text-slate-950 font-black' :
                      idx === 1 ? 'bg-slate-300 text-slate-950 font-black' :
                      idx === 2 ? 'bg-amber-700 text-white font-black' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      #{idx + 1}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{district.name}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-400">
                    {district.resolvedRate}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-mono">
                    {district.avgResponse}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {district.totalReports} laporan
                  </td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-white">
                    <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-md border border-emerald-500/20">
                      {district.score} / 100
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SDG 11 Goal Alignment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Target 11.2</span>
          <h4 className="text-xs font-bold text-white">Akses Transportasi Aman</h4>
          <p className="text-[11px] text-slate-400">
            Perbaikan rutin jalur busway dan halte difabel untuk menjamin keselamatan seluruh lapisan masyarakat.
          </p>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">Target 11.3</span>
          <h4 className="text-xs font-bold text-white">Urbanisasi Berkelanjutan</h4>
          <p className="text-[11px] text-slate-400">
            Partisipasi aktif warga dalam perencanaan dan pengelolaan infrastruktur perkotaan cerdas.
          </p>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Target 11.6</span>
          <h4 className="text-xs font-bold text-white">Manajemen Pengelolaan Limbah</h4>
          <p className="text-[11px] text-slate-400">
            Penanganan cepat tempat sampah ilegal dan sumbatan drainase demi kualitas udara dan lingkungan hidup.
          </p>
        </div>

      </div>

    </div>
  );
}
