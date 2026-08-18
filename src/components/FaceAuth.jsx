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
  KeyRound,
  Trash2,
  Sparkles
} from 'lucide-react';

const MODEL_URL = 'https://cdn.jsdelivr.net/gh/cgarciagl/face-api.js@0.22.2/weights';

export default function FaceAuth({ onSuccess }) {
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('Mengunduh model AI Face Recognition...');
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [webcamError, setWebcamError] = useState(null);
  
  const [isRegistered, setIsRegistered] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: 'info' }); // 'info' | 'success' | 'error' | 'warning'
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
        setLoadingStatus('Model AI Siap Digunakan');

        // Check if a registered face descriptor exists in localStorage
        const savedFace = localStorage.getItem('civicpulse_registered_face');
        if (savedFace) {
          setIsRegistered(true);
        }
      } catch (err) {
        console.error('Error loading face-api models:', err);
        if (isMounted) {
          setLoadingStatus('Gagal mengunduh model AI. Memperbolehkan mode alternatif.');
          setWebcamError('Gagal memuat model AI dari CDN. Silakan muat ulang halaman.');
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
      setStatusMessage({ text: 'Kamera aktif. Posisikan wajah Anda di dalam bingkai.', type: 'info' });
    } catch (err) {
      console.error('Webcam permission error:', err);
      setWebcamError('Akses kamera tidak diizinkan atau kamera tidak ditemukan.');
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

  // Handle Face Registration ("Daftar Wajah")
  const handleRegisterFace = async () => {
    if (!videoRef.current || !isWebcamActive) {
      setStatusMessage({ text: 'Aktifkan kamera terlebih dahulu!', type: 'warning' });
      return;
    }

    setIsProcessing(true);
    setStatusMessage({ text: 'Memindai dan mengekstrak vektor ciri wajah Anda...', type: 'info' });

    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setStatusMessage({ text: 'Wajah tidak terdeteksi! Pastikan wajah Anda terlihat jelas dan terang di depan kamera.', type: 'error' });
        setIsProcessing(false);
        return;
      }

      // Convert 128-dimensional Float32Array descriptor to JavaScript Array
      const descriptorArray = Array.from(detection.descriptor);
      localStorage.setItem('civicpulse_registered_face', JSON.stringify(descriptorArray));

      setIsRegistered(true);
      setStatusMessage({ 
        text: 'Wajah Anda Berhasil Didaftarkan! Data fitur wajah 128-D tersimpan secara aman di browser Anda.', 
        type: 'success' 
      });
    } catch (err) {
      console.error('Registration detection error:', err);
      setStatusMessage({ text: 'Terjadi kesalahan saat memproses data wajah.', type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Face Verification Login ("Scan Masuk")
  const handleScanLogin = async () => {
    if (!videoRef.current || !isWebcamActive) {
      setStatusMessage({ text: 'Aktifkan kamera terlebih dahulu untuk melakukan Scan Masuk!', type: 'warning' });
      return;
    }

    const savedFaceRaw = localStorage.getItem('civicpulse_registered_face');
    if (!savedFaceRaw) {
      setStatusMessage({ text: 'Belum ada data wajah terdaftar! Tekan "Daftar Wajah" terlebih dahulu.', type: 'warning' });
      return;
    }

    setIsProcessing(true);
    setStatusMessage({ text: 'Membandingkan fitur wajah live dengan data terdaftar...', type: 'info' });

    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setStatusMessage({ text: 'Wajah tidak terdeteksi! Posisikan wajah Anda tepat di tengah kamera.', type: 'error' });
        setIsProcessing(false);
        return;
      }

      // Parse registered face descriptor array and compare euclidean distance
      const registeredDescriptor = new Float32Array(JSON.parse(savedFaceRaw));
      const currentDescriptor = detection.descriptor;

      const distance = faceapi.euclideanDistance(currentDescriptor, registeredDescriptor);
      setFaceDistance(distance);

      if (distance < 0.5) {
        // MATCH SUCCESSFUL (Access Granted)
        setStatusMessage({ 
          text: `Akses Diterima! Wajah Cocok (Tingkat Kemiripan: ${((1 - distance) * 100).toFixed(1)}%). Membuka Dashboard...`, 
          type: 'success' 
        });

        setTimeout(() => {
          stopWebcam();
          onSuccess();
        }, 1200);
      } else {
        // MATCH REJECTED (Access Denied)
        setStatusMessage({ 
          text: `Akses Ditolak! Wajah tidak cocok dengan data terdaftar (Jarak Kemiripan: ${distance.toFixed(3)} >= 0.5).`, 
          type: 'error' 
        });
      }
    } catch (err) {
      console.error('Scan login error:', err);
      setStatusMessage({ text: 'Terjadi kesalahan saat memverifikasi wajah.', type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset Registered Face
  const handleResetFace = () => {
    localStorage.removeItem('civicpulse_registered_face');
    setIsRegistered(false);
    setFaceDistance(null);
    setStatusMessage({ text: 'Data registrasi wajah berhasil dihapus.', type: 'info' });
  };

  // Demo Bypass Option
  const handleBypassDemo = () => {
    stopWebcam();
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Glow Decorations */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-1 shadow-lg shadow-emerald-500/10">
            <Scan className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            CivicPulse Face Auth
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase border border-emerald-500/30">
              100% Client-Side AI
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Autentikasi Pengenalan Wajah Berbasis AI Browser (`@vladmandic/face-api`)
          </p>
        </div>

        {/* Model AI Loading Banner */}
        {!isModelsLoaded ? (
          <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-emerald-400 animate-spin shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-200">Memuat Model Kecerdasan Buatan (AI)...</p>
              <p className="text-[11px] text-slate-400 truncate">{loadingStatus}</p>
            </div>
          </div>
        ) : (
          /* Live WebCam Container */
          <div className="space-y-4">
            
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
                    <p className="text-xs font-bold text-slate-300">Kamera Belum Aktif</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Tekan tombol di bawah untuk mengaktifkan webcam Anda.</p>
                  </div>
                  <button
                    onClick={startWebcam}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    Buka Kamera Webcam
                  </button>
                </div>
              )}

              {/* Animated Face Scanning Overlay HUD */}
              {isWebcamActive && (
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
                  {/* Target Frame Corners */}
                  <div className="flex justify-between">
                    <div className="w-8 h-8 border-t-2 border-l-2 border-emerald-400 rounded-tl" />
                    <div className="w-8 h-8 border-t-2 border-r-2 border-emerald-400 rounded-tr" />
                  </div>

                  {/* Scanning Radar Line */}
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-pulse" />

                  <div className="flex justify-between">
                    <div className="w-8 h-8 border-b-2 border-l-2 border-emerald-400 rounded-bl" />
                    <div className="w-8 h-8 border-b-2 border-r-2 border-emerald-400 rounded-br" />
                  </div>
                </div>
              )}

              {/* Live Distance Meter Badge */}
              {faceDistance !== null && (
                <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-700 px-3 py-1 rounded-full text-[11px] font-mono font-bold flex items-center gap-1.5 z-10">
                  <span className="text-slate-400">Jarak Kemiripan:</span>
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

            {/* Live Status Message Alert */}
            {statusMessage.text && (
              <div className={`p-3.5 rounded-2xl border text-xs font-bold flex items-start gap-2.5 transition-all ${
                statusMessage.type === 'success'
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
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="leading-snug">{statusMessage.text}</p>
                </div>
              </div>
            )}

            {/* Registration Indicator Status */}
            <div className="flex items-center justify-between px-1 text-xs">
              <span className="text-slate-400 font-medium">Status Registrasi Wajah:</span>
              {isRegistered ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  Wajah Pemilik Terdaftar
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/30">
                  Belum Ada Wajah Terdaftar
                </span>
              )}
            </div>

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              
              {/* Tombol 1: Daftar Wajah */}
              <button
                type="button"
                onClick={handleRegisterFace}
                disabled={!isModelsLoaded || isProcessing}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-bold text-xs text-white flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 shadow-md"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                ) : (
                  <UserPlus className="w-4 h-4 text-emerald-400" />
                )}
                <span>Daftar Wajah Baru</span>
              </button>

              {/* Tombol 2: Scan Masuk */}
              <button
                type="button"
                onClick={handleScanLogin}
                disabled={!isModelsLoaded || isProcessing}
                className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 font-black text-xs text-black flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                ) : (
                  <Scan className="w-4 h-4" />
                )}
                <span>Scan Masuk (Login Wajah)</span>
              </button>

            </div>

            {/* Secondary Controls & Demo Options */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              
              {isRegistered && (
                <button
                  type="button"
                  onClick={handleResetFace}
                  className="text-slate-500 hover:text-red-400 font-bold flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Data Wajah Terdaftar</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleBypassDemo}
                className="ml-auto text-emerald-400 hover:underline font-bold flex items-center gap-1 text-[11px]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Masuk Aplikasi (Bypass Mode Demo)</span>
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
