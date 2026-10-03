import React from 'react';
import { Users, AlertOctagon, AlertTriangle, Clock, ShieldCheck, Eye } from 'lucide-react';
import { TriageLevel } from '../types/triage';

interface KPICardsProps {
  total: number;
  critical: number;
  high: number;
  moderate: number;
  low: number;
  urgentReview: number;
  activeFilter: TriageLevel | 'ALL' | 'URGENT';
  onSelectFilter: (filter: TriageLevel | 'ALL' | 'URGENT') => void;
}

export const KPICards: React.FC<KPICardsProps> = ({
  total,
  critical,
  high,
  moderate,
  low,
  urgentReview,
  activeFilter,
  onSelectFilter,
}) => {
  const cards = [
    {
      id: 'ALL' as const,
      label: 'Total Patients',
      count: total,
      sub: 'In Emergency Queue',
      icon: Users,
      badgeColor: 'text-slate-900',
      activeRing: 'border-slate-900 bg-slate-50/70',
      barColor: 'bg-slate-400',
    },
    {
      id: 'CRITICAL' as const,
      label: 'Critical',
      count: critical,
      sub: 'Score 80–100 · Immediate',
      icon: AlertOctagon,
      badgeColor: 'text-red-700',
      activeRing: 'border-red-600 bg-red-50/60',
      barColor: 'bg-red-600',
    },
    {
      id: 'HIGH' as const,
      label: 'High Risk',
      count: high,
      sub: 'Score 60–79 · Emergent',
      icon: AlertTriangle,
      badgeColor: 'text-orange-700',
      activeRing: 'border-orange-500 bg-orange-50/60',
      barColor: 'bg-orange-500',
    },
    {
      id: 'MODERATE' as const,
      label: 'Moderate',
      count: moderate,
      sub: 'Score 30–59 · Urgent',
      icon: Clock,
      badgeColor: 'text-amber-700',
      activeRing: 'border-amber-500 bg-amber-50/60',
      barColor: 'bg-amber-500',
    },
    {
      id: 'LOW' as const,
      label: 'Low Risk',
      count: low,
      sub: 'Score 0–29 · Non-Urgent',
      icon: ShieldCheck,
      badgeColor: 'text-emerald-700',
      activeRing: 'border-emerald-500 bg-emerald-50/60',
      barColor: 'bg-emerald-500',
    },
    {
      id: 'URGENT' as const,
      label: 'Urgent Review',
      count: urgentReview,
      sub: 'Dynamic Deterioration',
      icon: Eye,
      badgeColor: 'text-indigo-700',
      activeRing: 'border-indigo-600 bg-indigo-50/60',
      barColor: 'bg-indigo-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeFilter === card.id;

        return (
          <button
            key={card.id}
            onClick={() => onSelectFilter(card.id)}
            className={`text-left p-3.5 rounded-lg border transition-all cursor-pointer relative overflow-hidden bg-white ${
              isSelected
                ? `${card.activeRing} shadow-xs border-2`
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            {/* Minimal left bar indicator */}
            <div className={`absolute top-0 left-0 bottom-0 w-1 ${card.barColor}`} />

            <div className="flex items-center justify-between pl-1">
              <span className="text-xs font-medium text-slate-600 truncate">{card.label}</span>
              <Icon className={`w-4 h-4 ${card.badgeColor} shrink-0 opacity-80`} />
            </div>

            <div className="mt-2 pl-1">
              <div className={`text-2xl font-bold font-mono tabular-nums leading-none ${card.badgeColor}`}>
                {card.count}
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5 truncate">{card.sub}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
