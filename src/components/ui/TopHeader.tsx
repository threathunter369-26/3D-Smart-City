import React from 'react';
import {
  Sun,
  Sunset,
  Moon,
  Compass,
  Play,
  Square,
  RotateCcw,
  Sparkles,
  Radio,
  Clock,
  Bot,
} from 'lucide-react';
import { useCityStore, CITY_LANDMARKS } from '../../store/useCityStore';
import { TimeOfDay } from '../../types/city';

export const TopHeader: React.FC = () => {
  const {
    timeOfDay,
    setTimeOfDay,
    hourOfDay,
    autoTimeCycle,
    setAutoTimeCycle,
    cameraPreset,
    setCameraPreset,
    isTourActive,
    setIsTourActive,
    cinematicMode,
    setCinematicMode,
    setActiveLandmark,
    aiDrawerOpen,
    setAiDrawerOpen,
  } = useCityStore();

  const handlePresetChange = (id: string) => {
    setCameraPreset(id);
    if (id === 'isometric') {
      setActiveLandmark(null);
    } else {
      const landmark = CITY_LANDMARKS.find((l) => l.id === id);
      if (landmark) setActiveLandmark(landmark);
    }
  };

  return (
    <header className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
      {/* Brand Title Badge */}
      <div className="pointer-events-auto flex items-center gap-3 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl px-4 py-2.5 shadow-sm shadow-slate-200/50">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-white shadow-sm">
          <Radio className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight text-slate-900">
              TOKYO SMART CITY
            </h1>
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full border border-sky-200">
              3D DIGITAL TWIN
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            リアルタイム都市空間基盤 | IoT Telemetry
          </p>
        </div>
      </div>

      {/* Center Quick Landmark Selector */}
      <div className="pointer-events-auto hidden lg:flex items-center gap-1 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-1.5 shadow-sm shadow-slate-200/50">
        <button
          onClick={() => handlePresetChange('isometric')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            cameraPreset === 'isometric'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          Overview
        </button>

        {CITY_LANDMARKS.slice(0, 5).map((landmark) => (
          <button
            key={landmark.id}
            onClick={() => handlePresetChange(landmark.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              cameraPreset === landmark.id
                ? 'bg-sky-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {landmark.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Right Controls: Time of Day & Tour */}
      <div className="pointer-events-auto flex items-center gap-2 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-1.5 shadow-sm shadow-slate-200/50">
        {/* Time of Day Clock & Auto-Cycle */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-xl text-xs font-mono font-semibold text-slate-700">
          <Clock className="w-3.5 h-3.5 text-sky-600" />
          <span>
            {Math.floor(hourOfDay).toString().padStart(2, '0')}:
            {Math.floor((hourOfDay % 1) * 60).toString().padStart(2, '0')}
          </span>
          <button
            onClick={() => setAutoTimeCycle(!autoTimeCycle)}
            className={`text-[9px] font-bold px-1 py-0.2 rounded ${
              autoTimeCycle ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}
            title="Toggle Continuous 24h Auto-Cycle"
          >
            {autoTimeCycle ? 'AUTO' : 'MANUAL'}
          </button>
        </div>

        {/* Time of Day Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
          {(['day', 'twilight', 'night'] as TimeOfDay[]).map((time) => {
            const isActive = timeOfDay === time;
            return (
              <button
                key={time}
                onClick={() => setTimeOfDay(time)}
                title={`Switch to ${time}`}
                className={`p-1.5 rounded-lg text-xs transition-all ${
                  isActive
                    ? 'bg-white text-sky-600 shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {time === 'day' && <Sun className="w-4 h-4" />}
                {time === 'twilight' && <Sunset className="w-4 h-4" />}
                {time === 'night' && <Moon className="w-4 h-4" />}
              </button>
            );
          })}
        </div>

        {/* AI Smart City Dispatcher Button */}
        <button
          onClick={() => setAiDrawerOpen(!aiDrawerOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
            aiDrawerOpen
              ? 'bg-sky-600 text-white'
              : 'bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white'
          }`}
          title="Open AI Smart City Tour & Dispatch Assistant"
        >
          <Bot className="w-4 h-4" />
          <span className="hidden sm:inline">AI Dispatch</span>
        </button>

        {/* Cinematic Tour Toggle */}
        <button
          onClick={() => setIsTourActive(!isTourActive)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
            isTourActive
              ? 'bg-amber-500 text-white shadow-sm font-semibold'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
          title="Autoplay cinematic camera tour"
        >
          {isTourActive ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          <span className="hidden sm:inline">{isTourActive ? 'Stop Tour' : 'Tour'}</span>
        </button>

        {/* Cinematic Vignette */}
        <button
          onClick={() => setCinematicMode(!cinematicMode)}
          className={`p-1.5 rounded-xl text-xs transition-all ${
            cinematicMode ? 'bg-sky-100 text-sky-700' : 'text-slate-500 hover:bg-slate-100'
          }`}
          title="Toggle Cinematic Mode"
        >
          <Sparkles className="w-4 h-4" />
        </button>

        {/* Reset View */}
        <button
          onClick={() => handlePresetChange('isometric')}
          className="p-1.5 rounded-xl text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all"
          title="Reset Camera to Isometric View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
