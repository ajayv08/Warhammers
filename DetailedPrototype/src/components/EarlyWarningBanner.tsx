import React from 'react';
import { AlertTriangle, ArrowUpRight, TrendingUp, CheckCircle, ChevronRight } from 'lucide-react';
import { EarlyWarningAlert } from '../types/triage';

interface EarlyWarningBannerProps {
  alerts: EarlyWarningAlert[];
  onSelectPatient: (patientId: string) => void;
  onDismissAlert: (alertId: string) => void;
}

export const EarlyWarningBanner: React.FC<EarlyWarningBannerProps> = ({
  alerts,
  onSelectPatient,
  onDismissAlert,
}) => {
  const activeAlerts = alerts.filter((a) => !a.acknowledged);

  if (activeAlerts.length === 0) {
    return null;
  }

  // Focus on the most urgent or recent alert
  const primaryAlert = activeAlerts[0];

  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 border-y border-r border-slate-200 p-4 rounded-r-lg shadow-xs transition-all animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        {/* Left Section: Header and Patient Details */}
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-500 text-white rounded-md shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded">
                EARLY WARNING
              </span>
              <span className="font-mono text-sm font-bold text-slate-900">
                Patient {primaryAlert.patientId}
              </span>
              <span className="text-sm font-medium text-slate-700">· {primaryAlert.patientName}</span>
              <span className="text-xs text-slate-500">· {primaryAlert.timestamp}</span>
            </div>

            <div className="mt-2 flex items-center gap-3">
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-xs text-slate-500">Risk increased:</span>
                <span className="text-sm font-semibold text-slate-600 line-through">
                  {primaryAlert.previousScore}
                </span>
                <TrendingUp className="w-4 h-4 text-red-600" />
                <span className="text-base font-bold text-red-600">
                  {primaryAlert.newScore}
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.2 rounded bg-red-100 text-red-800 uppercase">
                  {primaryAlert.level}
                </span>
              </div>
            </div>

            {/* Changed Vitals metrics */}
            <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-700">
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-amber-200">
                <span className="text-slate-500">HR:</span>
                <span className="font-semibold">{primaryAlert.vitalsDeltas.hrDelta}</span>
                <span className="text-red-600 font-bold">↑</span>
              </div>
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-amber-200">
                <span className="text-slate-500">SpO2:</span>
                <span className="font-semibold">{primaryAlert.vitalsDeltas.spO2Delta}</span>
                <span className="text-red-600 font-bold">↓</span>
              </div>
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-amber-200">
                <span className="text-slate-500">BP:</span>
                <span className="font-semibold">{primaryAlert.vitalsDeltas.bpDelta}</span>
                <span className="text-red-600 font-bold">↓</span>
              </div>
              {primaryAlert.visualCue && (
                <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-amber-200 text-indigo-700">
                  <span className="text-slate-500">Visual Evidence:</span>
                  <span className="font-medium truncate max-w-[200px]">{primaryAlert.visualCue}</span>
                </div>
              )}
            </div>

            {/* Contributing factors */}
            <div className="mt-2 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Contributing factors: </span>
              {primaryAlert.contributingFactors.join(' · ')}
            </div>

            <div className="mt-1 text-xs font-semibold text-amber-900 italic">
              "{primaryAlert.recommendation || 'Urgent clinical review recommended'}"
            </div>
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          <button
            onClick={() => onSelectPatient(primaryAlert.patientId)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-xs"
          >
            <span>Review Patient</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDismissAlert(primaryAlert.id)}
            className="px-2.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-md transition-colors"
          >
            Acknowledge
          </button>
        </div>
      </div>

      {activeAlerts.length > 1 && (
        <div className="mt-3 pt-2 border-t border-amber-200/80 flex items-center justify-between text-xs text-amber-900">
          <span>+{activeAlerts.length - 1} more patient alerts in queue</span>
          <div className="flex gap-2">
            {activeAlerts.slice(1).map((a) => (
              <button
                key={a.id}
                onClick={() => onSelectPatient(a.patientId)}
                className="underline hover:text-amber-700 font-mono"
              >
                {a.patientId} ({a.newScore})
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
