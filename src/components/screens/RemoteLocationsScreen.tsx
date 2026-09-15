import React, { useState } from 'react';
import {
  MapPin,
  Camera,
  Navigation,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Trees,
  Waves,
  Mountain,
  Sparkles,
  Plus,
  Send,
  ExternalLink,
} from 'lucide-react';
import { RemoteWasteReport, WasteCategory } from '../../types';
import { classifyWasteImage } from '../../utils/classifier';

interface RemoteLocationsScreenProps {
  reports: RemoteWasteReport[];
  onAddReport: (report: RemoteWasteReport) => void;
}

export const RemoteLocationsScreen: React.FC<RemoteLocationsScreenProps> = ({
  reports,
  onAddReport,
}) => {
  const [currentCoords, setCurrentCoords] = useState<{
    latitude: number;
    longitude: number;
    accuracy?: number;
  } | null>(null);
  const [locationName, setLocationName] = useState('Silver Beach Coastal Ridge');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);

  // New survey draft
  const [surveyCategory, setSurveyCategory] = useState<WasteCategory>('Non-Biodegradable');
  const [surveyItems, setSurveyItems] = useState('Plastic Bottles, Discarded Food Wrappers');
  const [surveySeverity, setSurveySeverity] = useState<'Low' | 'Medium' | 'Critical'>('Critical');
  const [surveyNotes, setSurveyNotes] = useState('Debris concentrated along high tide watermark. Needs beach volunteer squad.');

  // Fetch real GPS coordinates via HTML5 Geolocation API
  const requestGpsLocation = () => {
    setGpsLoading(true);
    setGpsError(null);

    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser. Using simulated field coordinates.');
      setCurrentCoords({ latitude: 13.0475, longitude: 80.2824, accuracy: 8 });
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentCoords({
          latitude: parseFloat(position.coords.latitude.toFixed(6)),
          longitude: parseFloat(position.coords.longitude.toFixed(6)),
          accuracy: Math.round(position.coords.accuracy),
        });
        setLocationName(`Outdoor Survey Point (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`);
        setGpsLoading(false);
      },
      (error) => {
        console.warn('GPS location request failed:', error);
        setGpsError('Location permission was denied or timed out. Defaulted to coastal field coordinate.');
        setCurrentCoords({ latitude: 13.0475, longitude: 80.2824, accuracy: 12 });
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handlePresetLocation = (name: string, lat: number, lng: number) => {
    setLocationName(name);
    setCurrentCoords({ latitude: lat, longitude: lng, accuracy: 5 });
    setGpsError(null);
  };

  const handleSubmitSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: RemoteWasteReport = {
      id: `remote-${Date.now()}`,
      locationName: locationName,
      latitude: currentCoords ? currentCoords.latitude : 13.0475,
      longitude: currentCoords ? currentCoords.longitude : 80.2824,
      timestamp: 'Just now',
      wasteCategory: surveyCategory,
      detectedItems: surveyItems.split(',').map((s) => s.trim()).filter(Boolean),
      severity: surveySeverity,
      notes: surveyNotes,
      status: 'Pending Verification',
    };

    onAddReport(newReport);
    setIsSurveyModalOpen(false);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Title & Explanation */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Remote Locations Waste Survey
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-100 text-teal-800">
            GPS Field Patrol
          </span>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          Designed for <strong>beaches, forests, parks, and trails</strong> where fixed IoT cameras cannot easily be installed. Field rangers scan waste and log pinpoint coordinates.
        </p>
      </div>

      {/* GPS Telemetry Box */}
      <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-100 rounded-xl text-emerald-800">
              <Navigation className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900">
                Current GPS Geolocation
              </h3>
              <p className="text-xs text-gray-500">
                Acquires latitude and longitude from device hardware
              </p>
            </div>
          </div>

          <button
            onClick={requestGpsLocation}
            disabled={gpsLoading}
            className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 transition-all disabled:opacity-50"
          >
            <Compass className={`w-4 h-4 ${gpsLoading ? 'animate-spin' : ''}`} />
            <span>{gpsLoading ? 'Acquiring...' : 'Get GPS Pin'}</span>
          </button>
        </div>

        {/* Coords read-out card */}
        <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
            <span className="font-semibold text-gray-700">Location Tag:</span>
            <span className="font-bold text-emerald-900">{locationName}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-white p-2 rounded-lg border border-emerald-200/60">
              <span className="text-[10px] text-gray-500 block">Latitude:</span>
              <span className="font-bold text-emerald-800 text-sm">
                {currentCoords ? `${currentCoords.latitude}° N` : '13.0475° N'}
              </span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-emerald-200/60">
              <span className="text-[10px] text-gray-500 block">Longitude:</span>
              <span className="font-bold text-emerald-800 text-sm">
                {currentCoords ? `${currentCoords.longitude}° E` : '80.2824° E'}
              </span>
            </div>
          </div>

          {currentCoords?.accuracy && (
            <p className="text-[11px] text-emerald-700 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Satellite fix accuracy: &plusmn;{currentCoords.accuracy} meters
            </p>
          )}

          {gpsError && (
            <p className="text-[11px] text-amber-700 bg-amber-100/70 p-2 rounded-lg">
              {gpsError}
            </p>
          )}
        </div>

        {/* Quick Location Presets for Beaches & Forests */}
        <div>
          <span className="text-[11px] font-bold text-gray-600 block mb-1.5">
            Quick Remote Test Locations:
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <button
              onClick={() => handlePresetLocation('Silver Beach Coastal Trail', 13.0475, 80.2824)}
              className="p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 border border-gray-200 text-left transition-colors flex items-center space-x-1"
            >
              <Waves className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="truncate font-medium text-gray-800 text-[11px]">Beach Trail</span>
            </button>
            <button
              onClick={() => handlePresetLocation('Pine Forest Nature Reserve', 11.4102, 76.6950)}
              className="p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 border border-gray-200 text-left transition-colors flex items-center space-x-1"
            >
              <Trees className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="truncate font-medium text-gray-800 text-[11px]">Pine Forest</span>
            </button>
            <button
              onClick={() => handlePresetLocation('Riverbank Valley Trail', 12.9815, 80.2180)}
              className="p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 border border-gray-200 text-left transition-colors flex items-center space-x-1"
            >
              <Mountain className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span className="truncate font-medium text-gray-800 text-[11px]">River Valley</span>
            </button>
          </div>
        </div>

        {/* Primary CTA: Scan Remote Waste */}
        <button
          onClick={() => setIsSurveyModalOpen(true)}
          className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-98 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
        >
          <Camera className="w-4 h-4 text-emerald-200" />
          <span>Record Remote Waste Survey</span>
        </button>
      </div>

      {/* Survey Modal */}
      {isSurveyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-gray-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-base text-gray-900 flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>New Remote Waste Survey</span>
              </h3>
              <button
                onClick={() => setIsSurveyModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitSurvey} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  Location Name:
                </label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  Waste Category:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSurveyCategory('Biodegradable')}
                    className={`py-2 px-3 rounded-lg font-bold border transition-all ${
                      surveyCategory === 'Biodegradable'
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    Biodegradable
                  </button>
                  <button
                    type="button"
                    onClick={() => setSurveyCategory('Non-Biodegradable')}
                    className={`py-2 px-3 rounded-lg font-bold border transition-all ${
                      surveyCategory === 'Non-Biodegradable'
                        ? 'bg-rose-700 text-white border-rose-700'
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    Non-Biodegradable
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  Detected Debris Items:
                </label>
                <input
                  type="text"
                  value={surveyItems}
                  onChange={(e) => setSurveyItems(e.target.value)}
                  placeholder="e.g. Plastic bottles, fishing nets, food cartons"
                  className="w-full p-2 border border-gray-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  Severity Level:
                </label>
                <div className="flex space-x-2">
                  {(['Low', 'Medium', 'Critical'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSurveySeverity(lvl)}
                      className={`flex-1 py-1.5 rounded-lg font-semibold border ${
                        surveySeverity === lvl
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-white text-gray-700 border-gray-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  Field Notes / Sanitation Directive:
                </label>
                <textarea
                  value={surveyNotes}
                  onChange={(e) => setSurveyNotes(e.target.value)}
                  rows={2}
                  className="w-full p-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsSurveyModalOpen(false)}
                  className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center space-x-1 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit GPS Log</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Historical Remote Incident Records */}
      <div>
        <h3 className="font-bold text-gray-900 text-sm mb-2 flex items-center space-x-1.5">
          <span>Surveyed Remote Incidents</span>
          <span className="text-xs font-normal text-gray-500">
            ({reports.length} logged)
          </span>
        </h3>

        <div className="space-y-2.5">
          {reports.map((rpt) => (
            <div
              key={rpt.id}
              className="bg-white rounded-2xl p-3.5 border border-gray-200 shadow-sm space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-gray-900">
                    {rpt.locationName}
                  </h4>
                  <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                    GPS: {rpt.latitude}° N, {rpt.longitude}° E
                  </p>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    rpt.wasteCategory === 'Biodegradable'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {rpt.wasteCategory}
                </span>
              </div>

              <div className="flex flex-wrap gap-1">
                {rpt.detectedItems.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-[10px] font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>

              {rpt.notes && (
                <p className="text-[11px] text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100 leading-relaxed">
                  {rpt.notes}
                </p>
              )}

              <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1 border-t border-gray-100">
                <span>Timestamp: {rpt.timestamp}</span>
                <span className="font-semibold text-emerald-700">
                  Status: {rpt.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
