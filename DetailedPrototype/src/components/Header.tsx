import React, { useState, useEffect } from 'react';
import { Activity, Play, Bell, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  urgentAlertCount: number;
  onOpenDemoRunner: () => void;
  isDemoRunning: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  urgentAlertCount,
  onOpenDemoRunner,
  isDemoRunning,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white shrink-0">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-semibold tracking-tight text-slate-900 leading-tight">
            AI-Assisted Emergency Triage & Early Risk Detection
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            Multi-Parameter Clinical Decision Support · Fictional Demonstration
          </p>
        </div>
      </div>

      {/* Zone 2: Navigation & System Status */}
      <div className="hidden lg:flex items-center gap-6 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-medium text-slate-700">Triage Queue Engine Active</span>
        </div>
        <span aria-hidden="true" className="text-slate-300">·</span>
        <div className="flex items-center gap-1.5 font-mono text-slate-700 tabular-nums">
          <span className="text-slate-400">LOCAL TIME</span>
          <span className="font-semibold text-slate-900">{currentTime || '00:00:00'}</span>
        </div>
        <span aria-hidden="true" className="text-slate-300">·</span>
        <div className="flex items-center gap-1.5 text-slate-600">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
          <span>Local Deterministic Risk Engine</span>
        </div>
      </div>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-3">
        {urgentAlertCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs font-medium">
            <Bell className="w-3.5 h-3.5 animate-bounce" />
            <span className="tabular-nums">{urgentAlertCount} Urgent Alerts</span>
          </div>
        )}

        <button
          onClick={onOpenDemoRunner}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shadow-xs ${
            isDemoRunning
              ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isDemoRunning ? 'Presentation Demo Running...' : 'Hackathon Demo Mode'}</span>
        </button>
      </div>
    </header>
  );
};
