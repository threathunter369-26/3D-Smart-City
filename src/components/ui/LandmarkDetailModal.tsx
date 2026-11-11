import React from 'react';
import {
  X,
  Building2,
  Zap,
  Leaf,
  Users,
  Activity,
  Wind,
  Navigation,
} from 'lucide-react';
import { useCityStore } from '../../store/useCityStore';

export const LandmarkDetailModal: React.FC = () => {
  const { activeLandmark, setActiveLandmark, setCameraPreset } = useCityStore();

  if (!activeLandmark) return null;

  const stats = activeLandmark.stats;

  return (
    <div className="fixed top-20 right-4 z-30 w-[92vw] max-w-[380px] bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl shadow-slate-300/60 p-4 transition-all duration-300 animate-in fade-in slide-in-from-right-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full border border-sky-200">
            {activeLandmark.category}
          </span>
          <h2 className="text-base font-bold text-slate-900 mt-1 leading-tight">
            {activeLandmark.name}
          </h2>
          <p className="text-xs text-slate-500 font-medium">{activeLandmark.japaneseName}</p>
        </div>
        <button
          onClick={() => setActiveLandmark(null)}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-600 mt-3 leading-relaxed">
        {activeLandmark.description}
      </p>

      {/* Key Real-time IoT Metrics */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {stats.occupancy !== undefined && (
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
              <Users className="w-3.5 h-3.5 text-sky-600" />
              <span>Occupancy</span>
            </div>
            <div className="text-sm font-bold text-slate-900 mt-1">
              {stats.occupancy}%
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-sky-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.occupancy}%` }}
              />
            </div>
          </div>
        )}

        {stats.powerUsageKw !== undefined && (
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Power Load</span>
            </div>
            <div className="text-sm font-bold text-slate-900 mt-1">
              {stats.powerUsageKw.toLocaleString()} kW
            </div>
            <span className="text-[10px] text-amber-600 font-medium">HVAC & Lighting</span>
          </div>
        )}

        {stats.greenEnergyPercent !== undefined && (
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>Renewable</span>
            </div>
            <div className="text-sm font-bold text-emerald-600 mt-1">
              {stats.greenEnergyPercent}%
            </div>
            <span className="text-[10px] text-slate-500">Solar & Microgrid</span>
          </div>
        )}

        {stats.iotSensorsCount !== undefined && (
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
              <Activity className="w-3.5 h-3.5 text-sky-600" />
              <span>Active IoT</span>
            </div>
            <div className="text-sm font-bold text-slate-900 mt-1">
              {stats.iotSensorsCount} Nodes
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">100% Online</span>
          </div>
        )}
      </div>

      {/* Additional Stats Row */}
      <div className="flex items-center justify-between mt-3 px-1 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Wind className="w-3.5 h-3.5 text-emerald-500" />
          <span>Local AQI: {stats.airQualityIndex || 38} Good</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-sky-500" />
          <span>Height: {activeLandmark.height}m</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
        <button
          onClick={() => setCameraPreset(activeLandmark.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
        >
          <Navigation className="w-3.5 h-3.5" />
          Focus 3D View
        </button>
        <button
          onClick={() => setActiveLandmark(null)}
          className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
