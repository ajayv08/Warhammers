import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Vitals } from '../types/triage';

interface VitalsUpdateModalProps {
  initialVitals: Vitals;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedVitals: Vitals) => void;
}

export const VitalsUpdateModal: React.FC<VitalsUpdateModalProps> = ({
  initialVitals,
  isOpen,
  onClose,
  onSave,
}) => {
  const [vitals, setVitals] = useState<Vitals>({ ...initialVitals });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(vitals);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full overflow-hidden animate-fadeIn">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Update Physiological Vitals</h3>
            <p className="text-xs text-slate-500">Recalculates deterministic triage risk score instantly</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Heart Rate (bpm)
              </label>
              <input
                type="number"
                min="30"
                max="220"
                value={vitals.heartRate}
                onChange={(e) =>
                  setVitals({ ...vitals, heartRate: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
              <span className="text-[10px] text-slate-500">Normal: 60–100</span>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Oxygen Saturation SpO2 (%)
              </label>
              <input
                type="number"
                min="50"
                max="100"
                value={vitals.spO2}
                onChange={(e) =>
                  setVitals({ ...vitals, spO2: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
              <span className="text-[10px] text-slate-500">Target: 95–100%</span>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Systolic BP (mmHg)
              </label>
              <input
                type="number"
                min="40"
                max="260"
                value={vitals.systolicBP}
                onChange={(e) =>
                  setVitals({ ...vitals, systolicBP: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
              <span className="text-[10px] text-slate-500">Normal: 100–130</span>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Diastolic BP (mmHg)
              </label>
              <input
                type="number"
                min="30"
                max="160"
                value={vitals.diastolicBP}
                onChange={(e) =>
                  setVitals({ ...vitals, diastolicBP: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
              <span className="text-[10px] text-slate-500">Normal: 60–85</span>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Resp. Rate (breaths/min)
              </label>
              <input
                type="number"
                min="6"
                max="60"
                value={vitals.respiratoryRate}
                onChange={(e) =>
                  setVitals({ ...vitals, respiratoryRate: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
              <span className="text-[10px] text-slate-500">Normal: 12–20</span>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Core Temp (°C)
              </label>
              <input
                type="number"
                step="0.1"
                min="32"
                max="43"
                value={vitals.temperature}
                onChange={(e) =>
                  setVitals({ ...vitals, temperature: parseFloat(e.target.value) || 37.0 })
                }
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
              <span className="text-[10px] text-slate-500">Normal: 36.5–37.5</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Vitals</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
