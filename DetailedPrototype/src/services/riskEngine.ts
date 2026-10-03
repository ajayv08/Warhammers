import { Vitals, RiskFactor, RiskBreakdown, TriageLevel, TriagePriority, VisualEvidenceData } from '../types/triage';

/**
 * Deterministic Clinical Risk Calculation Engine
 * Fictional rule-based heuristic model designed for hackathon demonstration.
 * NEVER relies on an external AI API for the final numeric calculation.
 */
export function calculateRisk(
  vitals: Vitals,
  symptoms: string[],
  history: string[],
  visualEvidence?: VisualEvidenceData
): RiskBreakdown {
  const factors: RiskFactor[] = [];
  const reasons: string[] = [];

  let vitalsScore = 0;
  let symptomsScore = 0;
  let historyScore = 0;
  let visualScore = 0;

  // 1. Oxygen Saturation (SpO2)
  if (vitals.spO2 < 88) {
    const pts = 28;
    vitalsScore += pts;
    factors.push({
      label: '+28 critical hypoxemia',
      points: pts,
      category: 'vitals',
      description: `SpO2 ${vitals.spO2}% severely compromised (< 88%)`,
    });
    reasons.push(`Severe hypoxemia (SpO2 ${vitals.spO2}%)`);
  } else if (vitals.spO2 <= 91) {
    const pts = 20;
    vitalsScore += pts;
    factors.push({
      label: '+20 low SpO2',
      points: pts,
      category: 'vitals',
      description: `SpO2 ${vitals.spO2}% significantly below target range (90–91%)`,
    });
    reasons.push(`Low oxygen saturation (SpO2 ${vitals.spO2}%)`);
  } else if (vitals.spO2 <= 94) {
    const pts = 12;
    vitalsScore += pts;
    factors.push({
      label: '+12 moderate hypoxemia',
      points: pts,
      category: 'vitals',
      description: `SpO2 ${vitals.spO2}% mildly below normal (92–94%)`,
    });
    reasons.push(`Mildly depressed oxygen saturation (${vitals.spO2}%)`);
  } else if (vitals.spO2 <= 95) {
    const pts = 5;
    vitalsScore += pts;
    factors.push({
      label: '+5 borderline SpO2',
      points: pts,
      category: 'vitals',
      description: `SpO2 ${vitals.spO2}% on lower threshold of normal`,
    });
  }

  // 2. Heart Rate (HR)
  if (vitals.heartRate >= 130) {
    const pts = 22;
    vitalsScore += pts;
    factors.push({
      label: '+22 marked tachycardia',
      points: pts,
      category: 'vitals',
      description: `Heart rate ${vitals.heartRate} bpm markedly elevated (>= 130)`,
    });
    reasons.push(`Marked tachycardia (${vitals.heartRate} bpm)`);
  } else if (vitals.heartRate >= 115) {
    const pts = 14;
    vitalsScore += pts;
    factors.push({
      label: '+14 elevated HR',
      points: pts,
      category: 'vitals',
      description: `Heart rate ${vitals.heartRate} bpm elevated (115–129)`,
    });
    reasons.push(`Elevated heart rate (${vitals.heartRate} bpm)`);
  } else if (vitals.heartRate >= 101) {
    const pts = 8;
    vitalsScore += pts;
    factors.push({
      label: '+8 mild tachycardia',
      points: pts,
      category: 'vitals',
      description: `Heart rate ${vitals.heartRate} bpm mildly elevated (101–114)`,
    });
    reasons.push(`Mild tachycardia (${vitals.heartRate} bpm)`);
  } else if (vitals.heartRate < 50) {
    const pts = 16;
    vitalsScore += pts;
    factors.push({
      label: '+16 severe bradycardia',
      points: pts,
      category: 'vitals',
      description: `Heart rate ${vitals.heartRate} bpm dangerously low (< 50)`,
    });
    reasons.push(`Marked bradycardia (${vitals.heartRate} bpm)`);
  }

  // 3. Systolic Blood Pressure (BP)
  if (vitals.systolicBP < 90) {
    const pts = 24;
    vitalsScore += pts;
    factors.push({
      label: '+24 severe hypotension',
      points: pts,
      category: 'vitals',
      description: `Systolic BP ${vitals.systolicBP} mmHg severe shock threshold (< 90)`,
    });
    reasons.push(`Severe hypotension (${vitals.systolicBP}/${vitals.diastolicBP} mmHg)`);
  } else if (vitals.systolicBP < 100) {
    const pts = 12;
    vitalsScore += pts;
    factors.push({
      label: '+12 low systolic BP',
      points: pts,
      category: 'vitals',
      description: `Systolic BP ${vitals.systolicBP} mmHg below normal perfusion range (90–99)`,
    });
    reasons.push(`Low systolic blood pressure (${vitals.systolicBP} mmHg)`);
  } else if (vitals.systolicBP >= 180) {
    const pts = 15;
    vitalsScore += pts;
    factors.push({
      label: '+15 severe hypertension',
      points: pts,
      category: 'vitals',
      description: `Systolic BP ${vitals.systolicBP} mmHg hypertensive crisis range (>= 180)`,
    });
    reasons.push(`Hypertensive crisis range (${vitals.systolicBP} mmHg)`);
  }

  // 4. Respiratory Rate (RR)
  if (vitals.respiratoryRate >= 29) {
    const pts = 20;
    vitalsScore += pts;
    factors.push({
      label: '+20 severe tachypnea',
      points: pts,
      category: 'vitals',
      description: `Respiratory rate ${vitals.respiratoryRate}/min severely elevated (>= 29)`,
    });
    reasons.push(`Severe tachypnea (${vitals.respiratoryRate} breaths/min)`);
  } else if (vitals.respiratoryRate >= 23) {
    const pts = 10;
    vitalsScore += pts;
    factors.push({
      label: '+10 elevated RR',
      points: pts,
      category: 'vitals',
      description: `Respiratory rate ${vitals.respiratoryRate}/min elevated (23–28)`,
    });
    reasons.push(`Elevated respiratory rate (${vitals.respiratoryRate}/min)`);
  } else if (vitals.respiratoryRate < 10) {
    const pts = 18;
    vitalsScore += pts;
    factors.push({
      label: '+18 bradypnea / hypoventilation',
      points: pts,
      category: 'vitals',
      description: `Respiratory rate ${vitals.respiratoryRate}/min dangerously depressed (< 10)`,
    });
    reasons.push(`Hypoventilation / low respiratory rate (${vitals.respiratoryRate}/min)`);
  }

  // 5. Body Temperature
  if (vitals.temperature >= 39.0) {
    const pts = 8;
    vitalsScore += pts;
    factors.push({
      label: '+8 high fever',
      points: pts,
      category: 'vitals',
      description: `Temperature ${vitals.temperature}°C hyperpyrexia (>= 39.0°C)`,
    });
    reasons.push(`High fever (${vitals.temperature}°C)`);
  } else if (vitals.temperature >= 38.0) {
    const pts = 4;
    vitalsScore += pts;
    factors.push({
      label: '+4 elevated temperature',
      points: pts,
      category: 'vitals',
      description: `Temperature ${vitals.temperature}°C pyrexia (38.0–38.9°C)`,
    });
  } else if (vitals.temperature < 35.5) {
    const pts = 10;
    vitalsScore += pts;
    factors.push({
      label: '+10 hypothermia',
      points: pts,
      category: 'vitals',
      description: `Temperature ${vitals.temperature}°C core hypothermia (< 35.5°C)`,
    });
    reasons.push(`Hypothermia (${vitals.temperature}°C)`);
  }

  // 6. Symptoms analysis
  const severeSymptoms = [
    'crushing chest pain',
    'severe dyspnea',
    'altered mental status',
    'acute neuro deficit',
    'profuse sweating / diaphoresis',
    'hemoptysis',
    'stridor',
    'cyanosis',
  ];
  const moderateSymptoms = [
    'moderate shortness of breath',
    'acute localized pain (8/10+)',
    'persistent vomiting',
    'dizziness / presyncope',
    'significant trauma',
    'palpitations',
    'purulent cough',
    'chills / rigors',
  ];

  const matchedSevere = symptoms.filter((s) =>
    severeSymptoms.some((ss) => s.toLowerCase().includes(ss.toLowerCase()))
  );
  const matchedModerate = symptoms.filter((s) =>
    moderateSymptoms.some((ms) => s.toLowerCase().includes(ms.toLowerCase()))
  );

  if (matchedSevere.length > 0) {
    const pts = Math.min(16, matchedSevere.length * 9);
    symptomsScore += pts;
    factors.push({
      label: `+${pts} critical symptom cue`,
      points: pts,
      category: 'symptoms',
      description: `High-acuity symptoms reported: ${matchedSevere.join(', ')}`,
    });
    reasons.push(`High-acuity symptom cluster: ${matchedSevere.slice(0, 2).join(', ')}`);
  }

  if (matchedModerate.length > 0) {
    const pts = Math.min(10, matchedModerate.length * 5);
    symptomsScore += pts;
    factors.push({
      label: `+${pts} acute symptoms`,
      points: pts,
      category: 'symptoms',
      description: `Moderate-acuity symptoms: ${matchedModerate.join(', ')}`,
    });
    if (matchedSevere.length === 0) {
      reasons.push(`Reported acute symptoms: ${matchedModerate.slice(0, 2).join(', ')}`);
    }
  } else if (matchedSevere.length === 0 && symptoms.length > 0) {
    const pts = Math.min(6, symptoms.length * 2);
    symptomsScore += pts;
    factors.push({
      label: `+${pts} reported symptoms`,
      points: pts,
      category: 'symptoms',
      description: `Symptom burden: ${symptoms.slice(0, 3).join(', ')}`,
    });
  }

  // 7. Medical History Risk Contribution
  const highRiskHistory = [
    'congestive heart failure',
    'coronary artery disease',
    'copd',
    'chronic kidney disease',
    'active immunosuppression',
    'prior myocardial infarction',
    'anticoagulation therapy',
  ];
  const matchedHistory = history.filter((h) =>
    highRiskHistory.some((hr) => h.toLowerCase().includes(hr.toLowerCase()))
  );

  if (matchedHistory.length > 0) {
    const pts = Math.min(10, matchedHistory.length * 5);
    historyScore += pts;
    factors.push({
      label: `+${pts} chronic morbidity factor`,
      points: pts,
      category: 'history',
      description: `Comorbidity risk history: ${matchedHistory.join(', ')}`,
    });
    reasons.push(`Predisposing clinical history: ${matchedHistory[0]}`);
  } else if (history.length > 0) {
    const pts = 3;
    historyScore += pts;
    factors.push({
      label: '+3 baseline medical history',
      points: pts,
      category: 'history',
      description: `Documented medical history: ${history.slice(0, 2).join(', ')}`,
    });
  }

  // 8. Visual Evidence Contribution (from photo or video analysis)
  if (visualEvidence && visualEvidence.totalVisualContribution > 0) {
    visualScore = Math.min(22, visualEvidence.totalVisualContribution);
    factors.push({
      label: `+${visualScore} visual evidence findings`,
      points: visualScore,
      category: 'visual',
      description: visualEvidence.summary || 'Visible physical cues identified via visual analysis',
    });
    reasons.push(
      `Visual evidence requiring review: ${visualEvidence.summary || 'observable trauma/distress cues'}`
    );
  }

  // Total raw score calculation clamped between 0 and 100
  const rawScore = vitalsScore + symptomsScore + historyScore + visualScore;
  const score = Math.min(100, Math.max(0, Math.round(rawScore)));

  // Risk Level according to specifications:
  // 0–29 = LOW
  // 30–59 = MODERATE
  // 60–79 = HIGH
  // 80–100 = CRITICAL
  let level: TriageLevel = 'LOW';
  let priority: TriagePriority = 'P4';

  if (score >= 80) {
    level = 'CRITICAL';
    priority = 'P1'; // Resuscitation / Immediate
  } else if (score >= 60) {
    level = 'HIGH';
    priority = 'P2'; // Emergent
  } else if (score >= 30) {
    level = 'MODERATE';
    priority = 'P3'; // Urgent
  } else {
    level = 'LOW';
    priority = 'P4'; // Non-Urgent
  }

  let warning: string | undefined;
  if (score >= 80) {
    warning = 'CRITICAL ALERT: Immediate emergency resuscitation / physician intervention required.';
  } else if (score >= 60) {
    warning = 'HIGH RISK WARNING: Urgent clinical review recommended within 10–15 minutes.';
  } else if (score >= 30) {
    warning = 'MODERATE RISK: Prioritize triage evaluation and monitor vital sign trends.';
  }

  return {
    score,
    level,
    priority,
    vitalsContribution: vitalsScore,
    symptomsContribution: symptomsScore,
    historyContribution: historyScore,
    visualContribution: visualScore,
    factors,
    reasons,
    warning,
  };
}

