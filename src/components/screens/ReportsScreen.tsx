import React, { useState } from 'react';
import {
  BarChart3,
  PieChart,
  Recycle,
  Leaf,
  Trash2,
  Download,
  Share2,
  Check,
  Award,
  TrendingUp,
  Globe2,
  FileSpreadsheet,
} from 'lucide-react';
import { WasteStatistics } from '../../types';

interface ReportsScreenProps {
  stats: WasteStatistics;
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({ stats }) => {
  const [copied, setCopied] = useState(false);

  const bioRatio = ((stats.biodegradable / stats.totalScanned) * 100).toFixed(1);
  const nonBioRatio = ((stats.nonBiodegradable / stats.totalScanned) * 100).toFixed(1);

  const handleCopyReport = () => {
    const text = `EcoSort AI - Waste Segregation & Monitoring Report
======================================================
Total Waste Scanned: ${stats.totalScanned} items
Biodegradable (Organic/Compostable): ${stats.biodegradable} items (${bioRatio}%)
Non-Biodegradable (Recyclables/Polymers): ${stats.nonBiodegradable} items (${nonBioRatio}%)
Active Municipal Alerts: ${stats.activeAlerts}

Environmental Impact Metrics:
- Landfill Mass Diverted: ${stats.landfillDivertedKg} kg
- Carbon Footprint Reduced: ${stats.carbonReducedKg} kg CO2e
- Compost Yield Produced: ${stats.compostPotentialKg} kg organic fertilizer

Generated via EcoSort AI Smart Waste System (Kotlin & Jetpack Compose)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Waste Segregation Reports
          </h2>
          <p className="text-xs text-gray-600 mt-1">
            Statistical breakdown of scanned municipal and remote waste items.
          </p>
        </div>

        <button
          onClick={handleCopyReport}
          className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Export Data'}</span>
        </button>
      </div>

      {/* Segregation Ratio Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-100 rounded-xl text-emerald-800">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900">
                Segregation Proportion
              </h3>
              <p className="text-xs text-gray-500">
                Biodegradable vs Non-Biodegradable breakdown
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold text-gray-500 block">
              Total Scanned
            </span>
            <span className="text-2xl font-black text-emerald-900">
              {stats.totalScanned}
            </span>
          </div>
        </div>

        {/* Dual Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden flex shadow-inner">
            <div
              className="bg-emerald-600 h-full transition-all duration-700 relative group cursor-pointer"
              style={{ width: `${bioRatio}%` }}
              title={`Biodegradable: ${stats.biodegradable} items (${bioRatio}%)`}
            />
            <div
              className="bg-rose-600 h-full transition-all duration-700 relative group cursor-pointer"
              style={{ width: `${nonBioRatio}%` }}
              title={`Non-Biodegradable: ${stats.nonBiodegradable} items (${nonBioRatio}%)`}
            />
          </div>

          <div className="flex justify-between items-center text-xs pt-1">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
              <span className="font-bold text-gray-800">Biodegradable:</span>
              <span className="font-extrabold text-emerald-700">
                {stats.biodegradable} ({bioRatio}%)
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-600 inline-block" />
              <span className="font-bold text-gray-800">Non-Biodegradable:</span>
              <span className="font-extrabold text-rose-700">
                {stats.nonBiodegradable} ({nonBioRatio}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Environmental Impact Cards */}
      <div>
        <h3 className="font-bold text-gray-900 text-sm mb-2.5 flex items-center space-x-1.5">
          <Globe2 className="w-4 h-4 text-emerald-700" />
          <span>Environmental Sustainability Impact</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2">
              <Recycle className="w-4 h-4" />
            </div>
            <span className="text-2xl font-extrabold text-gray-900 block">
              {stats.landfillDivertedKg} kg
            </span>
            <span className="text-xs font-semibold text-emerald-800 block mt-0.5">
              Landfill Mass Diverted
            </span>
            <p className="text-[11px] text-gray-500 mt-1 leading-normal">
              Directly segregated into recyclable treatment channels rather than open dump yards.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-teal-100 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-2">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-2xl font-extrabold text-gray-900 block">
              {stats.carbonReducedKg} kg
            </span>
            <span className="text-xs font-semibold text-teal-800 block mt-0.5">
              CO₂ Carbon Offset
            </span>
            <p className="text-[11px] text-gray-500 mt-1 leading-normal">
              Reduced greenhouse methane generation through controlled aerobic decomposition.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2">
              <Leaf className="w-4 h-4" />
            </div>
            <span className="text-2xl font-extrabold text-gray-900 block">
              {stats.compostPotentialKg} kg
            </span>
            <span className="text-xs font-semibold text-emerald-800 block mt-0.5">
              Nutrient Compost Yield
            </span>
            <p className="text-[11px] text-gray-500 mt-1 leading-normal">
              Rich organic soil conditioning compost derived from vegetable and food scrap sorting.
            </p>
          </div>
        </div>
      </div>

      {/* Segregation Category Matrix */}
      <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-gray-900">
          Two-Class Waste Stream Matrix
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Biodegradable Card */}
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <div className="flex items-center justify-between font-bold text-emerald-900 mb-2">
              <span className="flex items-center">
                <Leaf className="w-4 h-4 mr-1 text-emerald-700" />
                Biodegradable (Green Stream)
              </span>
              <span>{stats.biodegradable} Items</span>
            </div>
            <ul className="space-y-1 text-gray-700 text-[11px]">
              <li>• Kitchen food leftovers & vegetable trimmings</li>
              <li>• Fruit rinds, peels, and tea foliage</li>
              <li>• Plain paper, cardboard shipping cartons</li>
              <li>• Natural wood chips, leaves & agricultural mulch</li>
            </ul>
            <div className="mt-2.5 pt-2 border-t border-emerald-200 text-[10px] text-emerald-800 font-semibold">
              Disposal Destination: Green Wet Waste Composter / Biogas Pit
            </div>
          </div>

          {/* Non-Biodegradable Card */}
          <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200">
            <div className="flex items-center justify-between font-bold text-rose-900 mb-2">
              <span className="flex items-center">
                <Trash2 className="w-4 h-4 mr-1 text-rose-700" />
                Non-Biodegradable (Blue/Red Stream)
              </span>
              <span>{stats.nonBiodegradable} Items</span>
            </div>
            <ul className="space-y-1 text-gray-700 text-[11px]">
              <li>• PET beverage bottles & soft polythene covers</li>
              <li>• Beverage soda cans & aluminum food foil</li>
              <li>• Glass containers & porcelain crockery</li>
              <li>• E-waste wires, battery cells, electronic scrap</li>
            </ul>
            <div className="mt-2.5 pt-2 border-t border-rose-200 text-[10px] text-rose-800 font-semibold">
              Disposal Destination: Blue Dry Recyclable / Authorized Reclamation
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
