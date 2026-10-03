import React, { useState } from 'react';
import {
  User,
  Clock,
  FileText,
  AlertCircle,
  Play,
  RotateCcw,
  Edit3,
  TrendingUp,
  Activity,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { Patient, Vitals, VisualEvidenceData } from '../types/triage';
import { VitalsGrid } from './VitalsGrid';
import { SimulatedECG } from './SimulatedECG';
import { MultimodalRiskPanel } from './MultimodalRiskPanel';
import { RiskHistoryChart } from './RiskHistoryChart';
import { VisualEvidence } from './VisualEvidence';
import { VitalsUpdateModal } from './VitalsUpdateModal';

interface PatientDetailProps {
  patient: Patient;
  onUpdateVitals: (patientId: string, newVitals: Vitals) => void;
  onSimulateDeterioration: (patientId: string) => void;
  onResetPatient: (patientId: string) => void;
  onUpdateVisualEvidence: (patientId: string, evidence: VisualEvidenceData) => void;
  onBackToQueue: () => void;
}

export const PatientDetail: React.FC<PatientDetailProps> = ({
  patient,
  onUpdateVitals,
  onSimulateDeterioration,
  onResetPatient,
  onUpdateVisualEvidence,
  onBackToQueue,
}) => {
  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Patient Header Card */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Identity & Demographics */}
          <div className="flex items-start gap-3">
            <button
              onClick={onBackToQueue}
              className="lg:hidden p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 mr-1"
              title="Back to queue"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 font-bold font-mono text-sm border border-slate-200">
              {patient.id.replace('P-', '')}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {patient.id}
                </span>
                <h2 className="text-lg font-bold text-slate-900">{patient.name}</h2>
                <span className="text-xs text-slate-500 font-mono">
                  {patient.age} years old · {patient.sex}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Arrived: {patient.arrivalTime}
                </span>
              </div>

              {/* Chief Complaint */}
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">Chief Complaint:</span>
                <span className="text-xs font-medium text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  {patient.chiefComplaint}
                </span>
              </div>
            </div>
          </div>

          {/* Action Toolbar: Continuous Monitoring Controls */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
            <button
              onClick={() => setIsVitalsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors cursor-pointer shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Update Vitals</span>
            </button>

            <button
              onClick={() => onSimulateDeterioration(patient.id)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors cursor-pointer shadow-xs"
              title="Step through Low -> Moderate -> High -> Critical deterioration"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Simulate Deterioration</span>
            </button>

            <button
              onClick={() => onResetPatient(patient.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Patient</span>
            </button>
          </div>
        </div>

        {/* Symptoms and History Badges */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Active Reported Symptoms
            </span>
            <div className="flex flex-wrap gap-1.5">
              {patient.symptoms.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-xs border border-slate-200"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Medical History & Comorbidities
            </span>
            <div className="flex flex-wrap gap-1.5">
              {patient.history.length === 0 ? (
                <span className="text-slate-400 italic">None documented</span>
              ) : (
                patient.history.map((h, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-xs border border-amber-200"
                  >
                    {h}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Physiological Vitals Grid & Simulated ECG */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <VitalsGrid
            vitals={patient.vitals}
            onOpenEditModal={() => setIsVitalsModalOpen(true)}
          />
        </div>
        <div className="xl:col-span-1">
          <SimulatedECG
            ecgState={patient.ecgState}
            heartRate={patient.vitals.heartRate}
          />
        </div>
      </div>

      {/* Row 2: Multimodal Risk Panel & Risk History Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MultimodalRiskPanel risk={patient.currentRisk} />
        <RiskHistoryChart history={patient.riskHistory} />
      </div>

      {/* Row 3: Computer Vision & Visual Evidence Feature */}
      <VisualEvidence
        evidence={patient.visualEvidence}
        onUpdateEvidence={(newEvidence) =>
          onUpdateVisualEvidence(patient.id, newEvidence)
        }
      />

      {/* Modal for manual vitals entry */}
      <VitalsUpdateModal
        initialVitals={patient.vitals}
        isOpen={isVitalsModalOpen}
        onClose={() => setIsVitalsModalOpen(false)}
        onSave={(v) => onUpdateVitals(patient.id, v)}
      />
    </div>
  );
};
