import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { INITIAL_PATIENTS } from './data/mockPatients';
import { Patient, Vitals, VisualEvidenceData, EarlyWarningAlert, TriageLevel } from './types/triage';
import { calculateRisk, DETERIORATION_STEPS } from './services/riskEngine';
import { Header } from './components/Header';
import { KPICards } from './components/KPICards';
import { EarlyWarningBanner } from './components/EarlyWarningBanner';
import { PriorityQueue } from './components/PriorityQueue';
import { PatientDetail } from './components/PatientDetail';
import { AutomatedDemoModal } from './components/AutomatedDemoModal';
import { VISUAL_PRESETS, getPresetEvidence } from './data/visualPresets';
import { Activity, ShieldAlert, ArrowLeft } from 'lucide-react';

export default function App() {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('P-004'); // default to hero patient David Chen
  const [activeFilter, setActiveFilter] = useState<TriageLevel | 'ALL' | 'URGENT'>('ALL');
  const [alerts, setAlerts] = useState<EarlyWarningAlert[]>([
    {
      id: 'alert-initial-p4',
      patientId: 'P-004',
      patientName: 'David Chen',
      timestamp: '10:11 AM',
      previousScore: 42,
      newScore: 71,
      level: 'HIGH',
      vitalsDeltas: {
        hrDelta: '98 → 121 bpm',
        spO2Delta: '95 → 91%',
        bpDelta: '112 → 98 mmHg',
      },
      contributingFactors: ['Low oxygen saturation', 'Elevated heart rate', 'Low systolic blood pressure'],
      visualCue: 'Visible swelling & pre-tibial discoloration',
      recommendation: 'Urgent clinical review recommended',
      acknowledged: false,
    },
  ]);

  // Demo Presentation Runner State
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoStep, setDemoStep] = useState(2); // starts at step 2 to match P-004 initial state
  const [demoSecondsLeft, setDemoSecondsLeft] = useState(35);
  const DEMO_TOTAL_SECONDS = 35;

  const demoTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Selected patient memo
  const selectedPatient = useMemo(() => {
    return patients.find((p) => p.id === selectedPatientId) || patients[0];
  }, [patients, selectedPatientId]);

  // KPI calculations
  const kpis = useMemo(() => {
    let critical = 0;
    let high = 0;
    let moderate = 0;
    let low = 0;
    let urgentReview = 0;

    patients.forEach((p) => {
      if (p.currentRisk.level === 'CRITICAL') critical++;
      else if (p.currentRisk.level === 'HIGH') high++;
      else if (p.currentRisk.level === 'MODERATE') moderate++;
      else low++;

      if (p.currentRisk.score >= 60 || p.deteriorationStep >= 2) {
        urgentReview++;
      }
    });

    return {
      total: patients.length,
      critical,
      high,
      moderate,
      low,
      urgentReview,
    };
  }, [patients]);

  // Helper to re-evaluate and create alert if risk jumps
  const triggerEarlyWarningCheck = useCallback(
    (
      patient: Patient,
      oldScore: number,
      newRisk: ReturnType<typeof calculateRisk>,
      oldVitals: Vitals,
      newVitals: Vitals,
      visualNote?: string
    ) => {
      const scoreDelta = newRisk.score - oldScore;

      // Create early warning alert if risk increases significantly or enters HIGH / CRITICAL
      if (scoreDelta >= 12 || (oldScore < 60 && newRisk.score >= 60) || newRisk.score >= 80) {
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const hrArrow = newVitals.heartRate > oldVitals.heartRate ? '↑' : '↓';
        const spO2Arrow = newVitals.spO2 < oldVitals.spO2 ? '↓' : '↑';
        const bpArrow = newVitals.systolicBP < oldVitals.systolicBP ? '↓' : '↑';

        const newAlert: EarlyWarningAlert = {
          id: `alert-${Date.now()}-${patient.id}`,
          patientId: patient.id,
          patientName: patient.name,
          timestamp: timeNow,
          previousScore: oldScore,
          newScore: newRisk.score,
          level: newRisk.level,
          vitalsDeltas: {
            hrDelta: `${oldVitals.heartRate} → ${newVitals.heartRate} bpm ${hrArrow}`,
            spO2Delta: `${oldVitals.spO2} → ${newVitals.spO2}% ${spO2Arrow}`,
            bpDelta: `${oldVitals.systolicBP} → ${newVitals.systolicBP} mmHg ${bpArrow}`,
          },
          contributingFactors: newRisk.reasons.slice(0, 3),
          visualCue: visualNote || patient.visualEvidence.summary || undefined,
          recommendation:
            newRisk.score >= 80
              ? 'Immediate emergency resuscitation callout recommended'
              : 'Urgent clinical review recommended',
          acknowledged: false,
        };

        setAlerts((prev) => [newAlert, ...prev.filter((a) => a.patientId !== patient.id)]);
      }
    },
    []
  );

  // Update physiological vitals
  const handleUpdateVitals = useCallback(
    (patientId: string, newVitals: Vitals) => {
      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setPatients((prev) =>
        prev.map((p) => {
          if (p.id !== patientId) return p;

          const oldScore = p.currentRisk.score;
          const oldVitals = { ...p.vitals };
          const updatedRisk = calculateRisk(newVitals, p.symptoms, p.history, p.visualEvidence);

          triggerEarlyWarningCheck(p, oldScore, updatedRisk, oldVitals, newVitals);

          return {
            ...p,
            vitals: newVitals,
            currentRisk: updatedRisk,
            riskHistory: [
              ...p.riskHistory,
              {
                time: timeNow,
                score: updatedRisk.score,
                heartRate: newVitals.heartRate,
                spO2: newVitals.spO2,
                systolicBP: newVitals.systolicBP,
                note: `Vitals updated (${updatedRisk.level})`,
              },
            ],
            lastUpdated: timeNow,
          };
        })
      );
    },
    [triggerEarlyWarningCheck]
  );

  // Step through progression: LOW (step 0) -> MODERATE (step 1) -> HIGH (step 2) -> CRITICAL (step 3)
  const handleSimulateDeterioration = useCallback(
    (patientId: string, targetStep?: number) => {
      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setPatients((prev) =>
        prev.map((p) => {
          if (p.id !== patientId) return p;

          const nextStep =
            targetStep !== undefined ? targetStep : ((p.deteriorationStep + 1) % 4);
          const progression = DETERIORATION_STEPS[nextStep];

          const oldScore = p.currentRisk.score;
          const oldVitals = { ...p.vitals };
          const newVitals = { ...progression.vitals };

          // Combine symptoms
          const newSymptoms = Array.from(new Set([...p.symptoms, ...progression.symptomsDelta]));

          // If step 2 or 3, ensure visual evidence is also present and contributing
          let evidence = p.visualEvidence;
          if (nextStep >= 2 && evidence.totalVisualContribution === 0) {
            evidence = getPresetEvidence('preset-swelling');
          }

          const updatedRisk = calculateRisk(newVitals, newSymptoms, p.history, evidence);

          triggerEarlyWarningCheck(
            p,
            oldScore,
            updatedRisk,
            oldVitals,
            newVitals,
            nextStep >= 2 ? 'Apparent soft tissue edema with erythema' : undefined
          );

          return {
            ...p,
            vitals: newVitals,
            symptoms: newSymptoms,
            ecgState: progression.ecgState,
            visualEvidence: evidence,
            currentRisk: updatedRisk,
            deteriorationStep: nextStep,
            riskHistory: [
              ...p.riskHistory,
              {
                time: timeNow,
                score: updatedRisk.score,
                heartRate: newVitals.heartRate,
                spO2: newVitals.spO2,
                systolicBP: newVitals.systolicBP,
                note: `Deterioration ${progression.label}`,
              },
            ],
            lastUpdated: timeNow,
          };
        })
      );
    },
    [triggerEarlyWarningCheck]
  );

  // Reset patient back to baseline (step 0)
  const handleResetPatient = useCallback((patientId: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;

        const baseline = DETERIORATION_STEPS[0];
        const initialTemplate = INITIAL_PATIENTS.find((ip) => ip.id === patientId);

        const newVitals = initialTemplate ? { ...initialTemplate.vitals } : { ...baseline.vitals };
        const newSymptoms = initialTemplate ? [...initialTemplate.symptoms] : ['Fatigue'];
        const newEvidence = initialTemplate ? { ...initialTemplate.visualEvidence } : p.visualEvidence;

        const updatedRisk = calculateRisk(newVitals, newSymptoms, p.history, newEvidence);

        return {
          ...p,
          vitals: newVitals,
          symptoms: newSymptoms,
          ecgState: baseline.ecgState,
          visualEvidence: newEvidence,
          currentRisk: updatedRisk,
          deteriorationStep: 0,
          riskHistory: [
            ...p.riskHistory,
            {
              time: timeNow,
              score: updatedRisk.score,
              heartRate: newVitals.heartRate,
              spO2: newVitals.spO2,
              systolicBP: newVitals.systolicBP,
              note: 'Reset to baseline observation',
            },
          ],
          lastUpdated: timeNow,
        };
      })
    );

    // Dismiss active alerts for this patient
    setAlerts((prev) => prev.filter((a) => a.patientId !== patientId));
  }, []);

  // Update visual evidence findings
  const handleUpdateVisualEvidence = useCallback(
    (patientId: string, newEvidence: VisualEvidenceData) => {
      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setPatients((prev) =>
        prev.map((p) => {
          if (p.id !== patientId) return p;

          const oldScore = p.currentRisk.score;
          const updatedRisk = calculateRisk(p.vitals, p.symptoms, p.history, newEvidence);

          if (updatedRisk.score > oldScore) {
            triggerEarlyWarningCheck(
              p,
              oldScore,
              updatedRisk,
              p.vitals,
              p.vitals,
              newEvidence.summary
            );
          }

          return {
            ...p,
            visualEvidence: newEvidence,
            currentRisk: updatedRisk,
            riskHistory: [
              ...p.riskHistory,
              {
                time: timeNow,
                score: updatedRisk.score,
                heartRate: p.vitals.heartRate,
                spO2: p.vitals.spO2,
                systolicBP: p.vitals.systolicBP,
                note: `Visual Analysis applied (+${newEvidence.totalVisualContribution} pts)`,
              },
            ],
            lastUpdated: timeNow,
          };
        })
      );
    },
    [triggerEarlyWarningCheck]
  );

  // Automated Demo Presentation Runner
  const handleStartDemo = () => {
    setSelectedPatientId('P-004'); // switch to David Chen
    setIsDemoRunning(true);
    setDemoSecondsLeft(DEMO_TOTAL_SECONDS);
  };

  const handlePauseDemo = () => {
    setIsDemoRunning(false);
  };

  const handleResetDemo = () => {
    setIsDemoRunning(false);
    setDemoSecondsLeft(DEMO_TOTAL_SECONDS);
    setDemoStep(0);
    handleResetPatient('P-004');
  };

  const handleJumpToStep = (step: number) => {
    setDemoStep(step);
    setSelectedPatientId('P-004');
    handleSimulateDeterioration('P-004', step);
  };

  // Demo loop effect
  useEffect(() => {
    if (!isDemoRunning) {
      if (demoTimerRef.current) clearInterval(demoTimerRef.current);
      return;
    }

    demoTimerRef.current = setInterval(() => {
      setDemoSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsDemoRunning(false);
          return 0;
        }

        const elapsed = DEMO_TOTAL_SECONDS - (prev - 1);

        // Schedule stage transitions
        if (elapsed === 1) {
          setDemoStep(0);
          handleSimulateDeterioration('P-004', 0);
        } else if (elapsed === 9) {
          setDemoStep(1);
          handleSimulateDeterioration('P-004', 1);
        } else if (elapsed === 18) {
          setDemoStep(2);
          handleSimulateDeterioration('P-004', 2);
        } else if (elapsed === 27) {
          setDemoStep(3);
          handleSimulateDeterioration('P-004', 3);
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (demoTimerRef.current) clearInterval(demoTimerRef.current);
    };
  }, [isDemoRunning, handleSimulateDeterioration]);

  const handleDismissAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 antialiased">
      {/* Clinical Top Navigation Header */}
      <Header
        urgentAlertCount={alerts.filter((a) => !a.acknowledged).length}
        onOpenDemoRunner={() => setIsDemoModalOpen(true)}
        isDemoRunning={isDemoRunning}
      />

      {/* Main Command Center Viewport */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 space-y-4">
        {/* Contextual Early Warning Banner */}
        <EarlyWarningBanner
          alerts={alerts}
          onSelectPatient={(id) => {
            setSelectedPatientId(id);
            window.scrollTo({ top: 400, behavior: 'smooth' });
          }}
          onDismissAlert={handleDismissAlert}
        />

        {/* Clinical KPI Metric Cards */}
        <KPICards
          total={kpis.total}
          critical={kpis.critical}
          high={kpis.high}
          moderate={kpis.moderate}
          low={kpis.low}
          urgentReview={kpis.urgentReview}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
        />

        {/* Core Layout: Priority Queue + Selected Patient Detail */}
        <div className="space-y-4">
          {/* Priority Triage Queue Data Table */}
          <PriorityQueue
            patients={patients}
            selectedPatientId={selectedPatientId}
            onSelectPatient={setSelectedPatientId}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          {/* Detailed Selected Patient Panel */}
          {selectedPatient && (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-800">
                    Active Clinical Encounter: Patient {selectedPatient.id} ({selectedPatient.name})
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  Priority Queue Position:{' '}
                  <strong className="text-slate-900">
                    #
                    {patients
                      .slice()
                      .sort((a, b) => b.currentRisk.score - a.currentRisk.score)
                      .findIndex((p) => p.id === selectedPatient.id) + 1}
                  </strong>{' '}
                  of {patients.length}
                </span>
              </div>

              <PatientDetail
                patient={selectedPatient}
                onUpdateVitals={handleUpdateVitals}
                onSimulateDeterioration={handleSimulateDeterioration}
                onResetPatient={handleResetPatient}
                onUpdateVisualEvidence={handleUpdateVisualEvidence}
                onBackToQueue={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          )}
        </div>
      </main>

      {/* Automated Hackathon Presentation Controller Modal */}
      <AutomatedDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        isRunning={isDemoRunning}
        currentStep={demoStep}
        timerSeconds={demoSecondsLeft}
        totalDuration={DEMO_TOTAL_SECONDS}
        onStart={handleStartDemo}
        onPause={handlePauseDemo}
        onReset={handleResetDemo}
        onJumpToStep={handleJumpToStep}
      />

      {/* Mandatory Clinical Disclaimer Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500 space-y-1">
        <p className="font-medium text-slate-700">
          Prototype for demonstration and decision-support research only. Not intended for diagnosis or replacement of professional clinical judgment. All patient data and visual evidence are fictional/demo data.
        </p>
        <p className="text-[11px] text-slate-400">
          Emergency Clinical Decision Engine · Deterministic Heuristic Risk System · AI-Assisted Multimodal Verification
        </p>
      </footer>
    </div>
  );
}
