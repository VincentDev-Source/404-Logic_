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
      setStatusMessage({ text: 'Kamera aktif. Posisikan wajah Anda di dalam bingkai.', type: 'info' });
    } catch (err) {
      console.error('Webcam permission error:', err);
      setWebcamError('Akses kamera tidak diizinkan atau kamera tidak ditemukan.');
      setIsWebcamActive(false);
    }
  };

  // Auto-start webcam when models load
  useEffect(() => {
    if (isModelsLoaded && !isWebcamActive && !webcamError) {
      startWebcam();
    }
  }, [isModelsLoaded]);

  // Bind video element stream reliably
  useEffect(() => {
    if (isWebcamActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(err => console.warn('Video play catch:', err));
    }
  }, [isWebcamActive]);

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
      startWebcam();
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
      startWebcam();
      return;
    }

    setIsProcessing(true);
    setStatusMessage({ text: 'Memindai wajah dan membandingkan vektor biometrik...', type: 'info' });

    try {
      const savedDescriptorJson = localStorage.getItem('civicpulse_registered_face');
      if (!savedDescriptorJson) {
        setStatusMessage({ text: 'Belum ada data wajah terdaftar! Klik "Daftar Wajah" terlebih dahulu.', type: 'warning' });
        setIsProcessing(false);
        return;
      }

      const savedDescriptorArray = JSON.parse(savedDescriptorJson);
      const savedDescriptor = new Float32Array(savedDescriptorArray);

      const detection = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setStatusMessage({ text: 'Wajah tidak terdeteksi! Posisikan wajah Anda tepat di depan kamera.', type: 'error' });
        setIsProcessing(false);
        return;
      }

      // Compute Euclidean Distance between scanned descriptor & saved descriptor
      const distance = faceapi.euclideanDistance(detection.descriptor, savedDescriptor);
      setFaceDistance(distance);

      // Distance Threshold < 0.5 indicates a match
      if (distance < 0.5) {
        setStatusMessage({ 
          text: `Akses Diterima! Kemiripan biometrik cocok (Jarak: ${distance.toFixed(3)}). Mengalihkan ke Dashboard...`, 
          type: 'success' 
        });

        setTimeout(() => {
          stopWebcam();
          onSuccess();
        }, 1200);
      } else {
        setStatusMessage({ 
          text: `Akses Ditolak! Wajah tidak cocok dengan data pemilik terdaftar (Jarak: ${distance.toFixed(3)} >= 0.50).`, 
          type: 'error' 
        });
      }

    } catch (err) {
      console.error('Verification error:', err);
      setStatusMessage({ text: 'Terjadi kesalahan saat memverifikasi wajah.', type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset / Delete Registered Face
  const handleResetRegistration = () => {
    localStorage.removeItem('civicpulse_registered_face');
    setIsRegistered(false);
    setFaceDistance(null);
    setStatusMessage({ text: 'Data registrasi wajah berhasil dihapus.', type: 'info' });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-fade-in-up z-10">
        
        {/* App Title & Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Face Recognition Auth (100% Client-Side)</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            CivicPulse Security Portal
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-medium">
            Verifikasi biometrik pengenalan wajah warga & pengguna
          </p>
        </div>

        {/* Model Loading State */}
        {!isModelsLoaded ? (
          <div className="py-12 space-y-4">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto" />
            <p className="text-xs font-bold text-neutral-300">{loadingStatus}</p>
            <p className="text-[11px] text-neutral-500">
              Mengunduh weights neural network dari CDN...
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            
            {/* Webcam Container - Always keeps video element mounted in DOM */}
            <div className="relative w-full h-64 sm:h-72 bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-800 shadow-inner flex items-center justify-center">
              
              {/* Video Element */}
              <video
                ref={videoRef}
                className={`w-full h-full object-cover transform -scale-x-100 ${isWebcamActive ? 'block' : 'hidden'}`}
                playsInline
                autoPlay
                muted
              />

              {/* Inactive Fallback */}
              {!isWebcamActive && (
                <div className="space-y-3 text-center p-4 z-10">
                  <Camera className="w-12 h-12 text-neutral-600 mx-auto" />
                  <p className="text-xs font-bold text-neutral-400">Kamera Belum Aktif</p>
                  <button
                    onClick={startWebcam}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow transition-all active:scale-95"
                  >
                    Nyalakan Kamera Webcam
                  </button>
                </div>
              )}

              {/* Scanning Reticle & Overlay */}
              {isWebcamActive && (
                <div className="absolute inset-0 border-2 border-dashed border-emerald-500/40 rounded-2xl pointer-events-none flex items-center justify-center">
                  <div className="w-48 h-48 sm:w-52 sm:h-52 border-2 border-emerald-500/70 rounded-full animate-ping opacity-30" />
                </div>
              )}
            </div>

            {/* Error Feedback */}
            {webcamError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{webcamError}</span>
              </div>
            )}

            {/* Status Feedback Banner */}
            {statusMessage.text && (
              <div className={`p-3.5 rounded-xl border text-xs font-bold flex items-center space-x-2 text-left ${
                statusMessage.type === 'error' 
                  ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                  : statusMessage.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : statusMessage.type === 'warning'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
              }`}>
                {statusMessage.type === 'error' ? (
                  <AlertCircle className="w-5 h-5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                )}
                <span className="leading-relaxed">{statusMessage.text}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleRegisterFace}
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-extrabold text-xs border border-neutral-700 shadow flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                ) : (
                  <UserPlus className="w-4 h-4 text-emerald-400" />
                )}
                <span>{isRegistered ? 'Daftar Ulang Wajah' : 'Daftar Wajah Warga'}</span>
              </button>

              <button
                onClick={handleScanLogin}
                disabled={isProcessing || !isRegistered}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs shadow-lg flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                ) : (
                  <Scan className="w-4 h-4 text-black" />
                )}
                <span>Scan Masuk (Otentikasi)</span>
              </button>
            </div>

            {/* Bypass Option */}
            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
              <button
                onClick={onSuccess}
                className="text-neutral-400 hover:text-emerald-400 underline font-semibold transition-colors"
              >
                Bypass Masuk Sebagai Tamu / Demo Warga →
              </button>

              {isRegistered && (
                <button
                  onClick={handleResetRegistration}
                  className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1 transition-colors"
                  title="Hapus data wajah terdaftar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Wajah</span>
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
