import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  X,
  Sparkles,
  Navigation,
  Wind,
  CloudLightning,
  Snowflake,
  Activity,
  Volume2,
} from 'lucide-react';
import { useCityStore } from '../../store/useCityStore';

export const AIDispatchModal: React.FC = () => {
  const {
    aiDrawerOpen,
    setAiDrawerOpen,
    aiMessages,
    aiThinking,
    sendAiPrompt,
  } = useCityStore();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, aiThinking]);

  if (!aiDrawerOpen) return null;

  const handleSend = () => {
    if (!input.trim() || aiThinking) return;
    const text = input.trim();
    setInput('');
    sendAiPrompt(text);
  };

  const handleQuickPrompt = (prompt: string) => {
    if (aiThinking) return;
    sendAiPrompt(prompt);
  };

  const quickPrompts = [
    { label: '🗼 Tour Tokyo Tower', prompt: 'Take me on a tour to Tokyo Communications Tower and check wind sway' },
    { label: '⚡ Earthquake Drill', prompt: 'Trigger an earthquake simulation (Shindo 6) and observe skyscraper tuned mass damping' },
    { label: '🌪️ Tornado Vortex', prompt: 'Spawn a 3D tornado cyclone near the stadium and observe building movement' },
    { label: '🌧️ Thunderstorm', prompt: 'Simulate a severe thunderstorm with lightning flashes over the financial district' },
    { label: '❄️ Winter Snowfall', prompt: 'Set weather to winter snowfall with starry night sky' },
    { label: '🎙️ Full City Tour', prompt: 'Start a guided autonomous camera tour of all architectural landmarks' },
    { label: '🌅 Golden Hour', prompt: 'Fast-forward time of day to sunset golden hour and show traffic telemetry' },
  ];

  return (
    <div className="fixed top-20 right-4 z-40 w-[94vw] max-w-[420px] h-[82vh] max-h-[640px] bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-3xl shadow-2xl shadow-slate-400/40 flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-sky-50/80 via-white to-sky-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center text-white shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-bold text-slate-900 tracking-tight">AI Smart City Dispatcher</h2>
              <span className="text-[9px] font-semibold bg-sky-100 text-sky-700 px-1.5 py-0.2 rounded border border-sky-200">
                Gemini 3.8
              </span>
            </div>
            <p className="text-[10px] text-slate-500">Autonomous 3D Tour & Weather Engine</p>
          </div>
        </div>
        <button
          onClick={() => setAiDrawerOpen(false)}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="p-2 border-b border-slate-100 bg-slate-50/60 overflow-x-auto flex gap-1.5 text-xs select-none">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickPrompt(qp.prompt)}
            disabled={aiThinking}
            className="shrink-0 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-sky-600 hover:border-sky-300 shadow-2xs font-medium text-[11px] transition-all disabled:opacity-50"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {aiMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-sky-600 text-white rounded-br-none shadow-sm'
                    : 'bg-slate-100/90 text-slate-800 rounded-bl-none border border-slate-200/70 shadow-2xs'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center gap-1 text-[10px] text-sky-600 font-bold mb-1">
                    <Sparkles className="w-3 h-3" />
                    <span>AI Dispatcher</span>
                  </div>
                )}
                <p>{msg.text}</p>
                {msg.actionExecuted && (
                  <div className="mt-2 pt-1.5 border-t border-slate-200/60 text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-sky-500 shrink-0" />
                    <span>Executed: {msg.actionExecuted}</span>
                  </div>
                )}
              </div>
              <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          );
        })}

        {aiThinking && (
          <div className="flex items-center gap-2 p-2.5 bg-sky-50 border border-sky-100 rounded-xl text-xs text-sky-700 max-w-[80%]">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Analyzing metropolitan context & planning navigation...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div className="p-2.5 border-t border-slate-100 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-1.5"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI to tour, fly to area, or change weather..."
            className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            disabled={aiThinking}
          />
          <button
            type="submit"
            disabled={!input.trim() || aiThinking}
            className="p-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 disabled:opacity-40 disabled:hover:bg-sky-600 shadow-sm transition-all"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
