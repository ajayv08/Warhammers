import React from 'react';
import { Heart, Activity, Wind, Thermometer, Gauge } from 'lucide-react';
import { Vitals } from '../types/triage';

interface VitalsGridProps {
  vitals: Vitals;
  onOpenEditModal: () => void;
}

export const VitalsGrid: React.FC<VitalsGridProps> = ({ vitals, onOpenEditModal }) => {
  const getHrStatus = (hr: number) => {
    if (hr >= 120 || hr < 50) return { color: 'text-red-600', bg: 'bg-red-50 border-red-200', tag: 'CRITICAL RANGE' };
    if (hr >= 101) return { color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200', tag: 'TACHYCARDIA' };
    return { color: 'text-slate-900', bg: 'bg-white border-slate-200', tag: 'NORMAL (60–100)' };
  };

  const getSpO2Status = (spo2: number) => {
    if (spo2 < 90) return { color: 'text-red-600', bg: 'bg-red-50 border-red-200', tag: 'SEVERE HYPOXEMIA' };
    if (spo2 <= 94) return { color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200', tag: 'MILD HYPOXEMIA' };
    return { color: 'text-slate-900', bg: 'bg-white border-slate-200', tag: 'TARGET (95–100%)' };
  };

  const getBpStatus = (sys: number, dia: number) => {
    if (sys < 90 || sys >= 180) return { color: 'text-red-600', bg: 'bg-red-50 border-red-200', tag: sys < 90 ? 'HYPOTENSION' : 'HYPERTENSIVE CRISIS' };
    if (sys < 100 || sys >= 140) return { color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200', tag: sys < 100 ? 'BORDERLINE LOW' : 'ELEVATED' };
    return { color: 'text-slate-900', bg: 'bg-white border-slate-200', tag: 'NORMAL (<130/85)' };
  };

  const getRrStatus = (rr: number) => {
    if (rr >= 28 || rr < 10) return { color: 'text-red-600', bg: 'bg-red-50 border-red-200', tag: 'CRITICAL RR' };
    if (rr >= 22) return { color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200', tag: 'TACHYPNEA' };
    return { color: 'text-slate-900', bg: 'bg-white border-slate-200', tag: 'NORMAL (12–20)' };
  };

  const getTempStatus = (temp: number) => {
    if (temp >= 39.0 || temp < 35.5) return { color: 'text-red-600', bg: 'bg-red-50 border-red-200', tag: temp >= 39 ? 'HIGH FEVER' : 'HYPOTHERMIA' };
    if (temp >= 38.0) return { color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200', tag: 'PYREXIA' };
    return { color: 'text-slate-900', bg: 'bg-white border-slate-200', tag: 'NORMAL (36.5–37.5)' };
  };

  const hr = getHrStatus(vitals.heartRate);
  const spo2 = getSpO2Status(vitals.spO2);
  const bp = getBpStatus(vitals.systolicBP, vitals.diastolicBP);
  const rr = getRrStatus(vitals.respiratoryRate);
  const temp = getTempStatus(vitals.temperature);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Current Physiological Vitals
        </h3>
        <button
          onClick={onOpenEditModal}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline cursor-pointer"
        >
          Edit / Enter Vitals
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {/* Heart Rate */}
        <div className={`p-3 rounded-lg border transition-all ${hr.bg}`}>
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Heart Rate</span>
            <Heart className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className={`text-2xl font-bold font-mono tabular-nums leading-none ${hr.color}`}>
              {vitals.heartRate}
            </span>
            <span className="text-[11px] text-slate-500">bpm</span>
          </div>
          <div className="mt-1 text-[10px] font-medium text-slate-500 truncate">{hr.tag}</div>
        </div>

        {/* SpO2 */}
        <div className={`p-3 rounded-lg border transition-all ${spo2.bg}`}>
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Oxygen Sat (SpO2)</span>
            <Activity className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className={`text-2xl font-bold font-mono tabular-nums leading-none ${spo2.color}`}>
              {vitals.spO2}
            </span>
            <span className="text-[11px] text-slate-500">%</span>
          </div>
          <div className="mt-1 text-[10px] font-medium text-slate-500 truncate">{spo2.tag}</div>
        </div>

        {/* Blood Pressure */}
        <div className={`p-3 rounded-lg border transition-all ${bp.bg}`}>
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Blood Pressure</span>
            <Gauge className="w-3.5 h-3.5 text-purple-500" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className={`text-2xl font-bold font-mono tabular-nums leading-none ${bp.color}`}>
              {vitals.systolicBP}/{vitals.diastolicBP}
            </span>
            <span className="text-[11px] text-slate-500">mmHg</span>
          </div>
          <div className="mt-1 text-[10px] font-medium text-slate-500 truncate">{bp.tag}</div>
        </div>

        {/* Respiratory Rate */}
        <div className={`p-3 rounded-lg border transition-all ${rr.bg}`}>
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Resp. Rate</span>
            <Wind className="w-3.5 h-3.5 text-teal-500" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className={`text-2xl font-bold font-mono tabular-nums leading-none ${rr.color}`}>
              {vitals.respiratoryRate}
            </span>
            <span className="text-[11px] text-slate-500">/min</span>
          </div>
          <div className="mt-1 text-[10px] font-medium text-slate-500 truncate">{rr.tag}</div>
        </div>

        {/* Temperature */}
        <div className={`p-3 rounded-lg border transition-all ${temp.bg} col-span-2 sm:col-span-1`}>
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Core Temp</span>
            <Thermometer className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className={`text-2xl font-bold font-mono tabular-nums leading-none ${temp.color}`}>
              {vitals.temperature.toFixed(1)}
            </span>
            <span className="text-[11px] text-slate-500">°C</span>
          </div>
          <div className="mt-1 text-[10px] font-medium text-slate-500 truncate">{temp.tag}</div>
        </div>
      </div>
    </div>
  );
};
