import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Volume2,
  VolumeX,
  Pause,
  Play,
  Bookmark,
  Share2,
  ExternalLink,
  ThumbsUp,
  AlertTriangle,
  Lightbulb,
  Heart,
  Send,
  MessageSquare,
  Sparkles,
  Clock,
  Newspaper,
  CheckCircle2,
  PlusCircle,
  Copy,
  Check,
  User,
  ShieldCheck,
  Calendar,
  Eye
} from 'lucide-react';

export default function NewsReaderModal({
  article,
  isOpen,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onOpenReportModalWithContext,
  showToast
}) {
  // TTS State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAudioPaused, setIsAudioPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const utteranceRef = useRef(null);

  // Reactions state (persisted in localStorage, starts at 0 without dummy counts)
  const [reactions, setReactions] = useState({
    helpful: 0,
    warning: 0,
    innovative: 0,
    appreciate: 0,
    userReacted: null
  });

  // Comments state (persisted in localStorage, real citizen comments only)
  const [comments, setComments] = useState([]);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Real views state
  const [viewsCount, setViewsCount] = useState(0);

  // Share dropdown state & copy feedback
  const [copiedLink, setCopiedLink] = useState(false);

  // Load reactions, comments & views from localStorage for this specific article
  useEffect(() => {
    if (!article) return;

    // 1. Load real reactions
    const reactKey = `civicpulse_news_react_v2_${article.id}`;
    const legacyReactKey = `civicpulse_news_react_${article.id}`;
    
    // Purge legacy dummy seeded reactions
    localStorage.removeItem(legacyReactKey);

    const savedReactions = localStorage.getItem(reactKey);
    if (savedReactions) {
      try {
        const parsed = JSON.parse(savedReactions);
        setReactions({
          helpful: Math.max(0, parseInt(parsed.helpful, 10) || 0),
          warning: Math.max(0, parseInt(parsed.warning, 10) || 0),
          innovative: Math.max(0, parseInt(parsed.innovative, 10) || 0),
          appreciate: Math.max(0, parseInt(parsed.appreciate, 10) || 0),
          userReacted: parsed.userReacted || null
        });
      } catch (e) {
        setReactions({ helpful: 0, warning: 0, innovative: 0, appreciate: 0, userReacted: null });
      }
    } else {
      setReactions({ helpful: 0, warning: 0, innovative: 0, appreciate: 0, userReacted: null });
    }

    // 2. Load real comments (filtering out any legacy dummy 'Budi Santoso' or 'c-init-1')
    const commentsKey = `civicpulse_news_comments_v2_${article.id}`;
    const legacyCommentsKey = `civicpulse_news_comments_${article.id}`;

    // Clean up any legacy dummy comments
    const oldCommentsRaw = localStorage.getItem(legacyCommentsKey);
    let realMigrated = [];
    if (oldCommentsRaw) {
      try {
        const parsedOld = JSON.parse(oldCommentsRaw);
        if (Array.isArray(parsedOld)) {
          realMigrated = parsedOld.filter(
            c => c.id !== 'c-init-1' && 
                 !c.name?.includes('Budi Santoso') && 
                 !c.text?.includes('Di pertigaan jalan dekat pos ronda')
          );
        }
      } catch (e) {}
      localStorage.removeItem(legacyCommentsKey);
    }

    const savedComments = localStorage.getItem(commentsKey);
    if (savedComments) {
      try {
        const parsed = JSON.parse(savedComments);
        const valid = Array.isArray(parsed)
          ? parsed.filter(
              c => c.id !== 'c-init-1' && 
                   !c.name?.includes('Budi Santoso') && 
                   !c.text?.includes('Di pertigaan jalan dekat pos ronda')
            )
          : [];
        setComments(valid);
      } catch (e) {
        setComments([]);
      }
    } else if (realMigrated.length > 0) {
      setComments(realMigrated);
      localStorage.setItem(commentsKey, JSON.stringify(realMigrated));
    } else {
      setComments([]);
    }

    // 3. Track real views per article session
    const viewsKey = `civicpulse_news_views_${article.id}`;
    let currentViews = parseInt(localStorage.getItem(viewsKey), 10) || 0;
    if (isOpen) {
      currentViews += 1;
      localStorage.setItem(viewsKey, currentViews.toString());
    }
    setViewsCount(currentViews);

    // Stop TTS if modal changes or closes
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      setIsAudioPaused(false);
    };
  }, [article, isOpen]);

  // Audio Voice Reader (Web Speech API)
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      if (showToast) showToast('Fitur Audio Tidak Didukung', 'Browser Anda belum mendukung Web Speech API.', 'error');
      return;
    }

    if (isPlayingAudio) {
      if (isAudioPaused) {
        window.speechSynthesis.resume();
        setIsAudioPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsAudioPaused(true);
      }
      return;
    }

    window.speechSynthesis.cancel();

    const fullText = `${article.title}. ${article.description}. Poin penting: ${(article.aiSummary || []).join('. ')}. ${article.fullContent || ''}`;
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = 'id-ID';
    utterance.rate = speechRate;

    // Select Indonesian voice if available
    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID'));
    if (idVoice) utterance.voice = idVoice;

    utterance.onstart = () => {
      setIsPlayingAudio(true);
      setIsAudioPaused(false);
    };

    utterance.onend = () => {
      setIsPlayingAudio(false);
      setIsAudioPaused(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setIsAudioPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setIsAudioPaused(false);
  };

  // Handle Reaction Click (Persistent, toggles user reaction and updates counts)
  const handleReactionClick = (type) => {
    if (!article) return;

    setReactions(prev => {
      const isAlready = prev.userReacted === type;
      let next;

      if (isAlready) {
        // Toggle off the reaction
        next = {
          ...prev,
          [type]: Math.max(0, (prev[type] || 0) - 1),
          userReacted: null
        };
      } else {
        // Increment new reaction
        next = {
          ...prev,
          [type]: (prev[type] || 0) + 1,
          userReacted: type
        };
        // If switching from another reaction, decrement the previous one
        if (prev.userReacted && prev.userReacted !== type) {
          next[prev.userReacted] = Math.max(0, (next[prev.userReacted] || 0) - 1);
        }
      }

      const reactKey = `civicpulse_news_react_v2_${article.id}`;
      localStorage.setItem(reactKey, JSON.stringify(next));
      return next;
    });

    if (showToast) {
      showToast('Respon Tersimpan', 'Terima kasih atas partisipasi suara warga Anda!', 'success');
    }
  };

  // Handle Submit Comment / Field Report (Persistent real-time storage)
  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !article) return;

    setIsSubmittingComment(true);

    const now = new Date();
    const timeFormatted = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(now);

    const newEntry = {
      id: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: newCommentName.trim() || 'Warga Lokal',
      text: newCommentText.trim(),
      time: timeFormatted,
      timestamp: Date.now(),
      verified: true
    };

    const updated = [newEntry, ...comments];
    setComments(updated);

    const commentsKey = `civicpulse_news_comments_v2_${article.id}`;
    localStorage.setItem(commentsKey, JSON.stringify(updated));

    setNewCommentText('');
    setNewCommentName('');
    setIsSubmittingComment(false);

    if (showToast) {
      showToast('Catatan Lapangan Terkirim 🎉', 'Kontribusi pantauan Anda berhasil disimpan secara real-time.', 'success');
    }
  };

  // Handle Share Actions
  const handleCopyLink = () => {
    const url = article.url || window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
    if (showToast) showToast('Tautan Disalin 📋', 'Link berita berhasil disalin ke papan klip.', 'success');
  };

  const handleShareSocial = (platform) => {
    const text = encodeURIComponent(`[CivicPulse Berita Kota] ${article.title}\n\nBaca selengkapnya di portal CivicPulse SDG 11.`);
    const url = encodeURIComponent(article.url || window.location.href);

    let shareUrl = '';
    if (platform === 'wa') {
      shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
    } else if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    } else if (platform === 'telegram') {
      shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (!isOpen || !article) return null;

  const isDisaster = article.category === 'Bencana & Cuaca';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-3xl bg-[#09090b] border border-neutral-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[calc(100dvh-1rem)] sm:max-h-[92vh] flex flex-col text-neutral-200"
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5 border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-20 shrink-0">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                isDisaster
                  ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                  : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
              }`}>
                {article.category}
              </span>
              <span className="text-[11px] text-neutral-400 font-mono hidden sm:inline-block">
                • {article.readTime || '2 min baca'}
              </span>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-1.5">
              {/* Bookmark Button */}
              <button
                onClick={() => onToggleBookmark(article)}
                className={`p-2 rounded-xl border transition-all active:scale-95 ${
                  isBookmarked
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
                title={isBookmarked ? 'Hapus dari Tersimpan' : 'Simpan Berita'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
                title="Tutup (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Reader Body */}
          <div className="overflow-y-auto px-5 sm:px-7 py-6 space-y-6 flex-1 custom-scrollbar">
            
            {/* Title & Metadata */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-snug">
                {article.title}
              </h2>

              <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-neutral-400 border-b border-neutral-800/80 pb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Newspaper className="w-4 h-4 text-emerald-400" />
                    <span>{article.source}</span>
                  </span>
                  {article.verified && (
                    <span className="px-2 py-0.5 rounded-md bg-blue-950/80 border border-blue-800 text-blue-400 text-[10px] font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Terverifikasi
                    </span>
                  )}
                  <span className="text-neutral-500">•</span>
                  <span className="flex items-center gap-1 text-neutral-400 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{new Date(article.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-neutral-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Eye className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{viewsCount || article.views || 1} pembaca</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Hero Image Container */}
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-black aspect-video max-h-[360px]">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=1200&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Audio Voice Reader Bar (Text-to-Speech) */}
            <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                  <Volume2 className={`w-5 h-5 ${isPlayingAudio && !isAudioPaused ? 'animate-pulse' : ''}`} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Audio Voice Reader (AI Warga)</span>
                    {isPlayingAudio && !isAudioPaused && (
                      <span className="px-2 py-0.2 text-[9px] font-mono bg-emerald-500 text-black rounded font-bold animate-pulse">
                        PLAYING
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-neutral-400">
                    Dengarkan narasi intisari berita secara hands-free.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={handleToggleSpeech}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-md"
                >
                  {isPlayingAudio && !isAudioPaused ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Jeda</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-black" />
                      <span>{isAudioPaused ? 'Lanjutkan' : 'Dengarkan Berita'}</span>
                    </>
                  )}
                </button>

                {isPlayingAudio && (
                  <button
                    onClick={handleStopSpeech}
                    className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-bold transition-all"
                    title="Hentikan Audio"
                  >
                    <VolumeX className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* AI Summary Box */}
            {article.aiSummary && article.aiSummary.length > 0 && (
              <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 font-mono">
                  <Sparkles className="w-4 h-4" />
                  <span>RINGKASAN CEPAT AI CIVICPULSE (TL;DR)</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-neutral-300">
                  {article.aiSummary.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Full Article Content */}
            <div className="space-y-4 text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
              <p className="font-medium text-white text-base sm:text-lg">
                {article.description}
              </p>
              {article.fullContent && (
                <div className="space-y-3 pt-2 text-neutral-300 whitespace-pre-line leading-relaxed">
                  {article.fullContent}
                </div>
              )}
            </div>

            {/* Tags / Hashtags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-2">
                {article.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-emerald-400 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Citizen Action Bar: Report Related Civic Issue */}
            <div className="bg-gradient-to-r from-neutral-900 to-neutral-900/60 border border-neutral-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-white">
                  Menemukan kendala serupa di lokasi Anda?
                </h4>
                <p className="text-xs text-neutral-400">
                  Kirimkan laporan aduan instan ke dinas teknis pemerintah kota.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  if (onOpenReportModalWithContext) {
                    onOpenReportModalWithContext({
                      title: `Aduan Lapangan terkait: ${article.title.slice(0, 60)}...`,
                      category: article.category.includes('Bencana') ? 'Bencana Alam / Banjir' : 'Jalan Rusak / Fasilitas',
                      description: `Menindaklanjuti informasi berita "${article.title}". Kondisi terkini di lokasi membutuhkan perhatian petugas dinas terkait.`
                    });
                  }
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Buat Aduan Terkait</span>
              </button>
            </div>

            {/* Interactive Citizen Reactions (100% Real Data, Zero Dummy) */}
            <div className="border-t border-neutral-800/80 pt-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">
                  RESPON & SUARA WARGA
                </h4>
                <span className="text-[10px] text-neutral-500 font-mono">
                  {reactions.userReacted ? 'Respon Anda Tersimpan' : 'Klik untuk merespon'}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { key: 'helpful', label: 'Bermanfaat', icon: ThumbsUp, color: 'text-emerald-400', count: reactions.helpful },
                  { key: 'warning', label: 'Waspada', icon: AlertTriangle, color: 'text-amber-400', count: reactions.warning },
                  { key: 'innovative', label: 'Solutif', icon: Lightbulb, color: 'text-blue-400', count: reactions.innovative },
                  { key: 'appreciate', label: 'Apresiasi', icon: Heart, color: 'text-rose-400', count: reactions.appreciate }
                ].map(r => {
                  const Icon = r.icon;
                  const isSelected = reactions.userReacted === r.key;
                  return (
                    <button
                      key={r.key}
                      onClick={() => handleReactionClick(r.key)}
                      className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 ${
                        isSelected
                          ? 'bg-neutral-800 border-emerald-500 shadow-md scale-[1.02]'
                          : 'bg-neutral-900/60 hover:bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                      title={isSelected ? `Batalkan respon ${r.label}` : `Beri respon ${r.label}`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? r.color : 'text-neutral-400'}`} />
                      <span className="text-xs font-extrabold text-white">{r.count}</span>
                      <span className="text-[10px] text-neutral-400 font-medium">{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Citizen Comments & Field Notes Section (100% Real Citizen Notes) */}
            <div className="border-t border-neutral-800/80 pt-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-extrabold text-white">
                    Pantauan Langsung Warga ({comments.length})
                  </h4>
                </div>
                <span className="text-[11px] text-neutral-500 font-mono">
                  Real-time Citizen Notes
                </span>
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleSubmitComment} className="space-y-3 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Nama / Inisial Anda..."
                    value={newCommentName}
                    onChange={(e) => setNewCommentName(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-emerald-500 flex-1"
                  />
                </div>
                <div className="relative">
                  <textarea
                    rows={2}
                    placeholder="Tuliskan info kondisi lapangan atau tanggapan Anda..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-emerald-500 resize-none"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingComment || !newCommentText.trim()}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-extrabold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Pantauan</span>
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-2.5">
                {comments.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-neutral-900/30 border border-neutral-800/80 text-center space-y-2 animate-in fade-in duration-200">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <h5 className="text-xs font-bold text-neutral-300">Belum Ada Pantauan Lapangan Warga</h5>
                    <p className="text-[11px] text-neutral-500 max-w-sm mx-auto leading-relaxed">
                      Jadilah warga pertama yang memberikan informasi situasi terkini di sekitar lokasi berita melalui formulir di atas.
                    </p>
                  </div>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-3.5 space-y-1.5 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-neutral-200">
                          <User className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{c.name}</span>
                          {c.verified && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 text-[9px] font-bold border border-emerald-800/60">
                              Terverifikasi
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-neutral-500 font-mono">{c.time}</span>
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed pl-5">
                        {c.text}
                      </p>
                    </div>
                  ))
                )}
              </div>

            </div>

            {/* Share & Source Link Footer */}
            <div className="border-t border-neutral-800/80 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Social Share Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-neutral-400 font-medium mr-1 flex items-center gap-1">
                  <Share2 className="w-3.5 h-3.5" />
                  Bagikan:
                </span>
                <button
                  onClick={() => handleShareSocial('wa')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800 text-emerald-300 text-xs font-bold transition-colors"
                >
                  WhatsApp
                </button>
                <button
                  onClick={() => handleShareSocial('twitter')}
                  className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-bold transition-colors"
                >
                  X (Twitter)
                </button>
                <button
                  onClick={() => handleShareSocial('telegram')}
                  className="px-3 py-1.5 rounded-xl bg-sky-950/60 hover:bg-sky-900/80 border border-sky-800 text-sky-300 text-xs font-bold transition-colors"
                >
                  Telegram
                </button>
                <button
                  onClick={handleCopyLink}
                  className="p-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs transition-colors"
                  title="Salin Tautan"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Original Source Link */}
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 hover:underline shrink-0"
              >
                <span>Buka Artikel Sumber Asli</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
