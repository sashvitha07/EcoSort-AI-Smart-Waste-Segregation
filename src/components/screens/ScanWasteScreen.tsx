import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Image as ImageIcon,
  Scan,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Zap,
  Info,
  Layers,
  ArrowRight,
  UploadCloud,
  X,
  PlusCircle,
  Check,
} from 'lucide-react';
import { ScannedWasteItem, WasteCategory } from '../../types';
import { classifyWasteImage, formatConfidence } from '../../utils/classifier';
import { SAMPLE_WASTE_ITEMS } from '../../data/mockData';

interface ScanWasteScreenProps {
  onAddScannedItem: (item: ScannedWasteItem) => void;
}

export const ScanWasteScreen: React.FC<ScanWasteScreenProps> = ({
  onAddScannedItem,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<Omit<ScannedWasteItem, 'id' | 'timestamp'> | null>(null);
  const [addedToLog, setAddedToLog] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera stream on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    setSelectedImage(null);
    setAnalysisResult(null);
    setAddedToLog(false);

    try {
      stopCameraStream();
      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: unknown) {
      console.error('Camera access error:', err);
      setCameraError(
        'Unable to access camera hardware. Please check browser camera permissions or upload an image from your gallery instead.'
      );
      setIsCameraActive(false);
    }
  };

  const switchCameraFacing = async () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    if (isCameraActive) {
      stopCameraStream();
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: nextMode },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (e) {
        console.error('Error switching camera', e);
      }
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setSelectedImage(dataUrl);
      stopCameraStream();
      setIsCameraActive(false);

      // Trigger AI Classification
      performAIAnalysis('camera_capture.jpg', {
        width: canvas.width,
        height: canvas.height,
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    stopCameraStream();
    setIsCameraActive(false);
    setCameraError(null);
    setAddedToLog(false);

    const reader = new FileReader();
    reader.onload = (event) => {
      const resultUrl = event.target?.result as string;
      setSelectedImage(resultUrl);
      performAIAnalysis(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSampleSelect = (sampleName: string, category: WasteCategory) => {
    stopCameraStream();
    setIsCameraActive(false);
    setAddedToLog(false);

    // Provide high-quality placeholder preview for demo
    const isBio = category === 'Biodegradable';
    const demoUrl = isBio
      ? 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=600&auto=format&fit=crop&q=80';

    setSelectedImage(demoUrl);
    performAIAnalysis(sampleName);
  };

  const performAIAnalysis = (
    nameHint?: string,
    dimensions?: { width: number; height: number }
  ) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Simulate edge TFLite inference latency (800ms)
    setTimeout(() => {
      const result = classifyWasteImage(nameHint, dimensions);
      setAnalysisResult(result);
      setIsAnalyzing(false);
    }, 850);
  };

  const handleSaveToLog = () => {
    if (!analysisResult) return;

    const newItem: ScannedWasteItem = {
      id: `scan-${Date.now()}`,
      itemName: analysisResult.itemName,
      category: analysisResult.category,
      confidence: analysisResult.confidence,
      timestamp: 'Just now',
      imageUrl: selectedImage || undefined,
      recommendation: analysisResult.recommendation,
      decompositionTime: analysisResult.decompositionTime,
    };

    onAddScannedItem(newItem);
    setAddedToLog(true);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Title & Instructions */}
      <div>
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            AI Waste Segregation Scanner
          </h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
            2-Class Classifier
          </span>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          Detects whether items are <strong>Biodegradable</strong> (food scraps, vegetable waste, paper) or <strong>Non-Biodegradable</strong> (plastic bottles, covers, cans, metal).
        </p>
      </div>

      {/* Camera Viewfinder & Image Preview Canvas */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-950 border border-gray-800 shadow-md min-h-[280px] sm:min-h-[320px] flex items-center justify-center">
        {/* State 1: Active Live Camera Stream */}
        {isCameraActive && (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className="w-full h-72 sm:h-80 object-cover"
            />

            {/* Target Reticle & HUD Overlay */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-4">
              <div className="w-full flex justify-between items-center">
                <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-emerald-400 font-mono text-xs flex items-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-2" />
                  LIVE CAMERA VIEW
                </span>
                <span className="text-xs text-white/80 font-mono bg-black/60 px-2 py-1 rounded-md">
                  TensorFlow Lite Ready
                </span>
              </div>

              {/* Viewfinder Target Brackets */}
              <div className="w-48 h-48 sm:w-56 sm:h-56 border-2 border-emerald-400/80 rounded-2xl relative shadow-2xl">
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-emerald-400" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-emerald-400" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-emerald-400" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-emerald-400" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Scan className="w-8 h-8 text-emerald-400/40 animate-pulse" />
                </div>
              </div>

              <p className="text-xs text-white/90 bg-black/70 px-3 py-1 rounded-full font-medium">
                Align waste item inside brackets & tap Shutter
              </p>
            </div>

            {/* In-Camera Floating Controls */}
            <div className="absolute bottom-4 inset-x-0 flex items-center justify-center space-x-4 z-10 px-4">
              <button
                type="button"
                onClick={switchCameraFacing}
                className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
                title="Switch Camera"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              <button
                type="button"
                id="capture-shutter-btn"
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center border-4 border-white shadow-xl hover:bg-emerald-400 active:scale-95 transition-all"
                title="Capture & Analyze"
              >
                <Camera className="w-7 h-7" />
              </button>

              <button
                type="button"
                onClick={() => {
                  stopCameraStream();
                  setIsCameraActive(false);
                }}
                className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
                title="Close Camera"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* State 2: Selected Image with AI Scanning Effect */}
        {!isCameraActive && selectedImage && (
          <div className="relative w-full h-72 sm:h-80 flex items-center justify-center overflow-hidden bg-black">
            <img
              src={selectedImage}
              alt="Scanned item preview"
              className="w-full h-full object-contain"
            />

            {/* Laser scanning beam during analysis */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-emerald-950/30 flex flex-col items-center justify-center">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent absolute animate-bounce" />
                <div className="bg-black/80 px-4 py-2 rounded-xl text-white text-xs font-semibold flex items-center space-x-2 border border-emerald-500/50 shadow-lg">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>Classifying Waste (MobileNet TFLite)...</span>
                </div>
              </div>
            )}

            {/* Image Overlay Controls */}
            <div className="absolute top-3 right-3 flex space-x-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedImage(null);
                  setAnalysisResult(null);
                  setAddedToLog(false);
                }}
                className="p-2 rounded-lg bg-black/60 text-white hover:bg-black/80 text-xs font-medium flex items-center space-x-1 backdrop-blur-sm"
              >
                <X className="w-4 h-4" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        )}

        {/* State 3: Idle / Standby Screen */}
        {!isCameraActive && !selectedImage && (
          <div className="text-center p-6 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-emerald-900/60 border border-emerald-600/40 flex items-center justify-center mx-auto text-emerald-300 shadow-inner">
              <Scan className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base">
                Ready to Scan Waste
              </h3>
              <p className="text-xs text-gray-400 max-w-xs mx-auto mt-1">
                Open your device camera or choose a photo from the gallery to run the AI classifier.
              </p>
            </div>

            {cameraError && (
              <div className="p-3 bg-rose-950/80 border border-rose-800/80 rounded-xl text-xs text-rose-300 text-left max-w-md mx-auto">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <p>{cameraError}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Prominent Action Buttons: Open Camera & Select Gallery */}
      <div className="grid grid-cols-2 gap-3">
        {/* Prominent "Scan Waste / Open Camera" button */}
        <button
          id="btn-open-camera"
          onClick={startCamera}
          className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-98 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 border border-emerald-600"
        >
          <Camera className="w-5 h-5 text-emerald-200" />
          <span>Open Camera</span>
        </button>

        {/* Gallery Selection Button */}
        <button
          id="btn-select-gallery"
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-gray-50 active:scale-98 text-gray-800 font-bold text-sm shadow-sm border border-gray-300 transition-all flex items-center justify-center space-x-2"
        >
          <ImageIcon className="w-5 h-5 text-emerald-700" />
          <span>Pick Gallery</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      {/* AI Analysis Result Screen */}
      {analysisResult && (
        <div
          className={`rounded-2xl p-4 sm:p-5 border transition-all shadow-md ${
            analysisResult.category === 'Biodegradable'
              ? 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20'
              : 'bg-gradient-to-br from-rose-50 via-white to-rose-50 border-rose-300 ring-2 ring-rose-500/20'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                AI Classification Result
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
                {analysisResult.itemName}
              </h3>
            </div>

            {/* Exactly 2 Categories: Biodegradable or Non-Biodegradable */}
            <div
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm flex items-center space-x-1 ${
                analysisResult.category === 'Biodegradable'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-rose-700 text-white'
              }`}
            >
              {analysisResult.category === 'Biodegradable' ? (
                <CheckCircle className="w-3.5 h-3.5 mr-1" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 mr-1" />
              )}
              <span>{analysisResult.category}</span>
            </div>
          </div>

          {/* Confidence Meter */}
          <div className="mt-3.5 p-3 rounded-xl bg-white/90 border border-gray-200/80 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-gray-700 flex items-center">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                AI Model Confidence
              </span>
              <span
                className={`font-mono font-bold ${
                  analysisResult.category === 'Biodegradable'
                    ? 'text-emerald-700'
                    : 'text-rose-700'
                }`}
              >
                {formatConfidence(analysisResult.confidence)}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  analysisResult.category === 'Biodegradable'
                    ? 'bg-emerald-600'
                    : 'bg-rose-600'
                }`}
                style={{ width: `${analysisResult.confidence}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] text-gray-500 pt-0.5">
              <span>Decomposition period:</span>
              <span className="font-semibold text-gray-800">
                {analysisResult.decompositionTime}
              </span>
            </div>
          </div>

          {/* Segregation Recommendation Card */}
          <div className="mt-3 p-3 rounded-xl bg-white/90 border border-gray-200/80">
            <h4 className="text-xs font-bold text-gray-800 flex items-center mb-1">
              <Info className="w-3.5 h-3.5 text-emerald-700 mr-1.5" />
              Proper Segregation Action
            </h4>
            <p className="text-xs text-gray-700 leading-relaxed">
              {analysisResult.recommendation}
            </p>
          </div>

          {/* Add to Total Scanned Button */}
          <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center justify-between">
            <p className="text-[11px] text-gray-500">
              Save record to update live dashboard metrics.
            </p>
            <button
              id="save-scanned-item-btn"
              onClick={handleSaveToLog}
              disabled={addedToLog}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm ${
                addedToLog
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-emerald-700 hover:bg-emerald-600 text-white'
              }`}
            >
              {addedToLog ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Statistics</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Log & Update Counts</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Quick Test Presets (Demonstrating Biodegradable vs Non-Biodegradable) */}
      <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5">
            <Layers className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-gray-900 text-xs sm:text-sm">
              Quick Test Items (College Demo Presets)
            </h3>
          </div>
          <span className="text-[10px] text-gray-500">Click to classify</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() =>
              handleSampleSelect('Plastic Water Bottle PET', 'Non-Biodegradable')
            }
            className="p-2 text-left rounded-xl bg-rose-50/70 border border-rose-200 hover:bg-rose-100 transition-colors"
          >
            <span className="text-[10px] font-bold text-rose-700 block">
              Non-Biodegradable
            </span>
            <span className="text-xs font-semibold text-gray-800 block truncate">
              Plastic Bottle
            </span>
            <span className="text-[10px] text-gray-500 block">450 years decay</span>
          </button>

          <button
            onClick={() =>
              handleSampleSelect('Banana Peel & Vegetable Scraps', 'Biodegradable')
            }
            className="p-2 text-left rounded-xl bg-emerald-50/70 border border-emerald-200 hover:bg-emerald-100 transition-colors"
          >
            <span className="text-[10px] font-bold text-emerald-700 block">
              Biodegradable
            </span>
            <span className="text-xs font-semibold text-gray-800 block truncate">
              Vegetable / Fruit
            </span>
            <span className="text-[10px] text-gray-500 block">2-4 weeks decay</span>
          </button>

          <button
            onClick={() =>
              handleSampleSelect('Cardboard Box Packaging', 'Biodegradable')
            }
            className="p-2 text-left rounded-xl bg-emerald-50/70 border border-emerald-200 hover:bg-emerald-100 transition-colors"
          >
            <span className="text-[10px] font-bold text-emerald-700 block">
              Biodegradable
            </span>
            <span className="text-xs font-semibold text-gray-800 block truncate">
              Cardboard / Paper
            </span>
            <span className="text-[10px] text-gray-500 block">2 months decay</span>
          </button>

          <button
            onClick={() =>
              handleSampleSelect('Aluminum Beverage Soda Can', 'Non-Biodegradable')
            }
            className="p-2 text-left rounded-xl bg-rose-50/70 border border-rose-200 hover:bg-rose-100 transition-colors"
          >
            <span className="text-[10px] font-bold text-rose-700 block">
              Non-Biodegradable
            </span>
            <span className="text-xs font-semibold text-gray-800 block truncate">
              Aluminum Can
            </span>
            <span className="text-[10px] text-gray-500 block">200 years decay</span>
          </button>
        </div>
      </div>
    </div>
  );
};
