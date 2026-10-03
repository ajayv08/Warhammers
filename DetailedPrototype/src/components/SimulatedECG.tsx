import React, { useEffect, useRef } from 'react';
import { ECGState } from '../types/triage';

interface SimulatedECGProps {
  ecgState: ECGState;
  heartRate: number;
}

export const SimulatedECG: React.FC<SimulatedECGProps> = ({ ecgState, heartRate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let x = 0;
    const width = canvas.width;
    const height = canvas.height;
    const midY = height / 2;

    // Set background once
    ctx.fillStyle = '#0f172a'; // dark medical monitor slate
    ctx.fillRect(0, 0, width, height);

    // Draw subtle grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let gx = 0; gx < width; gx += 20) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, height);
      ctx.stroke();
    }
    for (let gy = 0; gy < height; gy += 20) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(width, gy);
      ctx.stroke();
    }

    // Waveform generator parameters
    // Higher HR = shorter beat cycle
    const cycleLength = Math.max(30, Math.round((60 / Math.max(40, heartRate)) * 120));
    let cyclePhase = 0;

    let prevX = 0;
    let prevY = midY;

    const render = () => {
      // Clear a small vertical slice ahead of the cursor to simulate sweeping phosphorescent beam
      const clearWidth = 12;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x, 0, clearWidth, height);

      // Re-draw subtle grid on the cleared strip
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const startGridX = Math.floor(x / 20) * 20;
      for (let gx = startGridX; gx <= x + clearWidth; gx += 20) {
        if (gx >= 0 && gx < width) {
          ctx.beginPath();
          ctx.moveTo(gx, 0);
          ctx.lineTo(gx, height);
          ctx.stroke();
        }
      }
      for (let gy = 0; gy < height; gy += 20) {
        ctx.beginPath();
        ctx.moveTo(x, gy);
        ctx.lineTo(x + clearWidth, gy);
        ctx.stroke();
      }

      // Compute Y for current phase
      cyclePhase = (cyclePhase + 1) % cycleLength;
      const progress = cyclePhase / cycleLength;

      let yOffset = 0;
      // Normal P-Q-R-S-T synthesis
      if (progress > 0.1 && progress <= 0.18) {
        // P-wave (atrial depolarization)
        yOffset = -8 * Math.sin(((progress - 0.1) / 0.08) * Math.PI);
      } else if (progress > 0.22 && progress <= 0.25) {
        // Q-wave
        yOffset = 5 * Math.sin(((progress - 0.22) / 0.03) * Math.PI);
      } else if (progress > 0.25 && progress <= 0.32) {
        // R-peak (ventricular depolarization)
        yOffset = -38 * Math.sin(((progress - 0.25) / 0.07) * Math.PI);
      } else if (progress > 0.32 && progress <= 0.36) {
        // S-wave
        yOffset = 12 * Math.sin(((progress - 0.32) / 0.04) * Math.PI);
      } else if (progress > 0.45 && progress <= 0.6) {
        // T-wave (ventricular repolarization)
        yOffset = -12 * Math.sin(((progress - 0.45) / 0.15) * Math.PI);
      }

      // If irregular or tachycardia, add subtle fluctuation or ectopic premature beats
      if (ecgState === 'IRREGULAR') {
        const jitter = (Math.random() - 0.5) * 6;
        if (Math.random() < 0.04) {
          yOffset = (Math.random() - 0.5) * 35; // ectopic deflection
        } else {
          yOffset += jitter;
        }
      } else if (ecgState === 'TACHYCARDIA') {
        // Narrower complexes, slight baseline wander
        yOffset *= 0.95;
      }

      const currentY = midY + yOffset;

      // Draw active waveform segment
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(x, currentY);

      // Color depends on rhythm state
      if (ecgState === 'IRREGULAR') {
        ctx.strokeStyle = '#ef4444'; // Red for irregular
      } else if (ecgState === 'TACHYCARDIA') {
        ctx.strokeStyle = '#f59e0b'; // Amber for tachycardia
      } else {
        ctx.strokeStyle = '#10b981'; // Green for normal
      }
      ctx.lineWidth = 2;
      ctx.shadowBlur = 4;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.stroke();
      ctx.shadowBlur = 0; // reset shadow

      prevX = x;
      prevY = currentY;

      x += 2;
      if (x >= width) {
        x = 0;
        prevX = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [ecgState, heartRate]);

  return (
    <div className="bg-slate-900 rounded-lg p-3 text-white border border-slate-800">
      <div className="flex items-center justify-between text-xs mb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono font-semibold tracking-wider text-emerald-400">
            SIMULATED ECG · LEAD II
          </span>
          <span className="text-[11px] text-slate-400">· DEMO DATA</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Rhythm:</span>
          <span
            className={`font-semibold font-mono text-xs uppercase px-1.5 py-0.2 rounded ${
              ecgState === 'IRREGULAR'
                ? 'bg-red-950 text-red-400 border border-red-800'
                : ecgState === 'TACHYCARDIA'
                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
            }`}
          >
            {ecgState === 'IRREGULAR'
              ? 'Ventricular Ectopy / Irregular'
              : ecgState === 'TACHYCARDIA'
              ? 'Sinus Tachycardia'
              : 'Normal Sinus Rhythm'}
          </span>
          <span className="font-mono tabular-nums text-slate-300 font-bold ml-1">
            {heartRate} bpm
          </span>
        </div>
      </div>

      <div className="relative rounded overflow-hidden bg-slate-950 border border-slate-800 h-[100px] w-full">
        <canvas
          ref={canvasRef}
          width={640}
          height={100}
          className="w-full h-full block"
        />
      </div>

      <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
        <span>Sweep Speed: 25 mm/s · Amplitude: 10 mm/mV</span>
        <span className="italic text-slate-400">Do not claim ECG diagnosis · Fictional simulation</span>
      </div>
    </div>
  );
};
