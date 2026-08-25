import React, { useState, useEffect } from 'react';
import { Vote, CheckCircle2, Users, Sparkles } from 'lucide-react';

export default function NewsPollWidget({ city = 'Jakarta', showToast }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [pollData, setPollData] = useState({
    id: 'poll-2026-mitigasi',
    question: `Apakah menurut Anda kesiapsiagaan infrastruktur drainase dan pompa air di wilayah ${city} sudah optimal?`,
    options: [
      { id: 'opt-1', label: 'Sangat Siap & Terawat Baik', votes: 142 },
      { id: 'opt-2', label: 'Cukup Siap, Namun Perlu Peningkatan Pengerukan', votes: 235 },
      { id: 'opt-3', label: 'Kurang Siap, Masih Ada Titik Rawan Genangan', votes: 118 }
    ]
  });

  useEffect(() => {
    const savedVote = localStorage.getItem(`civicpulse_poll_${pollData.id}`);
    if (savedVote) {
      setSelectedOption(savedVote);
      setHasVoted(true);
    }
  }, [pollData.id]);

  const totalVotes = pollData.options.reduce((acc, curr) => acc + curr.votes, 0) + (hasVoted ? 1 : 0);

  const handleVote = (optionId) => {
    if (hasVoted) return;

    setSelectedOption(optionId);
    setHasVoted(true);
    localStorage.setItem(`civicpulse_poll_${pollData.id}`, optionId);

    setPollData(prev => ({
      ...prev,
      options: prev.options.map(opt => 
        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
      )
    }));

    if (showToast) {
      showToast('Suara Anda Tercatat! 🗳️', 'Aspirasi warga diteruskan ke dasbor analitik mitigasi SDG 11.', 'success');
    }
  };

  return (
    <div className="bg-[#09090b] border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
      {/* Background Accent */}
      <div className="absolute top-0 left-0 w-36 h-36 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-blue-950 text-blue-400 border border-blue-800/60 flex items-center gap-1">
              <Vote className="w-3 h-3" />
              POLLING ASPIRASI WARGA
            </span>
          </div>
          <span className="flex items-center gap-1 text-[10px] text-neutral-400 font-mono">
            <Users className="w-3 h-3" />
            <span>{totalVotes} Pemilih</span>
          </span>
        </div>

        {/* Question */}
        <h4 className="text-xs sm:text-sm font-extrabold text-white leading-snug mb-4">
          {pollData.question}
        </h4>

        {/* Options List */}
        <div className="space-y-2.5">
          {pollData.options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;

            return (
              <button
                key={opt.id}
                onClick={() => handleVote(opt.id)}
                disabled={hasVoted}
                className={`w-full text-left p-3 rounded-2xl border transition-all relative overflow-hidden ${
                  isSelected
                    ? 'border-emerald-500 bg-neutral-900 shadow-md'
                    : hasVoted
                    ? 'border-neutral-800/80 bg-neutral-950/60'
                    : 'border-neutral-800 hover:border-neutral-700 bg-neutral-900/50 hover:bg-neutral-900 active:scale-[0.99]'
                }`}
              >
                {/* Progress Bar Background if voted */}
                {hasVoted && (
                  <div
                    className={`absolute inset-0 opacity-15 transition-all duration-700 ${
                      isSelected ? 'bg-emerald-500' : 'bg-neutral-400'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                )}

                <div className="relative z-10 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 flex-1">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500 text-black'
                        : 'border-neutral-600'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 fill-black text-white" />}
                    </div>
                    <span className={`font-bold ${isSelected ? 'text-emerald-400' : 'text-neutral-200'}`}>
                      {opt.label}
                    </span>
                  </div>

                  {hasVoted && (
                    <span className="font-mono font-extrabold text-white text-xs shrink-0">
                      {percentage}%
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[10px] text-neutral-400 font-mono">
        <span>{hasVoted ? '✓ Suara Anda telah dicatat' : 'Pilih opsi untuk memberikan suara'}</span>
        <span className="text-emerald-400 font-bold">SDG Target 11.3</span>
      </div>
    </div>
  );
}
