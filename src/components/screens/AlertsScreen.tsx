import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Truck,
  Check,
  RotateCcw,
  Sparkles,
  Filter,
} from 'lucide-react';
import { AlertItem } from '../../types';

interface AlertsScreenProps {
  alerts: AlertItem[];
  onResolveAlert: (id: string) => void;
  onReopenAlert: (id: string) => void;
}

export const AlertsScreen: React.FC<AlertsScreenProps> = ({
  alerts,
  onResolveAlert,
  onReopenAlert,
}) => {
  const [tab, setTab] = useState<'Active' | 'Completed' | 'All'>('Active');

  const activeCount = alerts.filter((a) => a.status === 'Active').length;
  const completedCount = alerts.filter((a) => a.status === 'Completed').length;

  const filteredAlerts = alerts.filter((alert) => {
    if (tab === 'All') return true;
    return alert.status === tab;
  });

  const getPriorityBadge = (priority: AlertItem['priority']) => {
    switch (priority) {
      case 'Urgent':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
            Urgent Action
          </span>
        );
      case 'High':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-200">
            High Priority
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-800 border border-blue-200">
            Medium
          </span>
        );
      case 'Low':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-gray-100 text-gray-700 border border-gray-200">
            Low
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Waste & Cleaning Alerts
          </h2>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              activeCount > 0
                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
          >
            {activeCount} Active Required
          </span>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          Automated alert dispatches triggered by high container capacity (&ge;85%) and remote field sensor surveys.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setTab('Active')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
            tab === 'Active'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span>Active Alerts</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white">
            {activeCount}
          </span>
        </button>

        <button
          onClick={() => setTab('Completed')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
            tab === 'Completed'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span>Completed History</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-700 text-white">
            {completedCount}
          </span>
        </button>

        <button
          onClick={() => setTab('All')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            tab === 'All'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All ({alerts.length})
        </button>
      </div>

      {/* Alerts list */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-gray-200 p-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
            <h4 className="font-bold text-gray-800 text-sm">
              No {tab.toLowerCase()} alerts
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              All urban dustbins and remote locations are currently within safe limits.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isActive = alert.status === 'Active';

            return (
              <div
                key={alert.id}
                className={`rounded-2xl p-4 border transition-all shadow-sm ${
                  isActive
                    ? 'bg-rose-50/50 border-rose-200 ring-1 ring-rose-500/20'
                    : 'bg-white border-gray-200 opacity-90'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-700">
                        {alert.targetId}
                      </span>
                      {getPriorityBadge(alert.priority)}
                    </div>
                    <h3 className="font-bold text-sm text-gray-900 leading-tight">
                      {alert.title}
                    </h3>
                  </div>

                  <span className="text-[10px] text-gray-400 font-mono">
                    {alert.timestamp}
                  </span>
                </div>

                {/* Location */}
                <p className="text-xs text-gray-600 flex items-center mt-2">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 mr-1.5 shrink-0" />
                  <span>{alert.location}</span>
                </p>

                {/* Action instruction box */}
                <div className="mt-2.5 p-2.5 bg-white rounded-xl border border-gray-200/80">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                    Required Sanitation Action:
                  </span>
                  <p className="text-xs text-gray-800 mt-0.5 leading-relaxed font-medium">
                    {alert.requiredAction}
                  </p>
                </div>

                {/* Status action toggle */}
                <div className="mt-3 pt-2.5 border-t border-gray-200/60 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-xs">
                    {isActive ? (
                      <span className="text-rose-700 font-bold flex items-center">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                        Pending Municipal Dispatch
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-bold flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Resolved & Cleaned
                      </span>
                    )}
                  </div>

                  {isActive ? (
                    <button
                      id={`mark-complete-${alert.id}`}
                      onClick={() => onResolveAlert(alert.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs shadow-sm transition-all flex items-center space-x-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Completed</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onReopenAlert(alert.id)}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-xs transition-colors flex items-center space-x-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reopen</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
