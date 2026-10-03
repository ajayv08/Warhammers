import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { RiskHistoryPoint } from '../types/triage';

interface RiskHistoryChartProps {
  history: RiskHistoryPoint[];
}

export const RiskHistoryChart: React.FC<RiskHistoryChartProps> = ({ history }) => {
  // Format chart data
  const data = history.map((pt) => ({
    time: pt.time,
    score: pt.score,
    hr: pt.heartRate,
    spo2: pt.spO2,
    bp: pt.systolicBP,
    note: pt.note,
  }));

  const currentScore = data.length > 0 ? data[data.length - 1].score : 0;
  const initialScore = data.length > 0 ? data[0].score : 0;
  const delta = currentScore - initialScore;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Deterioration Trend & Risk Score History
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Temporal trajectory tracking acute changes in multi-parameter triage acuity
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1 font-mono">
            <span className="text-slate-500">Delta:</span>
            <span
              className={`font-bold tabular-nums ${
                delta > 0 ? 'text-red-600' : delta < 0 ? 'text-emerald-600' : 'text-slate-600'
              }`}
            >
              {delta > 0 ? `+${delta}` : delta} pts
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-500">
            <span className="inline-block w-2.5 h-0.5 bg-emerald-500" /> &lt;30 Low
            <span className="inline-block w-2.5 h-0.5 bg-amber-500" /> 30-59 Mod
            <span className="inline-block w-2.5 h-0.5 bg-orange-500" /> 60-79 High
            <span className="inline-block w-2.5 h-0.5 bg-red-600" /> &ge;80 Crit
          </div>
        </div>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: '#64748b' }}
              stroke="#cbd5e1"
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 30, 60, 80, 100]}
              tick={{ fontSize: 11, fill: '#64748b' }}
              stroke="#cbd5e1"
              tickLine={false}
            />

            {/* Clinical Risk Thresholds */}
            <ReferenceLine y={30} stroke="#f59e0b" strokeDasharray="2 2" strokeOpacity={0.6} />
            <ReferenceLine y={60} stroke="#f97316" strokeDasharray="2 2" strokeOpacity={0.7} />
            <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.8} />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-2.5 rounded shadow-lg text-xs font-mono border border-slate-700">
                      <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 mb-1">
                        Timeline: {label}
                      </div>
                      <div className="text-sm font-extrabold text-blue-400">
                        Risk Score: {item.score} / 100
                      </div>
                      <div className="text-[11px] text-slate-300 mt-1 grid grid-cols-3 gap-2">
                        <span>HR: {item.hr}</span>
                        <span>SpO2: {item.spo2}%</span>
                        <span>BP: {item.bp}</span>
                      </div>
                      {item.note && (
                        <div className="text-[10px] text-amber-300 mt-1 italic font-sans">
                          {item.note}
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4, fill: '#1d4ed8', strokeWidth: 2, stroke: '#ffffff' }}
              activeDot={{ r: 6, fill: '#dc2626', strokeWidth: 2, stroke: '#ffffff' }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>Timeline Points: {data.length} recorded assessments</span>
        <span>
          Current Acuity:{' '}
          <strong className="text-slate-900">
            {currentScore >= 80 ? 'CRITICAL' : currentScore >= 60 ? 'HIGH' : currentScore >= 30 ? 'MODERATE' : 'LOW'}
          </strong>
        </span>
      </div>
    </div>
  );
};
