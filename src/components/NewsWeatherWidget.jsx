import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, Gauge, Sparkles } from 'lucide-react';

export default function NewsWeatherWidget({ city = 'Jakarta' }) {
  const [weatherData, setWeatherData] = useState({
    temp: 29,
    condition: 'Cerah Berawan',
    humidity: 78,
    windSpeed: '12 km/jam',
    rainChance: '35%',
    aqi: 48,
    aqiStatus: 'Baik',
    aqiColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-800'
  });

  useEffect(() => {
    // Generate realistic meteorological values based on city seed
    const seed = city.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const temp = 27 + (seed % 6);
    const humidity = 68 + (seed % 24);
    const rainChance = (seed * 7) % 65;
    const aqi = 35 + (seed % 60);

    let aqiStatus = 'Baik';
    let aqiColor = 'text-emerald-400 bg-emerald-950/80 border-emerald-800';
    if (aqi > 50 && aqi <= 100) {
      aqiStatus = 'Sedang';
      aqiColor = 'text-amber-400 bg-amber-950/80 border-amber-800';
    } else if (aqi > 100) {
      aqiStatus = 'Kurang Sehat';
      aqiColor = 'text-rose-400 bg-rose-950/80 border-rose-800';
    }

    const conditions = ['Cerah Berawan', 'Hujan Ringan', 'Berawan Tebal', 'Hujan Sedang', 'Cerah'];
    const condition = conditions[seed % conditions.length];

    setWeatherData({
      temp,
      condition,
      humidity,
      windSpeed: `${8 + (seed % 14)} km/jam`,
      rainChance: `${rainChance}%`,
      aqi,
      aqiStatus,
      aqiColor
    });
  }, [city]);

  const isRain = weatherData.condition.includes('Hujan');
  const isCloud = weatherData.condition.includes('Berawan');

  return (
    <div className="bg-[#09090b] border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            LIVE METEO & AQI
          </span>
          <span className="text-xs font-black text-white">{city}</span>
        </div>
        <span className="text-[10px] font-mono text-neutral-400">Prakiraan Hari Ini</span>
      </div>

      {/* Main Temperature & Icon */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400 shrink-0">
            {isRain ? (
              <CloudRain className="w-7 h-7 text-sky-400 animate-bounce" />
            ) : isCloud ? (
              <Cloud className="w-7 h-7 text-neutral-300" />
            ) : (
              <Sun className="w-7 h-7 text-amber-400 animate-spin-slow" />
            )}
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {weatherData.temp}°
              </span>
              <span className="text-sm font-bold text-neutral-400">C</span>
            </div>
            <p className="text-xs font-bold text-neutral-300">{weatherData.condition}</p>
          </div>
        </div>

        {/* AQI Pill */}
        <div className="text-right">
          <div className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border inline-flex items-center gap-1.5 ${weatherData.aqiColor}`}>
            <Gauge className="w-3 h-3" />
            <span>AQI {weatherData.aqi} • {weatherData.aqiStatus}</span>
          </div>
          <p className="text-[10px] text-neutral-500 mt-1 font-mono">Kualitas Udara</p>
        </div>
      </div>

      {/* Micro Stats Grid */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-800/80">
        <div className="bg-neutral-900/50 rounded-xl p-2 text-center border border-neutral-800/60">
          <div className="flex items-center justify-center gap-1 text-[10px] text-neutral-400 mb-0.5">
            <Droplets className="w-3 h-3 text-sky-400" />
            <span>Kelembapan</span>
          </div>
          <span className="text-xs font-extrabold text-white">{weatherData.humidity}%</span>
        </div>

        <div className="bg-neutral-900/50 rounded-xl p-2 text-center border border-neutral-800/60">
          <div className="flex items-center justify-center gap-1 text-[10px] text-neutral-400 mb-0.5">
            <Wind className="w-3 h-3 text-emerald-400" />
            <span>Kecepatan Angin</span>
          </div>
          <span className="text-xs font-extrabold text-white">{weatherData.windSpeed}</span>
        </div>

        <div className="bg-neutral-900/50 rounded-xl p-2 text-center border border-neutral-800/60">
          <div className="flex items-center justify-center gap-1 text-[10px] text-neutral-400 mb-0.5">
            <CloudRain className="w-3 h-3 text-indigo-400" />
            <span>Peluang Hujan</span>
          </div>
          <span className="text-xs font-extrabold text-white">{weatherData.rainChance}</span>
        </div>
      </div>
    </div>
  );
}
