import React from 'react';
import {
  Recycle,
  Leaf,
  Trash,
  AlertTriangle,
  ScanLine,
  ArrowRight,
  Sparkles,
  Activity,
  CheckCircle2,
  MapPin,
  Cpu,
} from 'lucide-react';
import { Dustbin, NavScreen, WasteStatistics } from '../../types';

interface DashboardScreenProps {
  stats: WasteStatistics;
  dustbins: Dustbin[];
  onNavigate: (screen: NavScreen) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  stats,
  dustbins,
  onNavigate,
}) => {
  // Dustbin status helpers
  const getStatusBadge = (status: Dustbin['status']) => {
    switch (status) {
      case 'Normal':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Normal
          </span>
        );
      case 'Almost Full':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            Almost Full
          </span>
        );
      case 'Cleaning Required':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
            Cleaning Required
          </span>
        );
    }
  };

  const getProgressColor = (status: Dustbin['status']) => {
    switch (status) {
      case 'Normal':
        return 'bg-emerald-600';
      case 'Almost Full':
        return 'bg-amber-500';
      case 'Cleaning Required':
        return 'bg-rose-600';
    }
  };

  return (
    <div className="space-y-5 pb-6">
      {/* College Project Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white p-4 sm:p-5 shadow-sm border border-emerald-600/40">
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-900/50 text-emerald-200 text-xs font-semibold mb-2 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            IoT & Machine Learning System
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            EcoSort AI
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xl">
            Smart Waste Segregation and Monitoring System built with Kotlin and Jetpack Compose.
            Classifying waste into Biodegradable & Non-Biodegradable streams in real-time.
          </p>

          {/* Quick Action Button */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              id="dash-scan-cta"
              onClick={() => onNavigate('scan')}
              className="px-4 py-2 rounded-xl bg-white text-emerald-900 font-bold text-xs sm:text-sm shadow-md hover:bg-emerald-50 transition-all flex items-center space-x-2 active:scale-98"
            >
              <ScanLine className="w-4 h-4 text-emerald-700" />
              <span>Scan Waste Now</span>
            </button>
            <button
              id="dash-remote-cta"
              onClick={() => onNavigate('remote')}
              className="px-3.5 py-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-900/80 text-white font-medium text-xs sm:text-sm transition-all flex items-center space-x-1.5 border border-emerald-500/30"
            >
              <MapPin className="w-4 h-4 text-emerald-300" />
              <span>Remote GPS Survey</span>
            </button>
          </div>
        </div>

        <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-emerald-600/20 blur-2xl pointer-events-none" />
      </div>

      {/* Primary Statistics Grid: Total 129, Biodegradable 76, Non-Bio 53, Active Alerts 1 */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="font-bold text-gray-800 text-sm sm:text-base flex items-center space-x-1.5">
            <span>Waste Segregation Overview</span>
          </h3>
          <span className="text-xs text-gray-500 font-medium">Live Telemetry</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Total Waste Scanned: 129 */}
          <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">Total Scanned</span>
              <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-700">
                <Recycle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-900">
                {stats.totalScanned}
              </span>
              <p className="text-[10px] text-gray-400 mt-0.5">items categorized</p>
            </div>
          </div>

          {/* Biodegradable: 76 */}
          <div className="bg-white p-3.5 rounded-2xl border border-emerald-200/80 shadow-sm flex flex-col justify-between ring-1 ring-emerald-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-700 font-semibold">Biodegradable</span>
              <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-700">
                <Leaf className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
                {stats.biodegradable}
              </span>
              <p className="text-[10px] text-emerald-600 mt-0.5">
                {((stats.biodegradable / stats.totalScanned) * 100).toFixed(0)}% organic compost
              </p>
            </div>
          </div>

          {/* Non-Biodegradable: 53 */}
          <div className="bg-white p-3.5 rounded-2xl border border-rose-200/80 shadow-sm flex flex-col justify-between ring-1 ring-rose-500/15">
            <div className="flex items-center justify-between">
              <span className="text-xs text-rose-700 font-semibold">Non-Biodegradable</span>
              <div className="p-1.5 bg-rose-50 rounded-lg text-rose-600">
                <Trash className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-rose-700">
                {stats.nonBiodegradable}
              </span>
              <p className="text-[10px] text-rose-600 mt-0.5">
                {((stats.nonBiodegradable / stats.totalScanned) * 100).toFixed(0)}% recyclable/dry
              </p>
            </div>
          </div>

          {/* Active Alerts: 1 */}
          <div
            onClick={() => onNavigate('alerts')}
            className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-sm flex flex-col justify-between cursor-pointer hover:bg-amber-50/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-amber-800 font-semibold">Active Alerts</span>
              <div className="p-1.5 bg-amber-100 rounded-lg text-amber-700">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-700">
                {stats.activeAlerts}
              </span>
              <p className="text-[10px] text-amber-700 font-medium mt-0.5 flex items-center">
                Action needed <ArrowRight className="w-3 h-3 ml-0.5" />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Street Dustbin Status */}
      <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">
              Street Dustbin Status
            </h3>
            <p className="text-xs text-gray-500">
              Ultrasonic depth sensor monitoring for municipal collection
            </p>
          </div>
          <button
            onClick={() => onNavigate('dustbins')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
          >
            <span>Manage All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {dustbins.slice(0, 3).map((bin) => (
            <div
              key={bin.id}
              className="p-3 rounded-xl bg-gray-50/80 border border-gray-100 hover:border-emerald-200 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-900 text-sm">
                    {bin.binNumber}
                  </span>
                  <span className="text-gray-400 text-xs">•</span>
                  <span className="text-xs text-gray-600 font-medium truncate max-w-[140px] sm:max-w-[240px]">
                    {bin.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-gray-800">
                    {bin.fillLevel}%
                  </span>
                  {getStatusBadge(bin.status)}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-2.5 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                    bin.status
                  )}`}
                  style={{ width: `${bin.fillLevel}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Activity Status (3 pillars from requirements) */}
      <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-700">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                AI Activity Status
              </h3>
              <p className="text-xs text-gray-500">
                Edge inference & real-time monitoring modules
              </p>
            </div>
          </div>
          <span className="inline-flex items-center text-xs font-medium text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-1.5"></span>
            Online
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* AI Classification */}
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-gray-900">
                AI Classification
              </h4>
              <p className="text-[11px] text-gray-600 mt-0.5">
                2-Class TFLite model ready for Biodegradable / Non-Biodegradable sorting.
              </p>
              <span className="inline-block text-[10px] text-emerald-700 font-semibold mt-1">
                97.4% Model Confidence
              </span>
            </div>
          </div>

          {/* Waste Monitoring */}
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start space-x-2.5">
            <Activity className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-gray-900">
                Waste Monitoring
              </h4>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Continuous ultrasonic fill tracking across urban containers.
              </p>
              <span className="inline-block text-[10px] text-emerald-700 font-semibold mt-1">
                4 Bins Connected
              </span>
            </div>
          </div>

          {/* Alert Detection */}
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-gray-900">
                Alert Detection
              </h4>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Automated notification triggers when dustbins exceed 85% capacity.
              </p>
              <span className="inline-block text-[10px] text-amber-800 font-semibold mt-1">
                Threshold: &gt;85% Fill
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
