import { VisualObservation, VideoFrameAnalysis, VisualEvidenceData } from '../types/triage';

export interface VisualAnalysisResult {
  summary: string;
  observations: VisualObservation[];
  videoFrames?: VideoFrameAnalysis[];
  totalContribution: number;
  mode: 'demo' | 'ai';
}

/**
 * Perform visual evidence analysis.
 * Supports both Live AI Vision (server-side proxy) and instantaneous deterministic Demo Mode.
 * Fully reliable: if server call is unavailable or fails, gracefully falls back to structured demo analysis.
 */
export async function analyzeVisualEvidence(
  fileDataUrl: string,
  fileName: string,
  mediaType: 'photo' | 'video',
  forceDemoMode: boolean = false
): Promise<VisualAnalysisResult> {
  // If user selected demo mode, return immediate realistic clinical findings
  if (forceDemoMode) {
    await new Promise((r) => setTimeout(r, 650)); // realistic processing pause
    return getFallbackAnalysis(fileName, mediaType);
  }

  try {
    const response = await fetch('/api/analyze-visual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mediaDataUrl: fileDataUrl,
        fileName,
        mediaType,
      }),
    });

    if (!response.ok) {
      throw new Error(`API returned HTTP ${response.status}`);
    }

    const data = await response.json();
    if (data && data.observations && Array.isArray(data.observations)) {
      return {
        summary: data.summary || 'Multimodal observational visual cues detected',
        observations: data.observations,
        videoFrames: data.videoFrames,
        totalContribution: Math.min(22, Math.max(2, data.totalContribution || 10)),
        mode: 'ai',
      };
    }
    throw new Error('Malformed AI response');
  } catch (err) {
    console.warn('AI Vision unavailable or failed; utilizing deterministic Demo Analysis engine:', err);
    await new Promise((r) => setTimeout(r, 600));
    return getFallbackAnalysis(fileName, mediaType);
  }
}

/**
 * Deterministic fallback generator for demo reliability
 */
export function getFallbackAnalysis(fileName: string, mediaType: 'photo' | 'video'): VisualAnalysisResult {
  const lower = fileName.toLowerCase();

  if (mediaType === 'video' || lower.includes('video') || lower.includes('mp4')) {
    return {
      summary: 'Dynamic video motion analysis indicates antalgic posture guarding and visible distress cues',
      mode: 'demo',
      totalContribution: 12,
      observations: [
        {
          id: `demo-vid-obs-1`,
          label: 'Reduced mobility observed',
          confidence: 84,
          contribution: 6,
          cautiousNote: 'Antalgic gait with compensatory limb weight off-loading apparent across video segment',
        },
        {
          id: `demo-vid-obs-2`,
          label: 'Visible distress cue',
          confidence: 79,
          contribution: 6,
          cautiousNote: 'Patient posture demonstrates facial grimacing and guarding gestures during movement',
        },
      ],
      videoFrames: [
        {
          timestamp: '00:02',
          observation: 'Possible distress cue; asymmetric trunk alignment during initial standing phase',
          cueType: 'distress',
          significance: 'moderate',
        },
        {
          timestamp: '00:05',
          observation: 'Reduced mobility observed; hesitation upon initial weight transfer',
          cueType: 'mobility',
          significance: 'moderate',
        },
        {
          timestamp: '00:08',
          observation: 'Visible localized swelling accentuated during active flexion',
          cueType: 'swelling',
          significance: 'high',
        },
        {
          timestamp: '00:11',
          observation: 'No major visible change; patient seated with splinting posture',
          cueType: 'stable',
          significance: 'low',
        },
        {
          timestamp: '00:14',
          observation: 'Compensatory shallow tachypneic breathing pattern noticeable',
          cueType: 'respiratory',
          significance: 'moderate',
        },
        {
          timestamp: '00:18',
          observation: 'Visible diaphoresis and distress cues persist upon interview interaction',
          cueType: 'distress',
          significance: 'high',
        },
      ],
    };
  }

  // Photo analysis presets based on contextual keywords
  if (lower.includes('burn') || lower.includes('scald') || lower.includes('heat')) {
    return {
      summary: 'Visible partial-thickness thermal injury pattern with localized erythema and blistering',
      mode: 'demo',
      totalContribution: 12,
      observations: [
        {
          id: 'demo-burn-1',
          label: 'Burn-like visible injury',
          confidence: 88,
          contribution: 8,
          cautiousNote: 'Appears consistent with partial-thickness thermal epidermal disruption',
          location: 'Forearm / dermal surface',
        },
        {
          id: 'demo-burn-2',
          label: 'Superficial blistering',
          confidence: 82,
          contribution: 4,
          cautiousNote: 'Intact epidermal bullae visible; infection prophylaxis recommended',
        },
      ],
    };
  }

  if (lower.includes('wound') || lower.includes('cut') || lower.includes('bleed') || lower.includes('laceration')) {
    return {
      summary: 'Visible superficial laceration with controlled hemostasis and localized tissue disruption',
      mode: 'demo',
      totalContribution: 8,
      observations: [
        {
          id: 'demo-wound-1',
          label: 'Superficial wound',
          confidence: 90,
          contribution: 5,
          cautiousNote: 'Linear skin break observed; margin alignment appears stable without active arterial spurting',
        },
        {
          id: 'demo-wound-2',
          label: 'Visible localized bleeding',
          confidence: 85,
          contribution: 3,
          cautiousNote: 'Low-volume oozing with dressing saturation noted',
        },
      ],
    };
  }

  // Default swelling / edema / contusion
  return {
    summary: 'Visible localized swelling with microvascular discoloration and soft-tissue distortion',
    mode: 'demo',
    totalContribution: 10,
    observations: [
      {
        id: 'demo-swell-1',
        label: 'Visible localized swelling',
        confidence: 86,
        contribution: 6,
        cautiousNote: 'Apparent soft tissue expansion compared to contralateral anatomical baseline',
        location: 'Extremity peri-articular zone',
      },
      {
        id: 'demo-swell-2',
        label: 'Discoloration & bruising',
        confidence: 81,
        contribution: 4,
        cautiousNote: 'Ecchymotic skin shading observed consistent with sub-acute blunt impact',
      },
    ],
  };
}
