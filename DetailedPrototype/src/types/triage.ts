export type TriageLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type TriagePriority = 'P1' | 'P2' | 'P3' | 'P4';
export type ECGState = 'NORMAL' | 'TACHYCARDIA' | 'IRREGULAR';

export interface Vitals {
  heartRate: number; // bpm (normal 60-100)
  spO2: number; // % (normal 95-100)
  systolicBP: number; // mmHg (normal 100-130)
  diastolicBP: number; // mmHg (normal 60-85)
  respiratoryRate: number; // breaths/min (normal 12-20)
  temperature: number; // Celsius (normal 36.5 - 37.5)
}

export interface RiskFactor {
  label: string;
  points: number;
  category: 'vitals' | 'symptoms' | 'history' | 'visual';
  description: string;
}

export interface RiskBreakdown {
  score: number; // 0 - 100
  level: TriageLevel;
  priority: TriagePriority;
  vitalsContribution: number;
  symptomsContribution: number;
  historyContribution: number;
  visualContribution: number;
  factors: RiskFactor[];
  reasons: string[];
  warning?: string;
}

export interface VisualObservation {
  id: string;
  label: string;
  confidence: number; // 0 - 100
  contribution: number; // points added to risk
  cautiousNote: string;
  location?: string;
}

export interface VideoFrameAnalysis {
  timestamp: string; // e.g., '00:02'
  observation: string;
  cueType: 'distress' | 'mobility' | 'swelling' | 'respiratory' | 'stable';
  significance: 'low' | 'moderate' | 'high';
}

export interface VisualEvidenceData {
  type: 'photo' | 'video' | null;
  mediaUrl: string | null;
  mediaName: string | null;
  analyzedAt: string | null;
  mode: 'demo' | 'ai';
  summary: string;
  observations: VisualObservation[];
  videoFrames?: VideoFrameAnalysis[];
  totalVisualContribution: number;
  isAnalyzing?: boolean;
}

export interface RiskHistoryPoint {
  time: string;
  score: number;
  heartRate: number;
  spO2: number;
  systolicBP: number;
  note?: string;
}

export interface Patient {
  id: string; // e.g., 'P-001'
  name: string;
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  arrivalTime: string;
  chiefComplaint: string;
  symptoms: string[];
  history: string[];
  vitals: Vitals;
  ecgState: ECGState;
  visualEvidence: VisualEvidenceData;
  riskHistory: RiskHistoryPoint[];
  currentRisk: RiskBreakdown;
  lastUpdated: string;
  status: 'Waiting' | 'In Triage' | 'Under Review' | 'Transferred to Resus';
  deteriorationStep: number; // 0: baseline, 1: moderate, 2: high, 3: critical
}

export interface EarlyWarningAlert {
  id: string;
  patientId: string;
  patientName: string;
  timestamp: string;
  previousScore: number;
  newScore: number;
  level: TriageLevel;
  vitalsDeltas: {
    hrDelta: string;
    spO2Delta: string;
    bpDelta: string;
  };
  contributingFactors: string[];
  visualCue?: string;
  recommendation: string;
  acknowledged: boolean;
}
