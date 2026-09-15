import React, { useState } from 'react';
import {
  Code,
  FileCode,
  Copy,
  Check,
  X,
  Smartphone,
  FolderTree,
  Terminal,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ANDROID_SOURCE_FILES, SourceFile } from '../data/androidSourceFiles';

interface AndroidCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidCodeModal: React.FC<AndroidCodeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFile, setSelectedFile] = useState<SourceFile>(
    ANDROID_SOURCE_FILES[0]
  );
  const [copied, setCopied] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Files' },
    { id: 'build', label: 'Gradle & Config' },
    { id: 'manifest', label: 'Manifest & Permissions' },
    { id: 'screens', label: 'Compose Screens' },
    { id: 'ml', label: 'TensorFlow Lite' },
    { id: 'data', label: 'Data Models' },
    { id: 'navigation', label: 'Navigation' },
  ];

  const filteredFiles = ANDROID_SOURCE_FILES.filter((file) => {
    if (filterCategory === 'all') return true;
    return file.category === filterCategory;
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="bg-gray-900 text-gray-100 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-950 px-4 py-3 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-950 border border-emerald-500/40 rounded-xl text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Android Project Source Code (Kotlin & Jetpack Compose)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-900/80 text-emerald-300 border border-emerald-700">
                  Android Studio Ready
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Complete Kotlin source code, Jetpack Compose UI, CameraX, TensorFlow Lite, and Gradle configuration.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Bar */}
        <div className="bg-gray-900/90 px-4 py-2 border-b border-gray-800 flex items-center space-x-2 overflow-x-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1 rounded-lg transition-all font-medium whitespace-nowrap ${
                filterCategory === cat.id
                  ? 'bg-emerald-700 text-white font-semibold'
                  : 'bg-gray-800/60 text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Content Body: Left File Tree & Right Code Viewer */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="w-full md:w-72 bg-gray-950/60 border-b md:border-b-0 md:border-r border-gray-800 overflow-y-auto p-2 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 px-2 py-1 block">
              Project Files ({filteredFiles.length})
            </span>
            {filteredFiles.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => {
                    setSelectedFile(file);
                    setCopied(false);
                  }}
                  className={`w-full text-left p-2 rounded-xl transition-all flex items-start space-x-2 text-xs ${
                    isSelected
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                      : 'text-gray-300 hover:bg-gray-800/60'
                  }`}
                >
                  <FileCode className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-emerald-400' : 'text-gray-400'}`} />
                  <div className="overflow-hidden">
                    <span className="font-semibold block truncate">
                      {file.name}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono block truncate">
                      {file.path}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-950">
            {/* Active file toolbar */}
            <div className="px-4 py-2 bg-gray-900 border-b border-gray-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {selectedFile.path}
                </span>
                <p className="text-[11px] text-gray-400">
                  {selectedFile.description}
                </p>
              </div>

              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Code container */}
            <div className="flex-1 overflow-auto p-4 bg-gray-950 font-mono text-xs text-emerald-100 leading-relaxed">
              <pre className="select-text whitespace-pre font-mono">
                {selectedFile.code}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-gray-950 px-4 py-2.5 border-t border-gray-800 flex flex-wrap items-center justify-between text-[11px] text-gray-400">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Files also generated directly in <code>/android</code> for export or cloning to Android Studio.</span>
          </div>
          <span>Language: Kotlin 2.0 • Compose BOM 2025.02.00 • SDK 35</span>
        </div>
      </div>
    </div>
  );
};
