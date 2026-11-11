import React, { useEffect, useState } from 'react';
import { CityCanvas } from './components/3d/CityCanvas';
import { TopHeader } from './components/ui/TopHeader';
import { ControlDock } from './components/ui/ControlDock';
import { LandmarkDetailModal } from './components/ui/LandmarkDetailModal';
import { HoverTooltip } from './components/ui/HoverTooltip';
import { AIDispatchModal } from './components/ui/AIDispatchModal';
import { WeatherAlertBanner } from './components/ui/WeatherAlertBanner';
import { useCityStore } from './store/useCityStore';
import { MousePointerClick, Info, X, Bot } from 'lucide-react';

export default function App() {
  const { tickTelemetry, aiDrawerOpen, setAiDrawerOpen } = useCityStore();
  const [showHelpHint, setShowHelpHint] = useState(true);

  // Live telemetry streaming and time-cycle simulation
  useEffect(() => {
    const interval = setInterval(() => {
      tickTelemetry();
    }, 2800);

    return () => clearInterval(interval);
  }, [tickTelemetry]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#eaf2fa] font-sans antialiased text-slate-800">
      {/* 3D WebGL Canvas */}
      <CityCanvas />

      {/* Top Navigation & Status Bar */}
      <TopHeader />

      {/* Weather and Earthquake Emergency Alert Banner */}
      <WeatherAlertBanner />

      {/* Collapsible Ergonomic Bottom Dock */}
      <ControlDock />

      {/* Building & Landmark Detail Inspector Modal */}
      <LandmarkDetailModal />

      {/* AI Smart City Tour & Dispatch Assistant Modal */}
      <AIDispatchModal />

      {/* Hover Cursor Tooltip */}
      <HoverTooltip />

      {/* Floating AI Dispatch Quick Summon Button (Bottom Right) */}
      {!aiDrawerOpen && (
        <button
          onClick={() => setAiDrawerOpen(true)}
          className="fixed bottom-24 right-5 z-20 flex items-center gap-2 px-3.5 py-2.5 bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-700 hover:to-cyan-600 text-white rounded-full shadow-lg shadow-sky-500/30 font-bold text-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Ask AI to tour areas, trigger weather, or inspect city"
        >
          <Bot className="w-4 h-4" />
          <span>Ask AI City Dispatch</span>
        </button>
      )}

      {/* Quick Navigation Help Hint Card */}
      {showHelpHint && (
        <div className="fixed bottom-24 left-4 z-20 hidden md:flex items-center gap-2.5 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl px-3.5 py-2 shadow-sm text-xs text-slate-600 animate-in fade-in duration-500">
          <Info className="w-4 h-4 text-sky-600 shrink-0" />
          <div className="flex items-center gap-2">
            <span>
              <strong>Left Drag:</strong> Orbit | <strong>Right Drag:</strong> Pan | <strong>Scroll:</strong> Zoom
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1 text-sky-700 font-medium">
              <MousePointerClick className="w-3.5 h-3.5" />
              Click any building to inspect
            </span>
          </div>
          <button
            onClick={() => setShowHelpHint(false)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg ml-1"
            title="Dismiss hint"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </main>
  );
}
