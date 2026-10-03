import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, ChevronRight, Activity, Camera, AlertCircle } from 'lucide-react';
import { Patient, TriageLevel } from '../types/triage';

interface PriorityQueueProps {
  patients: Patient[];
  selectedPatientId: string | null;
  onSelectPatient: (patientId: string) => void;
  activeFilter: TriageLevel | 'ALL' | 'URGENT';
  onFilterChange: (filter: TriageLevel | 'ALL' | 'URGENT') => void;
}

export const PriorityQueue: React.FC<PriorityQueueProps> = ({
  patients,
  selectedPatientId,
  onSelectPatient,
  activeFilter,
  onFilterChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'risk' | 'arrivalTime' | 'hr' | 'spO2'>('risk');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Filter patients
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      // Risk level filter
      if (activeFilter !== 'ALL') {
        if (activeFilter === 'URGENT') {
          // Deteriorating or score >= 60
          if (patient.currentRisk.score < 60 && patient.deteriorationStep < 1) return false;
        } else if (patient.currentRisk.level !== activeFilter) {
          return false;
        }
      }

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        patient.id.toLowerCase().includes(q) ||
        patient.name.toLowerCase().includes(q) ||
        patient.chiefComplaint.toLowerCase().includes(q) ||
        patient.symptoms.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [patients, activeFilter, searchQuery]);

  // Sort patients
  const sortedPatients = useMemo(() => {
    const list = [...filteredPatients];
    list.sort((a, b) => {
      let valA: number = 0;
      let valB: number = 0;

      if (sortBy === 'risk') {
        valA = a.currentRisk.score;
        valB = b.currentRisk.score;
      } else if (sortBy === 'hr') {
        valA = a.vitals.heartRate;
        valB = b.vitals.heartRate;
      } else if (sortBy === 'spO2') {
        valA = a.vitals.spO2;
        valB = b.vitals.spO2;
      } else if (sortBy === 'arrivalTime') {
        return sortAsc
          ? a.arrivalTime.localeCompare(b.arrivalTime)
          : b.arrivalTime.localeCompare(a.arrivalTime);
      }

      return sortAsc ? valA - valB : valB - valA;
    });
    return list;
  }, [filteredPatients, sortBy, sortAsc]);

  const toggleSort = (field: 'risk' | 'arrivalTime' | 'hr' | 'spO2') => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(false); // default descending for risk/vitals
    }
  };

  const getLevelBadge = (level: TriageLevel) => {
    switch (level) {
      case 'CRITICAL':
        return {
          bg: 'bg-red-50',
          text: 'text-red-700 border-red-200',
          label: 'CRITICAL',
        };
      case 'HIGH':
        return {
          bg: 'bg-orange-50',
          text: 'text-orange-700 border-orange-200',
          label: 'HIGH',
        };
      case 'MODERATE':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700 border-amber-200',
          label: 'MODERATE',
        };
      case 'LOW':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700 border-emerald-200',
          label: 'LOW',
        };
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'P1':
        return 'text-red-700 font-bold bg-red-100';
      case 'P2':
        return 'text-orange-700 font-semibold bg-orange-100';
      case 'P3':
        return 'text-amber-700 font-medium bg-amber-100';
      default:
        return 'text-emerald-700 font-normal bg-emerald-100';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
      {/* Table controls header */}
      <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">Priority Triage Queue</h2>
            <span className="text-xs text-slate-500 font-mono">
              ({sortedPatients.length} of {patients.length})
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-prioritized by deterministic multimodal risk score. Immediate clinical review for scores &ge; 60.
          </p>
        </div>

        {/* Search & Filter bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patient, complaint, symptom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-colors"
            />
          </div>

          {/* Quick filter tabs */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-md text-xs">
            {(['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => onFilterChange(lvl)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                  activeFilter === lvl
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-medium">
              <th className="py-2.5 px-3">Patient</th>
              <th className="py-2.5 px-3">Age/Sex</th>
              <th className="py-2.5 px-3 min-w-[180px]">Chief Complaint</th>
              <th
                onClick={() => toggleSort('hr')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-slate-900 select-none"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>HR</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('spO2')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-slate-900 select-none"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>SpO2</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-2.5 px-3 text-right">BP</th>
              <th className="py-2.5 px-3 text-right">RR</th>
              <th
                onClick={() => toggleSort('risk')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-slate-900 select-none min-w-[120px]"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Risk Score</span>
                  <ArrowUpDown className="w-3 h-3 text-blue-600" />
                </div>
              </th>
              <th className="py-2.5 px-3 text-center">Level</th>
              <th className="py-2.5 px-3 text-center">Priority</th>
              <th className="py-2.5 px-3 text-right">Updated</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedPatients.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-8 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <AlertCircle className="w-5 h-5 text-slate-400" />
                    <p className="font-medium text-slate-700">No matching patients in queue</p>
                    <p className="text-xs text-slate-400">Try adjusting your search query or risk filter.</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedPatients.map((patient) => {
                const isSelected = patient.id === selectedPatientId;
                const badge = getLevelBadge(patient.currentRisk.level);
                const isHrAbnormal = patient.vitals.heartRate > 100 || patient.vitals.heartRate < 55;
                const isSpO2Abnormal = patient.vitals.spO2 < 93;
                const isBpAbnormal = patient.vitals.systolicBP < 95 || patient.vitals.systolicBP > 160;

                return (
                  <tr
                    key={patient.id}
                    onClick={() => onSelectPatient(patient.id)}
                    className={`cursor-pointer transition-colors group ${
                      isSelected
                        ? 'bg-blue-50/70 border-l-4 border-l-blue-600'
                        : 'hover:bg-slate-50/70'
                    }`}
                  >
                    {/* Patient ID and Name */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-slate-900">{patient.id}</span>
                        <span className="font-medium text-slate-800">{patient.name}</span>
                        {patient.visualEvidence && patient.visualEvidence.totalVisualContribution > 0 && (
                          <span
                            title="AI-Assisted Visual Evidence Captured"
                            className="text-slate-400 hover:text-blue-600"
                          >
                            <Camera className="w-3.5 h-3.5 inline" />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Age / Sex */}
                    <td className="py-2.5 px-3 text-slate-600 tabular-nums">
                      {patient.age}y · {patient.sex[0]}
                    </td>

                    {/* Chief Complaint */}
                    <td className="py-2.5 px-3 text-slate-700 max-w-[220px] truncate" title={patient.chiefComplaint}>
                      {patient.chiefComplaint}
                    </td>

                    {/* HR */}
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                      <span className={isHrAbnormal ? 'font-semibold text-red-600' : 'text-slate-700'}>
                        {patient.vitals.heartRate}
                      </span>
                    </td>

                    {/* SpO2 */}
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                      <span className={isSpO2Abnormal ? 'font-semibold text-red-600' : 'text-slate-700'}>
                        {patient.vitals.spO2}%
                      </span>
                    </td>

                    {/* BP */}
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                      <span className={isBpAbnormal ? 'font-semibold text-red-600' : 'text-slate-700'}>
                        {patient.vitals.systolicBP}/{patient.vitals.diastolicBP}
                      </span>
                    </td>

                    {/* RR */}
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700">
                      {patient.vitals.respiratoryRate}
                    </td>

                    {/* Risk Score */}
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden shrink-0 hidden sm:block">
                          <div
                            className={`h-full ${
                              patient.currentRisk.score >= 80
                                ? 'bg-red-600'
                                : patient.currentRisk.score >= 60
                                ? 'bg-orange-500'
                                : patient.currentRisk.score >= 30
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${patient.currentRisk.score}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold tabular-nums text-slate-900 text-sm">
                          {patient.currentRisk.score}
                        </span>
                      </div>
                    </td>

                    {/* Level */}
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${badge.bg} ${badge.text}`}
                      >
                        {badge.label}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded font-mono text-[11px] ${getPriorityStyle(
                          patient.currentRisk.priority
                        )}`}
                      >
                        {patient.currentRisk.priority}
                      </span>
                    </td>

                    {/* Last Updated */}
                    <td className="py-2.5 px-3 text-right text-slate-500 font-mono text-[11px] tabular-nums">
                      {patient.lastUpdated}
                    </td>

                    {/* Action */}
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPatient(patient.id);
                        }}
                        className={`p-1 rounded text-slate-400 group-hover:text-blue-600 hover:bg-slate-100 transition-colors ${
                          isSelected ? 'text-blue-600' : ''
                        }`}
                        title="View Full Patient Triage"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