/**
 * Standard progression steps for deterministic deterioration simulation:
 * Step 0: Baseline LOW
 * Step 1: MODERATE
 * Step 2: HIGH
 * Step 3: CRITICAL
 */
export const DETERIORATION_STEPS: Record<
  number,
  {
    label: string;
    vitals: Vitals;
    symptomsDelta: string[];
    ecgState: 'NORMAL' | 'TACHYCARDIA' | 'IRREGULAR';
  }
> = {
  0: {
    label: 'Baseline (Low Risk)',
    vitals: {
      heartRate: 82,
      spO2: 98,
      systolicBP: 120,
      diastolicBP: 78,
      respiratoryRate: 16,
      temperature: 37.1,
    },
    symptomsDelta: ['Mild malaise', 'Fatigue'],
    ecgState: 'NORMAL',
  },
  1: {
    label: 'Progression 1 (Moderate Risk)',
    vitals: {
      heartRate: 105,
      spO2: 94,
      systolicBP: 108,
      diastolicBP: 70,
      respiratoryRate: 22,
      temperature: 38.2,
    },
    symptomsDelta: ['Chills / rigors', 'Moderate shortness of breath', 'Mild diaphoresis'],
    ecgState: 'TACHYCARDIA',
  },
  2: {
    label: 'Progression 2 (High Risk)',
    vitals: {
      heartRate: 120,
      spO2: 91,
      systolicBP: 98,
      diastolicBP: 62,
      respiratoryRate: 26,
      temperature: 38.8,
    },
    symptomsDelta: ['Profuse sweating / diaphoresis', 'Severe dyspnea', 'Dizziness / presyncope'],
    ecgState: 'TACHYCARDIA',
  },
  3: {
    label: 'Progression 3 (Critical Risk)',
    vitals: {
      heartRate: 135,
      spO2: 86,
      systolicBP: 88,
      diastolicBP: 52,
      respiratoryRate: 32,
      temperature: 39.4,
    },
    symptomsDelta: [
      'Altered mental status',
      'Severe dyspnea',
      'Cyanosis',
      'Profuse sweating / diaphoresis',
    ],
    ecgState: 'IRREGULAR',
  },
};
