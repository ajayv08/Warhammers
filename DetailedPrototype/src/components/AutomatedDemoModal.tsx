import React from 'react';
import { Play, Pause, RotateCcw, X, ArrowRight, Activity, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

interface AutomatedDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  isRunning: boolean;
  currentStep: number;
  timerSeconds: number;
  totalDuration: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onJumpToStep: (step: number) => void;
}

export const AutomatedDemoModal: React.FC<AutomatedDemoModalProps> = ({
  isOpen,
  onClose,
  isRunning,
  currentStep,
  timerSeconds,
  totalDuration,
  onStart,
  onPause,
  onReset,
  onJumpToStep,
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      step: 0,
      title: 'Phase 1: Baseline Stable State',
      level: 'LOW RISK (Score: 24)',
      vitals: 'HR 82 · SpO2 98% · BP 120/78',
      summary: 'Patient P-004 (David Chen) arrives with mild fatigue and vague malaise. Normal sinus rhythm.',
      actionTaken: 'Normal non-urgent triage triage status (P4).',
    },
    {
      step: 1,
      title: 'Phase 2: Sub-acute Progression',
      level: 'MODERATE RISK (Score: 38)',
      vitals: 'HR 98 → 105 · SpO2 94% · BP 108/70',
      summary: 'Patient reports fever chills and mild shortness of breath. Tachycardia onset detected.',
      actionTaken: 'Priority escalated to P3 Urgent; continuous surveillance initiated.',
    },
    {
      step: 2,
      title: 'Phase 3: Visual Evidence Captured',
      level: 'HIGH RISK (Score: 71)',
      vitals: 'HR 121 · SpO2 91% · BP 98/62',
      summary: 'Clinical photo uploaded revealing marked pre-tibial edema (+10 pts visual contribution).',
      actionTaken: 'EARLY WARNING banner triggers! Priority elevated to P2 Emergent.',
    },
    {
      step: 3,
      title: 'Phase 4: Critical Sepsis Cascade',
      level: 'CRITICAL RISK (Score: 89)',
      vitals: 'HR 135 · SpO2 86% · BP 88/52',
      summary: 'Hypoperfusion and severe hypoxemia. Patient surges to #1 in Emergency Priority Queue.',
      actionTaken: 'Automated P1 Resuscitation callout; immediate physician intervention required.',
    },
  ];

  const progressPercent = Math.min(100, Math.round(((totalDuration - timerSeconds) / totalDuration) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-fadeIn">
        {/* Modal Top Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-tight">
                Hackathon Presentation Demo Controller
              </h3>
              <p className="text-xs text-slate-400">
                Automated 35s clinical trajectory simulation on Patient P-004 (David Chen)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Presentation Controls Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {!isRunning ? (
              <button
                onClick={onStart}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-xs cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start 35s Live Demo</span>
              </button>
            ) : (
              <button
                onClick={onPause}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-amber-400 hover:bg-amber-500 rounded-md transition-colors shadow-xs cursor-pointer"
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Demo</span>
              </button>
            )}

            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Baseline</span>
            </button>
          </div>

          {/* Timer and Progress */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-500">Demo Timer:</span>
            <span className="text-base font-bold text-slate-900 tabular-nums">
              {totalDuration - timerSeconds}s / {totalDuration}s
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-200 h-1.5">
          <div
            className="bg-blue-600 h-1.5 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step-by-Step Progression Grid */}
        <div className="p-5 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Deterioration Sequence (Click any step to inspect directly)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {steps.map((st) => {
              const isCurrent = currentStep === st.step;
              const isPast = currentStep > st.step;

              return (
                <div
                  key={st.step}
                  onClick={() => onJumpToStep(st.step)}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                    isCurrent
                      ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-600'
                      : isPast
                      ? 'border-slate-200 bg-slate-50 opacity-80 hover:opacity-100'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-900">{st.title}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                        st.step === 3
                          ? 'bg-red-100 text-red-700'
                          : st.step === 2
                          ? 'bg-orange-100 text-orange-700'
                          : st.step === 1
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {st.level}
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-blue-700 font-semibold mb-1">
                    {st.vitals}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight mb-1">{st.summary}</p>
                  <p className="text-[10px] text-slate-400 italic">{st.actionTaken}</p>
                </div>
              );
            })}
          </div>

          {/* Live narration callout for judges */}
          <div className="mt-4 p-3 rounded-lg bg-slate-900 text-white text-xs space-y-1">
            <div className="flex items-center justify-between text-blue-400 font-mono text-[11px]">
              <span>HACKATHON PRESENTER NARRATION CUE</span>
              <span>PHASE {currentStep + 1} OF 4</span>
            </div>
            <p className="text-slate-200 text-xs leading-relaxed font-sans">
              {currentStep === 0 &&
                '“Notice how Patient P-004 starts at LOW risk (Score 24). The deterministic engine gives transparent point values to vitals and baseline history.”'}
              {currentStep === 1 &&
                '“As temperature rises and heart rate climbs to 105 bpm, the score shifts to MODERATE (Score 38). Notice the priority queue automatically recalculating order.”'}
              {currentStep === 2 &&
                '“The nurse captures a photo of severe pre-tibial swelling. The visual engine adds +10 points, spiking total risk to 71 (HIGH) and immediately firing the EARLY WARNING banner!”'}
              {currentStep === 3 &&
                '“Finally, the sepsis cascade triggers severe hypoxemia (SpO2 86%) and shock BP (88/52). P-004 hits CRITICAL (Score 89), instantly topping the Priority Queue for resuscitation.”'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono">
            Deterministic Engine · Zero hallucinations · Fictional Data
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded"
          >
            Close Controller
          </button>
        </div>
      </div>
    </div>
  );
};
