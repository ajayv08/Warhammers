import React from 'react';
import { ShieldAlert, HelpCircle, Check, Info } from 'lucide-react';
import { RiskBreakdown, TriageLevel } from '../types/triage';

interface MultimodalRiskPanelProps {
  risk: RiskBreakdown;
}

export const MultimodalRiskPanel: React.FC<MultimodalRiskPanelProps> = ({ risk }) => {
  const getLevelStyle = (level: TriageLevel) => {
    switch (level) {
      case 'CRITICAL':
        return {
          banner: 'bg-red-600 text-white',
          border: 'border-red-600',
          badge: 'bg-red-100 text-red-800 border-red-200',
          text: 'text-red-700',
          label: 'CRITICAL RISK',
          sub: 'Score 80–100 · Priority 1 Immediate Resuscitation',
        };
      case 'HIGH':
        return {
          banner: 'bg-orange-500 text-white',
          border: 'border-orange-500',
          badge: 'bg-orange-100 text-orange-800 border-orange-200',
          text: 'text-orange-700',
          label: 'HIGH RISK',
          sub: 'Score 60–79 · Priority 2 Emergent Intervention',
        };
      case 'MODERATE':
        return {
          banner: 'bg-amber-500 text-white',
          border: 'border-amber-500',
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
          text: 'text-amber-700',
          label: 'MODERATE RISK',
          sub: 'Score 30–59 · Priority 3 Urgent Clinical Triage',
        };
      case 'LOW':
        return {
          banner: 'bg-emerald-600 text-white',
          border: 'border-emerald-600',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          text: 'text-emerald-700',
          label: 'LOW RISK',
          sub: 'Score 0–29 · Priority 4 Non-Urgent Care',
        };
    }
  };

  const style = getLevelStyle(risk.level);

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
      {/* Top Banner with Risk Level and Score */}
      <div className={`p-4 ${style.banner} flex items-center justify-between`}>
        <div>
          <div className="text-[11px] uppercase tracking-wider font-semibold opacity-90">
            Multimodal Triage Decision Support
          </div>
          <div className="text-xl font-bold tracking-tight mt-0.5">{style.label}</div>
          <div className="text-xs opacity-90 mt-0.5">{style.sub}</div>
        </div>

        <div className="text-right">
          <div className="text-xs uppercase tracking-wider opacity-90">Risk Score</div>
          <div className="text-4xl font-extrabold font-mono tabular-nums leading-none mt-1">
            {risk.score}
            <span className="text-lg font-normal opacity-80">/100</span>
          </div>
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Mathematical Breakdown Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Mathematical Score Breakdown
            </h4>
            <span className="text-[11px] text-slate-500 font-mono">Additive Deterministic Logic</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between py-1 px-2 rounded bg-slate-50 border border-slate-100">
              <span className="text-slate-600 font-sans font-medium">Physiological Vitals</span>
              <span className="font-bold text-slate-900 tabular-nums">+{risk.vitalsContribution}</span>
            </div>
            <div className="flex items-center justify-between py-1 px-2 rounded bg-slate-50 border border-slate-100">
              <span className="text-slate-600 font-sans font-medium">Acute Symptoms</span>
              <span className="font-bold text-slate-900 tabular-nums">+{risk.symptomsContribution}</span>
            </div>
            <div className="flex items-center justify-between py-1 px-2 rounded bg-slate-50 border border-slate-100">
              <span className="text-slate-600 font-sans font-medium">Morbidity History</span>
              <span className="font-bold text-slate-900 tabular-nums">+{risk.historyContribution}</span>
            </div>
            <div className="flex items-center justify-between py-1 px-2 rounded bg-blue-50/60 border border-blue-100">
              <div className="flex items-center gap-1.5 font-sans">
                <span className="text-blue-900 font-medium">Visual Evidence (Photo/Video)</span>
                <span className="text-[10px] text-blue-600 font-mono bg-blue-100 px-1 rounded">AI/Demo</span>
              </div>
              <span className="font-bold text-blue-700 tabular-nums">+{risk.visualContribution}</span>
            </div>

            <div className="pt-2 border-t-2 border-dashed border-slate-200 flex items-center justify-between text-sm">
              <span className="font-sans font-bold text-slate-800">Final Composite Risk Score</span>
              <span className={`font-mono font-extrabold text-lg tabular-nums ${style.text}`}>
                {risk.score}
              </span>
            </div>
          </div>

          {/* Granular Transparent Factors list */}
          <div className="mt-4 pt-3 border-t border-slate-200">
            <h5 className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-2">
              Contributing Factors (Transparent Weights)
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {risk.factors.length === 0 ? (
                <span className="text-xs text-slate-400 italic">No significant elevated factors detected.</span>
              ) : (
                risk.factors.map((factor, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded bg-slate-100 text-slate-800 border border-slate-200"
                    title={factor.description}
                  >
                    <span className="font-bold text-blue-700">{factor.label}</span>
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Explainable AI "WHY THIS RISK?" */}
        <div className="space-y-3 bg-slate-50/70 p-3.5 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Why This Risk? (Clinical Rationale)
            </h4>
          </div>

          <div className="space-y-2">
            {risk.reasons.length === 0 ? (
              <p className="text-xs text-slate-600 leading-relaxed">
                Vital signs, symptoms, and physical inspection remain within expected baseline parameters. Continue standard surveillance.
              </p>
            ) : (
              <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700">
                {risk.reasons.map((reason, idx) => (
                  <li key={idx} className="leading-snug">
                    <span className="font-medium text-slate-900">{reason}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {risk.warning && (
            <div className="mt-3 p-2.5 rounded bg-white border border-red-200 text-red-800 text-xs font-medium flex items-start gap-2 shadow-2xs">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{risk.warning}</span>
            </div>
          )}

          <div className="pt-2 text-[10px] text-slate-500 border-t border-slate-200 flex items-center justify-between">
            <span>Deterministic Clinical Decision Support Model</span>
            <span className="italic">Scores &ge; 60 trigger automated warning</span>
          </div>
        </div>
      </div>
    </div>
  );
};
