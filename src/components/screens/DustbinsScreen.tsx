import React, { useState } from 'react';
import {
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  TrendingUp,
  RefreshCw,
  Plus,
  Minus,
  Sparkles,
  Truck,
} from 'lucide-react';
import { Dustbin, DustbinStatus } from '../../types';

interface DustbinsScreenProps {
  dustbins: Dustbin[];
  onUpdateDustbin: (bin: Dustbin) => void;
  onTriggerAlert: (bin: Dustbin) => void;
}

export const DustbinsScreen: React.FC<DustbinsScreenProps> = ({
  dustbins,
  onUpdateDustbin,
  onTriggerAlert,
}) => {
  const [filter, setFilter] = useState<'All' | DustbinStatus>('All');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const filteredBins = dustbins.filter((bin) => {
    if (filter === 'All') return true;
    return bin.status === filter;
  });

  const getStatusDetails = (status: DustbinStatus) => {
    switch (status) {
      case 'Normal':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          barColor: 'bg-emerald-600',
          indicator: 'text-emerald-700',
        };
      case 'Almost Full':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          barColor: 'bg-amber-500',
          indicator: 'text-amber-700',
        };
      case 'Cleaning Required':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          barColor: 'bg-rose-600',
          indicator: 'text-rose-700',
        };
    }
  };

  const calculateStatus = (fillLevel: number): DustbinStatus => {
    if (fillLevel >= 85) return 'Cleaning Required';
    if (fillLevel >= 70) return 'Almost Full';
    return 'Normal';
  };

  const adjustFillLevel = (bin: Dustbin, delta: number) => {
    const newLevel = Math.min(100, Math.max(0, bin.fillLevel + delta));
    const newStatus = calculateStatus(newLevel);
    const updated = {
      ...bin,
      fillLevel: newLevel,
      status: newStatus,
    };

    onUpdateDustbin(updated);

    // If new level cross critical threshold (>=85%) and was previously not critical, alert!
    if (newLevel >= 85 && bin.fillLevel < 85) {
      onTriggerAlert(updated);
      setFeedbackMessage(`🚨 Critical fill alert automatically generated for ${bin.binNumber}!`);
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  const emptyBin = (bin: Dustbin) => {
    const updated: Dustbin = {
      ...bin,
      fillLevel: 0,
      status: 'Normal',
      lastEmptied: 'Just now',
    };
    onUpdateDustbin(updated);
    setFeedbackMessage(`✅ ${bin.binNumber} emptied and status reset to Normal.`);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Street Dustbins Monitoring
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
            IoT Ultrasonic Telemetry
          </span>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          Automated fill level tracking. Containers reaching &ge;85% critical threshold immediately generate cleaning alerts for municipal routing.
        </p>
      </div>

      {/* Feedback Toast */}
      {feedbackMessage && (
        <div className="p-3 bg-emerald-900 text-emerald-100 text-xs rounded-xl shadow-md border border-emerald-700 flex items-center justify-between animate-fade-in">
          <span>{feedbackMessage}</span>
          <button onClick={() => setFeedbackMessage(null)} className="text-white hover:text-gray-200 text-sm font-bold">
            &times;
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex space-x-1.5 overflow-x-auto pb-1 text-xs">
        {(['All', 'Normal', 'Almost Full', 'Cleaning Required'] as const).map((tab) => {
          const count = dustbins.filter((b) => (tab === 'All' ? true : b.status === tab)).length;
          const isSelected = filter === tab;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                isSelected
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-emerald-50 border border-gray-200'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isSelected ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dustbins List */}
      <div className="space-y-3">
        {filteredBins.map((bin) => {
          const statusInfo = getStatusDetails(bin.status);
          const isCritical = bin.status === 'Cleaning Required';

          return (
            <div
              key={bin.id}
              className={`bg-white rounded-2xl p-4 border transition-all shadow-sm ${
                isCritical
                  ? 'border-rose-300 ring-2 ring-rose-500/20'
                  : 'border-gray-200 hover:border-emerald-200'
              }`}
            >
              {/* Header row */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-base text-gray-900">
                      {bin.binNumber}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusInfo.bg}`}
                    >
                      {bin.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-gray-700 mt-0.5">
                    {bin.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 flex items-center mt-0.5">
                    <MapPin className="w-3 h-3 text-gray-400 mr-1" />
                    {bin.location}
                  </p>
                </div>

                <div className="text-right">
                  <span className={`text-2xl font-black ${statusInfo.indicator}`}>
                    {bin.fillLevel}%
                  </span>
                  <p className="text-[10px] text-gray-400">Fill Level</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${statusInfo.barColor}`}
                    style={{ width: `${bin.fillLevel}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-gray-400 mt-1">
                  <span>Capacity: {bin.capacityLiters} L</span>
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Emptied: {bin.lastEmptied}
                  </span>
                </div>
              </div>

              {/* Simulation Controls & Dispatch Button */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[11px] text-gray-500 font-medium">
                    Sensor Sim:
                  </span>
                  <button
                    onClick={() => adjustFillLevel(bin, -10)}
                    disabled={bin.fillLevel <= 0}
                    className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-40"
                    title="Simulate Decreasing Fill"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => adjustFillLevel(bin, 10)}
                    disabled={bin.fillLevel >= 100}
                    className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-40"
                    title="Simulate Increasing Fill"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  {isCritical && (
                    <button
                      onClick={() => onTriggerAlert(bin)}
                      className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold transition-colors flex items-center space-x-1"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Dispatch Truck</span>
                    </button>
                  )}

                  <button
                    onClick={() => emptyBin(bin)}
                    className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors flex items-center space-x-1 border border-emerald-200"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Empty Bin</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
