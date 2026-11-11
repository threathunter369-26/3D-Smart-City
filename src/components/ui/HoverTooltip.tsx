import React, { useEffect, useState } from 'react';
import { useCityStore } from '../../store/useCityStore';
import { MapPin } from 'lucide-react';

export const HoverTooltip: React.FC = () => {
  const { hoveredLandmark, activeLandmark } = useCityStore();
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!hoveredLandmark || (activeLandmark && activeLandmark.id === hoveredLandmark.id)) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed z-40 bg-slate-900/90 text-white backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-slate-700/60 text-xs transition-opacity duration-150"
      style={{
        left: `${mousePos.x + 14}px`,
        top: `${mousePos.y + 14}px`,
      }}
    >
      <div className="flex items-center gap-1.5">
        <MapPin className="w-3.5 h-3.5 text-sky-400" />
        <span className="font-bold">{hoveredLandmark.name}</span>
      </div>
      <div className="text-[10px] text-slate-300 mt-0.5 flex items-center justify-between gap-2">
        <span>{hoveredLandmark.japaneseName}</span>
        <span className="text-sky-300 font-medium">Click to inspect</span>
      </div>
    </div>
  );
};
