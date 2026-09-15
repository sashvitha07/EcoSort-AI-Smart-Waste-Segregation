import React, { useState } from 'react';
import {
  INITIAL_STATS,
  INITIAL_DUSTBINS,
  INITIAL_ALERTS,
  INITIAL_REMOTE_REPORTS,
} from './data/mockData';
import {
  Dustbin,
  AlertItem,
  RemoteWasteReport,
  ScannedWasteItem,
  WasteStatistics,
  NavScreen,
} from './types';
import { TopBar } from './components/TopBar';
import { BottomNavBar } from './components/BottomNavBar';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { ScanWasteScreen } from './components/screens/ScanWasteScreen';
import { DustbinsScreen } from './components/screens/DustbinsScreen';
import { RemoteLocationsScreen } from './components/screens/RemoteLocationsScreen';
import { AlertsScreen } from './components/screens/AlertsScreen';
import { ReportsScreen } from './components/screens/ReportsScreen';
import { AndroidCodeModal } from './components/AndroidCodeModal';
import { Wifi, BatteryMedium, Signal, Sparkles } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<NavScreen>('dashboard');
  const [stats, setStats] = useState<WasteStatistics>(INITIAL_STATS);
  const [dustbins, setDustbins] = useState<Dustbin[]>(INITIAL_DUSTBINS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [remoteReports, setRemoteReports] = useState<RemoteWasteReport[]>(INITIAL_REMOTE_REPORTS);
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);

  // Add newly scanned waste item and increment totals
  const handleAddScannedItem = (item: ScannedWasteItem) => {
    setStats((prev) => ({
      ...prev,
      totalScanned: prev.totalScanned + 1,
      biodegradable:
        item.category === 'Biodegradable'
          ? prev.biodegradable + 1
          : prev.biodegradable,
      nonBiodegradable:
        item.category === 'Non-Biodegradable'
          ? prev.nonBiodegradable + 1
          : prev.nonBiodegradable,
      landfillDivertedKg: parseFloat(
        (prev.landfillDivertedKg + (item.category === 'Non-Biodegradable' ? 0.35 : 0.6)).toFixed(1)
      ),
      carbonReducedKg: parseFloat((prev.carbonReducedKg + 0.22).toFixed(1)),
      compostPotentialKg: parseFloat(
        (prev.compostPotentialKg + (item.category === 'Biodegradable' ? 0.45 : 0)).toFixed(1)
      ),
    }));
  };

  // Update dustbin status and fill levels
  const handleUpdateDustbin = (updatedBin: Dustbin) => {
    setDustbins((prev) =>
      prev.map((b) => (b.id === updatedBin.id ? updatedBin : b))
    );
  };

  // Trigger alert when dustbin is critical or manually flagged
  const handleTriggerAlert = (bin: Dustbin) => {
    const existing = alerts.find(
      (a) => a.targetId === bin.binNumber && a.status === 'Active'
    );
    if (!existing) {
      const newAlert: AlertItem = {
        id: `alert-${Date.now()}`,
        title: `Critical Fill Level (${bin.fillLevel}%) Reached`,
        targetId: bin.binNumber,
        location: bin.location,
        requiredAction: 'Dispatch municipal cleaning truck to empty container immediately',
        priority: 'Urgent',
        timestamp: 'Just now',
        status: 'Active',
        category: 'Dustbin Fill',
      };
      setAlerts((prev) => [newAlert, ...prev]);
      setStats((prev) => ({ ...prev, activeAlerts: prev.activeAlerts + 1 }));
    }
  };

  // Resolve alert action
  const handleResolveAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Completed' } : a))
    );
    setStats((prev) => ({
      ...prev,
      activeAlerts: Math.max(0, prev.activeAlerts - 1),
    }));
  };

  const handleReopenAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Active' } : a))
    );
    setStats((prev) => ({
      ...prev,
      activeAlerts: prev.activeAlerts + 1,
    }));
  };

  // Add remote location waste report
  const handleAddRemoteReport = (report: RemoteWasteReport) => {
    setRemoteReports((prev) => [report, ...prev]);
    // Also create alert if critical severity
    if (report.severity === 'Critical') {
      const newAlert: AlertItem = {
        id: `alert-${Date.now()}`,
        title: `Remote Waste Hazard at ${report.locationName}`,
        targetId: 'Remote GPS Patrol',
        location: `${report.latitude}° N, ${report.longitude}° E`,
        requiredAction: `Sanitation crew required for ${report.wasteCategory} debris: ${report.detectedItems.join(', ')}`,
        priority: 'High',
        timestamp: 'Just now',
        status: 'Active',
        category: 'Remote Waste',
      };
      setAlerts((prev) => [newAlert, ...prev]);
      setStats((prev) => ({ ...prev, activeAlerts: prev.activeAlerts + 1 }));
    }
  };

  const activeAlertCount = alerts.filter((a) => a.status === 'Active').length;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-0 sm:p-4 text-slate-800 font-sans antialiased">
      {/* Container wrapper: either Phone Frame Mockup or Full Fluid */}
      <div
        className={`w-full transition-all duration-300 flex flex-col ${
          isPhoneFrame
            ? 'max-w-md h-screen sm:h-[92vh] sm:rounded-[38px] shadow-2xl overflow-hidden border-0 sm:border-8 border-slate-800 bg-white relative'
            : 'max-w-4xl min-h-screen sm:min-h-[92vh] sm:rounded-2xl shadow-xl overflow-hidden bg-white'
        }`}
      >
        {/* Android Status Bar (Shown in Phone Frame Mode) */}
        {isPhoneFrame && (
          <div className="bg-emerald-900 text-emerald-100 px-6 py-1.5 flex items-center justify-between text-[11px] font-mono select-none z-40 border-b border-emerald-800/40">
            <span className="font-semibold">09:41</span>
            {/* Camera Hole-Punch Notch Simulation */}
            <div className="w-3.5 h-3.5 rounded-full bg-black/60 mx-auto hidden xs:block" />
            <div className="flex items-center space-x-2">
              <Signal className="w-3 h-3 text-emerald-300" />
              <Wifi className="w-3 h-3 text-emerald-300" />
              <BatteryMedium className="w-3.5 h-3.5 text-emerald-300" />
            </div>
          </div>
        )}

        {/* Top App Bar with Android Jetpack Compose aesthetics */}
        <TopBar
          currentScreen={currentScreen}
          activeAlertCount={activeAlertCount}
          isPhoneFrame={isPhoneFrame}
          onTogglePhoneFrame={() => setIsPhoneFrame(!isPhoneFrame)}
          onOpenCodeViewer={() => setIsCodeModalOpen(true)}
        />

        {/* Scrollable Content View */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gray-50/70">
          {currentScreen === 'dashboard' && (
            <DashboardScreen
              stats={stats}
              dustbins={dustbins}
              onNavigate={(screen) => setCurrentScreen(screen)}
            />
          )}

          {currentScreen === 'scan' && (
            <ScanWasteScreen onAddScannedItem={handleAddScannedItem} />
          )}

          {currentScreen === 'dustbins' && (
            <DustbinsScreen
              dustbins={dustbins}
              onUpdateDustbin={handleUpdateDustbin}
              onTriggerAlert={handleTriggerAlert}
            />
          )}

          {currentScreen === 'remote' && (
            <RemoteLocationsScreen
              reports={remoteReports}
              onAddReport={handleAddRemoteReport}
            />
          )}

          {currentScreen === 'alerts' && (
            <AlertsScreen
              alerts={alerts}
              onResolveAlert={handleResolveAlert}
              onReopenAlert={handleReopenAlert}
            />
          )}

          {currentScreen === 'reports' && <ReportsScreen stats={stats} />}
        </main>

        {/* Jetpack Compose Material 3 Bottom Navigation Bar */}
        <BottomNavBar
          currentScreen={currentScreen}
          onSelectScreen={(screen) => setCurrentScreen(screen)}
          activeAlertCount={activeAlertCount}
        />

        {/* Android Home Navigation Gesture Bar (in Phone Frame Mode) */}
        {isPhoneFrame && (
          <div className="bg-white py-1 flex justify-center items-center">
            <div className="w-32 h-1 bg-gray-400 rounded-full" />
          </div>
        )}
      </div>

      {/* Android Kotlin / Jetpack Compose Source Code & Architecture Inspector Modal */}
      <AndroidCodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </div>
  );
}
