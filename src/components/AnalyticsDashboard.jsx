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
  Building2
} from 'lucide-react';
import { DISTRICT_LEADERBOARD } from '../data/mockReports';

export default function AnalyticsDashboard({ reports, theme }) {

  // Compute category breakdown
  const categoryCounts = reports.reduce((acc, report) => {
    acc[report.category] = (acc[report.category] || 0) + 1;
    return acc;
  }, {});

  const barChartData = Object.keys(categoryCounts).map(cat => ({
    name: cat,
    Laporan: categoryCounts[cat]
  }));

  // Compute status breakdown
  const statusCounts = reports.reduce((acc, report) => {
    acc[report.status] = (acc[report.status] || 0) + 1;
    return acc;
  }, {});

  const isDark = theme === 'dark';

  // Pure Black & White + Emerald palette for charts
  const pieChartData = [
    { name: 'Selesai', value: statusCounts['Selesai'] || 0, color: '#10b981' },
    { name: 'Sedang Ditangani', value: statusCounts['Sedang Ditangani'] || 0, color: isDark ? '#ffffff' : '#0a0a0a' },
    { name: 'Menunggu Verifikasi', value: statusCounts['Menunggu Verifikasi'] || 0, color: isDark ? '#525252' : '#a3a3a3' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm transition-colors">
        <div>
          <h2 className="text-xl font-black text-neutral-900 dark:text-white">
            Statistik & Insights Partisipasi Publik
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
            Analisis tren aduan warga dan efisiensi penanganan fasilitas publik per wilayah.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-lg bg-neutral-100 dark:bg-black border border-neutral-200 dark:border-neutral-800 text-center">
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block uppercase font-bold">Transparansi</span>
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">98.5%</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-lg bg-neutral-100 dark:bg-black border border-neutral-200 dark:border-neutral-800 text-center">
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block uppercase font-bold">Respon Dinas</span>
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">⚡ Cepat</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Bar Chart */}
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-3 transition-colors">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-500" />
            <h3 className="text-xs font-black text-neutral-900 dark:text-white">Kategori Aduan Masuk Bulan Ini</h3>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#262626' : '#e5e5e5'} opacity={0.6} />
                <XAxis dataKey="name" stroke={isDark ? '#a3a3a3' : '#737373'} fontSize={10} tickLine={false} />
                <YAxis stroke={isDark ? '#a3a3a3' : '#737373'} fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#000000' : '#ffffff', 
                    borderColor: isDark ? '#262626' : '#e5e5e5', 
                    borderRadius: '8px', 
                    fontSize: '11px',
                    color: isDark ? '#ffffff' : '#000000'
                  }}
                />
                <Bar dataKey="Laporan" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie/Donut Chart */}
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-3 transition-colors">
          <div className="flex items-center gap-2">
            <PieChartIcon className="w-4 h-4 text-emerald-500" />
            <h3 className="text-xs font-black text-neutral-900 dark:text-white">Rasio Status Penyelesaian Aduan</h3>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={78}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#000000' : '#ffffff', 
                    borderColor: isDark ? '#262626' : '#e5e5e5', 
                    borderRadius: '8px', 
                    fontSize: '11px',
                    color: isDark ? '#ffffff' : '#000000'
                  }}
                />
                <Legend 
                  formatter={(value) => <span className="text-neutral-700 dark:text-neutral-300 text-xs font-bold">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Leaderboard Table */}
      <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-3 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-black text-neutral-900 dark:text-white">Leaderboard Wilayah Terresponsif</h3>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-neutral-100 dark:bg-black px-2.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-800">
            Performa Minggu Ini
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 uppercase text-[10px] tracking-wider font-bold">
                <th className="py-2.5 px-3">Peringkat</th>
                <th className="py-2.5 px-3">Wilayah / Kecamatan</th>
                <th className="py-2.5 px-3">Tingkat Penyelesaian</th>
                <th className="py-2.5 px-3">Rata-rata Respon</th>
                <th className="py-2.5 px-3 text-right">Skor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {DISTRICT_LEADERBOARD.map((district, idx) => (
                <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                  <td className="py-2.5 px-3 font-bold">
                    <span className="w-5 h-5 rounded inline-flex items-center justify-center text-[11px] bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-black">
                      #{idx + 1}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{district.name}</span>
                  </td>
                  <td className="py-2.5 px-3 font-extrabold text-emerald-600 dark:text-emerald-400">
                    {district.resolvedRate}
                  </td>
                  <td className="py-2.5 px-3 text-neutral-600 dark:text-neutral-400 font-mono text-[11px]">
                    {district.avgResponse}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-neutral-900 dark:text-white">
                    <span className="bg-emerald-500 text-black font-extrabold px-2 py-0.5 rounded text-[11px]">
                      {district.score} / 100
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
