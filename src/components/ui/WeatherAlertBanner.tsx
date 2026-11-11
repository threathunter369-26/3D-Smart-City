import React from 'react';
import { AlertTriangle, Activity, CloudLightning, ShieldAlert, X } from 'lucide-react';
import { useCityStore } from '../../store/useCityStore';

const TornadoIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 4H3" />
    <path d="M18 8H6" />
    <path d="M19 12H9" />
    <path d="M16 16h-6" />
    <path d="M11 20H9" />
  </svg>
);

export const WeatherAlertBanner: React.FC = () => {
  const { weather, earthquake, stopEarthquake, setWeather, triggerEarthquake } = useCityStore();

  if (!earthquake.active && weather !== 'tornado' && weather !== 'storm') {
    return null;
  }

  return (
    <div className="fixed top-18 left-1/2 -translate-x-1/2 z-30 w-[94vw] max-w-[620px] animate-in fade-in slide-in-from-top-2">
      {earthquake.active ? (
        <div className="bg-red-600 text-white rounded-2xl shadow-xl shadow-red-500/30 p-3 flex items-center justify-between gap-3 border border-red-500">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white text-red-700 px-1.5 py-0.2 rounded font-mono">
                  緊急地震速報
                </span>
                <span className="text-xs font-bold">SEISMIC TREMOR DETECTED</span>
              </div>
              <p className="text-[11px] text-red-100">
                震度 {earthquake.intensity} (Shindo {earthquake.intensity}) | Magnitude M{earthquake.magnitude} | Structural Resonance & Tuned Dampers Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Shindo intensity selector */}
            <div className="flex items-center gap-1 bg-black/20 rounded-lg p-1 text-[11px] font-bold">
              {[4, 5, 6, 7].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => triggerEarthquake(lvl)}
                  className={`px-1.5 py-0.5 rounded transition-all ${
                    earthquake.intensity === lvl ? 'bg-white text-red-700' : 'text-red-100 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <button
              onClick={stopEarthquake}
              className="px-2.5 py-1 bg-white text-red-700 hover:bg-red-50 text-xs font-bold rounded-lg shadow-sm transition-all"
            >
              End
            </button>
          </div>
        </div>
      ) : weather === 'tornado' ? (
        <div className="bg-amber-600 text-white rounded-2xl shadow-xl shadow-amber-500/30 p-3 flex items-center justify-between gap-3 border border-amber-500">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <TornadoIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white text-amber-800 px-1.5 py-0.2 rounded font-mono">
                  竜巻注意情報
                </span>
                <span className="text-xs font-bold">3D CYCLONE VORTEX ACTIVE</span>
              </div>
              <p className="text-[11px] text-amber-100">
                Rotational vortex velocity 65m/s. Buildings & foliage dynamically oscillating in proximity.
              </p>
            </div>
          </div>
          <button
            onClick={() => setWeather('clear')}
            className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="bg-sky-900/90 backdrop-blur-md text-white rounded-2xl shadow-xl p-3 flex items-center justify-between gap-3 border border-sky-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <CloudLightning className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-sky-500 text-white px-1.5 py-0.2 rounded font-mono">
                  豪雨警報
                </span>
                <span className="text-xs font-bold">ATMOSPHERIC PRECIPITATION & LIGHTNING</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Storm front passing metropolitan area. Periodic high-voltage cloud-to-ground flash illumination.
              </p>
            </div>
          </div>
          <button
            onClick={() => setWeather('clear')}
            className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
