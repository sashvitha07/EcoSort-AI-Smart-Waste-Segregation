import React from 'react';
import { Leaf, Code, Smartphone, Monitor, ShieldCheck, Sparkles } from 'lucide-react';
import { NavScreen } from '../types';

interface TopBarProps {
  currentScreen: NavScreen;
  activeAlertCount: number;
  isPhoneFrame: boolean;
  onTogglePhoneFrame: () => void;
  onOpenCodeViewer: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentScreen,
  activeAlertCount,
  isPhoneFrame,
  onTogglePhoneFrame,
  onOpenCodeViewer,
}) => {
  const getScreenTitle = (screen: NavScreen) => {
    switch (screen) {
      case 'dashboard':
        return 'EcoSort AI';
      case 'scan':
        return 'AI Waste Scanner';
      case 'dustbins':
        return 'Street Dustbins';
      case 'remote':
        return 'Remote GPS Surveys';
      case 'alerts':
        return 'Active Alerts';
      case 'reports':
        return 'Segregation Reports';
      default:
        return 'EcoSort AI';
    }
  };

  return (
    <header className="bg-emerald-800 text-white shadow-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between">
        {/* Brand and Current Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700/80 border border-emerald-500/40 flex items-center justify-center shadow-inner">
            <Leaf className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-base sm:text-lg leading-tight tracking-tight">
                {getScreenTitle(currentScreen)}
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-700 text-emerald-200 border border-emerald-600">
                <Sparkles className="w-3 h-3 mr-1" />
                Jetpack Compose
              </span>
            </div>
            <p className="text-xs text-emerald-200 hidden xs:block">
              Smart Waste Segregation & Monitoring
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* AI Model Status Badge */}
          <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-900/60 text-xs text-emerald-200 border border-emerald-700/60">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>TFLite 2-Class Engine</span>
          </div>

          {/* Toggle Phone Frame View / Fullscreen */}
          <button
            id="toggle-phone-frame-btn"
            onClick={onTogglePhoneFrame}
            title={isPhoneFrame ? "Switch to Wide Responsive View" : "Switch to Android Device Mockup"}
            className="p-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-emerald-100 transition-colors flex items-center space-x-1 text-xs font-medium"
          >
            {isPhoneFrame ? (
              <>
                <Monitor className="w-4 h-4" />
                <span className="hidden lg:inline">Wide View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4" />
                <span className="hidden lg:inline">Android Frame</span>
              </>
            )}
          </button>

          {/* View Android Source Code Button */}
          <button
            id="open-android-code-btn"
            onClick={onOpenCodeViewer}
            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-semibold text-xs sm:text-sm transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <Code className="w-4 h-4" />
            <span className="font-bold">Kotlin / Compose Code</span>
          </button>
        </div>
      </div>
    </header>
  );
};
