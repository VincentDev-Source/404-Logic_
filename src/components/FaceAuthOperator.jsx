import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from '@vladmandic/face-api';
import {
  Camera,
  CameraOff,
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
  KeyRound,
  Zap,
  Power
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
  const [autoScanning, setAutoScanning] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const isCheckingRef = useRef(false);

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
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    };
  }, []);

  // Start Webcam stream
  const startWebcam = async () => {
    setWebcamError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (e) {
          console.warn('Video play warning:', e);
        }
      }

      setIsWebcamActive(true);
      setStatusMessage({ 
        text: activeTab === 'login' 
          ? 'Kamera aktif. Pemindaian biometrik otomatis sedang berjalan...' 
          : 'Kamera aktif. Silakan isi form di bawah lalu klik "Daftarkan Wajah Petugas Resmi".', 
        type: 'info' 
      });
    } catch (err) {
      console.error('Webcam permission error:', err);
      setWebcamError('Akses kamera webcam tidak diizinkan atau kamera tidak ditemukan.');
      setIsWebcamActive(false);
    }
  };

  // Auto-start webcam as soon as models finish loading
  useEffect(() => {
    if (isModelsLoaded && !isWebcamActive && !webcamError) {
      startWebcam();
    }
  }, [isModelsLoaded]);

  // Ensure stream is bound to videoRef whenever video element is mounted or activeTab changes
  useEffect(() => {
    if (isWebcamActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(err => console.warn('Video play catch:', err));
    }
  }, [isWebcamActive, activeTab]);

  // Stop Webcam stream
  const stopWebcam = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsWebcamActive(false);
    setAutoScanning(false);
  };

  // Toggle Camera State (Nyalakan / Matikan)
  const toggleWebcam = () => {
    if (isWebcamActive) {
      stopWebcam();
      setStatusMessage({ text: 'Kamera dinonaktifkan.', type: 'warning' });
    } else {
      startWebcam();
    }
  };

  // Automatic Hands-Free Real-Time Face Verification Scan Loop (ONLY RUNS IN LOGIN TAB!)
  useEffect(() => {
    if (activeTab === 'login' && isModelsLoaded && isWebcamActive && videoRef.current) {
      setAutoScanning(true);
      
      scanIntervalRef.current = setInterval(async () => {
        if (isCheckingRef.current || !videoRef.current || videoRef.current.paused || videoRef.current.ended) return;
        isCheckingRef.current = true;

        try {
          const detection = await faceapi
            .detectSingleFace(videoRef.current)
            .withFaceLandmarks()
            .withFaceDescriptor();

          if (detection) {
            const scannedDescriptorArray = Array.from(detection.descriptor);

            const res = await fetch('/api/auth/face-login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ scannedDescriptor: scannedDescriptorArray }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
              // MATCH FOUND! Automatically log in officer hands-free!
              if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
              setFaceDistance(data.distance);
              setStatusMessage({
                text: `⚡ Verifikasi Otomatis Sukses! Akses Diterima. Selamat bertugas, ${data.operator.name}.`,
                type: 'success'
              });

              setTimeout(() => {
                stopWebcam();
                onLoginSuccess(data.operator);
              }, 500);
            }
          }
        } catch (err) {
          console.warn('Auto scan loop warning:', err);
        } finally {
          isCheckingRef.current = false;
        }
      }, 300);

    } else {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
      setAutoScanning(false);
    }

    return () => {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    };
  }, [activeTab, isModelsLoaded, isWebcamActive, onLoginSuccess]);

  // Tab 1: Manual Scan Fallback Button
  const handleScanLogin = async () => {
    if (!videoRef.current || !isWebcamActive) {
      startWebcam();
      return;
    }

    setIsProcessing(true);
    setStatusMessage({ text: 'Memindai wajah biometrik...', type: 'info' });

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
      }, 500);

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
      setStatusMessage({ text: 'Nyalakan kamera terlebih dahulu untuk memindai wajah!', type: 'warning' });
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
        text: `Registrasi Wajah Berhasil! Petugas "${data.operator.name}" terdaftar resmi. Mengalihkan ke tab Scan Masuk...`,
        type: 'success'
      });

      setOperatorName('');
      setAuthPassword('');

      setTimeout(() => {
        setActiveTab('login');
      }, 1500);

    } catch (err) {
      console.error('Operator registration error:', err);
      setStatusMessage({ text: err.message || 'Gagal merestrukturisasi wajah ke database server.', type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto text-white animate-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold shadow-lg shadow-blue-600/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                Otentikasi Wajah Petugas
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono text-[10px] font-bold border border-blue-500/30">
                  SDG 11
                </span>
              </h2>
              <p className="text-xs text-neutral-400 font-medium">Sistem Biometrik AI 128-Dimensional Vector</p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="p-1.5 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center border-b border-neutral-800 bg-neutral-950 p-1.5 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 rounded-2xl font-black text-xs flex items-center justify-center space-x-2 transition-all ${
              activeTab === 'login'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-neutral-400 hover:bg-neutral-900'
            }`}
          >
            <Scan className="w-4 h-4" />
            <span>Verifikasi Otomatis Instant</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 rounded-2xl font-black text-xs flex items-center justify-center space-x-2 transition-all ${
              activeTab === 'register'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-neutral-400 hover:bg-neutral-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Daftar Wajah Petugas</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs">

          {/* Model Loading Status */}
          {!isModelsLoaded ? (
            <div className="p-8 text-center bg-neutral-950 rounded-2xl border border-neutral-800 space-y-3">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
              <p className="font-bold text-white text-xs">{loadingStatus}</p>
              <p className="text-[11px] text-neutral-500">Memuat weights AI neural network biometrik wajah...</p>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Camera Header Control Bar (Nyalakan / Matikan Kamera Toggle) */}
              <div className="flex items-center justify-between p-2.5 bg-neutral-950 rounded-2xl border border-neutral-800">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-neutral-300">Status Kamera:</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] ${
                    isWebcamActive
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {isWebcamActive ? 'AKTIFF ON' : 'NONAKTIF OFF'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={toggleWebcam}
                  className={`px-3 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow ${
                    isWebcamActive
                      ? 'bg-red-600/90 hover:bg-red-500 text-white'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-black'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{isWebcamActive ? 'Matikan Kamera' : 'Nyalakan Kamera'}</span>
                </button>
              </div>

              {/* Webcam Viewport */}
              <div className="relative w-full h-64 bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-800 shadow-inner flex items-center justify-center">
                
                {/* Live Video Feed (Always Mounted) */}
                <video
                  ref={videoRef}
                  className={`w-full h-full object-cover transform -scale-x-100 ${isWebcamActive ? 'block' : 'hidden'}`}
                  playsInline
                  autoPlay
                  muted
                />

                {/* Webcam Fallback overlay when inactive */}
                {!isWebcamActive && (
                  <div className="text-center space-y-3 p-6 z-10">
                    <CameraOff className="w-10 h-10 text-neutral-600 mx-auto" />
                    <p className="text-neutral-400 font-bold">Kamera Dalam Keadaan Mati</p>
                    <button
                      type="button"
                      onClick={startWebcam}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow transition-all active:scale-95 flex items-center gap-1.5 mx-auto"
                    >
                      <Power className="w-4 h-4" />
                      <span>Nyalakan Kamera Sekarang</span>
                    </button>
                  </div>
                )}

                {/* Face Scan Overlay when Active */}
                {isWebcamActive && (
                  <div className="absolute inset-0 border-2 border-dashed border-blue-500/50 rounded-2xl pointer-events-none flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-emerald-500/80 rounded-full animate-pulse flex items-center justify-center">
                      {autoScanning && activeTab === 'login' && (
                        <div className="text-[10px] font-mono font-bold bg-black/80 px-2 py-1 rounded text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shadow-lg">
                          <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                          Auto-Scanning AI...
                        </div>
                      )}

                      {activeTab === 'register' && (
                        <div className="text-[10px] font-mono font-bold bg-black/80 px-2 py-1 rounded text-blue-400 border border-blue-500/30 flex items-center gap-1 shadow-lg">
                          <UserPlus className="w-3.5 h-3.5 text-blue-400" />
                          Mode Pendaftaran
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* Status & Feedback Banner */}
              {statusMessage.text && (
                <div className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center space-x-2.5 ${
                  statusMessage.type === 'error'
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : statusMessage.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : statusMessage.type === 'warning'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                }`}>
                  {statusMessage.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
                  <span className="leading-snug">{statusMessage.text}</span>
                </div>
              )}

              {/* Tab 1: Scan Login Form */}
              {activeTab === 'login' && (
                <div className="space-y-3">
                  <div className="p-3 bg-neutral-950 rounded-2xl border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-400" /> Auto-Scan AI Hands-Free:
                      </span>
                      <span className="text-emerald-400 font-bold">Aktif ⚡</span>
                    </div>
                    <p>Arahkan wajah Anda ke kamera. Pemindaian AI berjalan otomatis tanpa perlu menekan tombol apapun.</p>
                  </div>
                </div>
              )}

              {/* Tab 2: Operator Registration Form (Auto-login fully disabled to prevent accidental verifications!) */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegisterOperator} className="space-y-3">
                  <div className="p-2.5 bg-blue-600/10 border border-blue-500/30 rounded-xl text-[11px] text-blue-400 font-bold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-blue-400" />
                    <span>Mode Pendaftaran Aktif: Auto-login dimatikan agar tidak langsung terverifikasi secara tidak sengaja.</span>
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-bold mb-1">
                      Nama Lengkap Petugas Kota *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Arka (Petugas Dinas Bina Marga)"
                        value={operatorName}
                        onChange={(e) => setOperatorName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-blue-500 font-medium"
                      />
                      <User className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-bold mb-1">
                      Sandi Otorisasi Pendaftaran Petugas *
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        placeholder="Masukkan Sandi: 404logic"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-blue-500 font-medium"
                      />
                      <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing || !isWebcamActive}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Mendaftarkan Wajah Biometrik...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Daftarkan Wajah Petugas Resmi</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between text-neutral-400">
          <div className="flex items-center space-x-1.5 text-[11px] font-bold text-neutral-400">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Vektor Biometrik Terenkripsi PostgreSQL</span>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-colors"
          >
            Batal
          </button>
        </div>

      </div>
    </div>
  );
}
