import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from '@vladmandic/face-api';
import {
  Camera,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserPlus,
  Scan,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Building2,
  Lock,
  Sparkles,
  User,
  KeyRound
} from 'lucide-react';

const MODEL_URL = 'https://cdn.jsdelivr.net/gh/cgarciagl/face-api.js@0.22.2/weights';

export default function FaceAuthOperator({ onLoginSuccess, onCancel }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'

  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('Mengunduh model AI Face Recognition...');
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [webcamError, setWebcamError] = useState(null);

  const [operatorName, setOperatorName] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState({ text: '', type: 'info' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [faceDistance, setFaceDistance] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Load face-api AI models from CDN on mount
  useEffect(() => {
    let isMounted = true;

    async function loadModels() {
      try {
        setLoadingStatus('Mengunduh model AI (ssdMobilenetv1)...');
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);

        if (!isMounted) return;
        setLoadingStatus('Mengunduh model AI (faceLandmark68Net)...');
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);

        if (!isMounted) return;
        setLoadingStatus('Mengunduh model AI (faceRecognitionNet)...');
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

        if (!isMounted) return;
        setIsModelsLoaded(true);
        setLoadingStatus('Model AI Biometrik Siap');
      } catch (err) {
        console.error('Error loading face-api models:', err);
        if (isMounted) {
          setLoadingStatus('Gagal mengunduh model AI.');
          setWebcamError('Gagal memuat model AI biometrik dari CDN. Silakan muat ulang halaman.');
        }
      }
    }

    loadModels();

    return () => {
      isMounted = false;
      stopWebcam();
    };
  }, []);

  // Start Webcam stream
  const startWebcam = async () => {
    setWebcamError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsWebcamActive(true);
      setStatusMessage({ text: 'Kamera aktif. Posisikan wajah Anda di dalam bingkai pemindai.', type: 'info' });
    } catch (err) {
      console.error('Webcam permission error:', err);
      setWebcamError('Akses kamera webcam tidak diizinkan atau kamera tidak ditemukan.');
      setIsWebcamActive(false);
    }
  };

  // Stop Webcam stream
  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsWebcamActive(false);
  };

  // Tab 1: Scan Wajah Petugas (Login)
  const handleScanLogin = async () => {
    if (!videoRef.current || !isWebcamActive) {
      setStatusMessage({ text: 'Aktifkan kamera webcam terlebih dahulu!', type: 'warning' });
      return;
    }

    setIsProcessing(true);
    setStatusMessage({ text: 'Memindai wajah & mengirim vektor ke PostgreSQL backend...', type: 'info' });

    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setStatusMessage({ text: 'Wajah tidak terdeteksi! Posisikan wajah tepat di depan kamera.', type: 'error' });
        setIsProcessing(false);
        return;
      }

      const scannedDescriptorArray = Array.from(detection.descriptor);

      // Send scanned descriptor to Serverless API /api/auth/face-login
      const res = await fetch('/api/auth/face-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scannedDescriptor: scannedDescriptorArray }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatusMessage({
          text: data.message || 'Akses Ditolak: Wajah Bukan Petugas Resmi / Belum Terdaftar!',
          type: 'error'
        });
        setFaceDistance(data.minDistance || null);
        setIsProcessing(false);
        return;
      }

      // SUCCESS MATCH
      setFaceDistance(data.distance);
      setStatusMessage({
        text: `Akses Diterima! Otentikasi Berhasil. Selamat bertugas, ${data.operator.name}.`,
        type: 'success'
      });

      setTimeout(() => {
        stopWebcam();
        onLoginSuccess(data.operator);
      }, 1000);

    } catch (err) {
      console.error('Operator face login error:', err);
      setStatusMessage({ text: err.message || 'Terjadi kesalahan sistem saat otentikasi server.', type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Tab 2: Daftarkan Petugas Baru (Pendaftaran)
  const handleRegisterOperator = async (e) => {
    if (e) e.preventDefault();

    if (!operatorName.trim()) {
      setStatusMessage({ text: 'Masukkan Nama Lengkap Petugas terlebih dahulu!', type: 'warning' });
      return;
    }

    if (!authPassword.trim()) {
      setStatusMessage({ text: 'Masukkan Sandi Keamanan Otorisasi Petugas ("404logic")!', type: 'warning' });
      return;
    }

    if (!videoRef.current || !isWebcamActive) {
      setStatusMessage({ text: 'Aktifkan kamera terlebih dahulu untuk memindai wajah!', type: 'warning' });
      return;
    }

    setIsProcessing(true);
    setStatusMessage({ text: 'Memverifikasi sandi & mengunggah vektor biometrik 128-D ke PostgreSQL...', type: 'info' });

    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setStatusMessage({ text: 'Wajah tidak terdeteksi! Pastikan wajah terlihat jelas di depan kamera.', type: 'error' });
        setIsProcessing(false);
        return;
      }

      const descriptorArray = Array.from(detection.descriptor);

      // Send to Serverless API /api/auth/face-register
      const res = await fetch('/api/auth/face-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: operatorName.trim(),
          role: 'OPERATOR',
          password: authPassword.trim(),
          faceDescriptor: descriptorArray,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal menyimpan data petugas ke database');
      }

      setStatusMessage({
        text: `Petugas "${data.operator.name}" Berhasil Didaftarkan ke Database PostgreSQL! Silakan uji Scan Masuk pada Tab Login.`,
        type: 'success'
      });

      setOperatorName('');
      setAuthPassword('');
    } catch (err) {
      console.error('Operator face registration error:', err);
      setStatusMessage({ text: err.message || 'Terjadi kesalahan saat pendaftaran petugas.', type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Demo Bypass Login
  const handleBypassDemo = () => {
    stopWebcam();
    onLoginSuccess({
      id: 99,
      name: 'Petugas Demo (Indra Wijaya)',
      role: 'OPERATOR_DEMO',
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">

      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">

        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 mb-1 shadow-lg shadow-blue-500/10">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            Portal Biometrik Petugas
            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-extrabold uppercase border border-blue-500/30">
              AI
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Verifikasi Wajah Petugas Resmi Dinas Kota (`@vladmandic/face-api` + Vercel Serverless)
          </p>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-extrabold">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'login'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
              }`}
          >
            <Scan className="w-4 h-4" />
            <span>Scan Wajah Petugas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'register'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
              }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Daftarkan Petugas Baru</span>
          </button>
        </div>

        {/* Model AI Loading Banner */}
        {!isModelsLoaded ? (
          <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-blue-400 animate-spin shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-200">Memuat Model AI Biometrik...</p>
              <p className="text-[11px] text-slate-400 truncate">{loadingStatus}</p>
            </div>
          </div>
        ) : (
          /* Main Content */
          <div className="space-y-4">

            {/* Tab 2 Form Registration Name & Security Password Input */}
            {activeTab === 'register' && (
              <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Nama Lengkap Petugas *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Ir. Hendra Saputra, M.T."
                      value={operatorName}
                      onChange={(e) => setOperatorName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 font-medium"
                    />
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                    Sandi Keamanan Otorisasi Petugas * (Sandi: 404logic)
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="Masukkan sandi rahasia (404logic)..."
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 font-mono font-medium"
                    />
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>
              </div>
            )}

            {/* Live WebCam Stream Frame */}
            <div className="relative w-full h-72 sm:h-80 bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-800 flex items-center justify-center shadow-inner group">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transform -scale-x-100 ${isWebcamActive ? 'block' : 'hidden'}`}
              />

              {!isWebcamActive && (
                <div className="text-center p-6 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                    <Camera className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-300">Kamera WebCam Belum Aktif</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Aktifkan kamera untuk memindai wajah petugas.</p>
                  </div>
                  <button
                    type="button"
                    onClick={startWebcam}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                  >
                    Buka Kamera WebCam
                  </button>
                </div>
              )}

              {/* HUD Target Overlay */}
              {isWebcamActive && (
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
                  <div className="flex justify-between">
                    <div className="w-8 h-8 border-t-2 border-l-2 border-blue-400 rounded-tl" />
                    <div className="w-8 h-8 border-t-2 border-r-2 border-blue-400 rounded-tr" />
                  </div>

                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_15px_#3b82f6] animate-pulse" />

                  <div className="flex justify-between">
                    <div className="w-8 h-8 border-b-2 border-l-2 border-blue-400 rounded-bl" />
                    <div className="w-8 h-8 border-b-2 border-r-2 border-blue-400 rounded-br" />
                  </div>
                </div>
              )}

              {/* Distance meter badge */}
              {faceDistance !== null && (
                <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-700 px-3 py-1 rounded-full text-[11px] font-mono font-bold z-10">
                  <span className="text-slate-400">Jarak Euclidean:</span>{' '}
                  <span className={faceDistance < 0.5 ? 'text-emerald-400 font-extrabold' : 'text-red-400 font-extrabold'}>
                    {faceDistance.toFixed(3)}
                  </span>
                </div>
              )}
            </div>

            {/* Webcam Error Warning */}
            {webcamError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{webcamError}</span>
              </div>
            )}

            {/* Status Message */}
            {statusMessage.text && (
              <div className={`p-3.5 rounded-2xl border text-xs font-bold flex items-start gap-2.5 transition-all ${statusMessage.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : statusMessage.type === 'error'
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : statusMessage.type === 'warning'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}>
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : statusMessage.type === 'error' ? (
                  <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="leading-snug">{statusMessage.text}</p>
                </div>
              </div>
            )}

            {/* Submit Action Button */}
            {activeTab === 'login' ? (
              <button
                type="button"
                onClick={handleScanLogin}
                disabled={!isModelsLoaded || isProcessing}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 font-black text-xs text-white flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Scan className="w-4 h-4" />
                )}
                <span>Scan Wajah & Masuk Server</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRegisterOperator}
                disabled={!isModelsLoaded || isProcessing}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 font-black text-xs text-black flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}
                <span>Simpan Petugas (Dengan Sandi 404logic)</span>
              </button>
            )}

            {/* Bottom Actions Footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={onCancel}
                className="text-slate-400 hover:text-white font-bold"
              >
                Kembali ke Portal Publik
              </button>

              <button
                type="button"
                onClick={handleBypassDemo}
                className="text-blue-400 hover:underline font-bold flex items-center gap-1 text-[11px]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Masuk Demo Petugas</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
