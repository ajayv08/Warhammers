import { VisualObservation, VideoFrameAnalysis, VisualEvidenceData } from '../types/triage';

export interface VisualPreset {
  id: string;
  name: string;
  type: 'photo' | 'video';
  description: string;
  thumbnail: string;
  observations: VisualObservation[];
  videoFrames?: VideoFrameAnalysis[];
  totalContribution: number;
  summary: string;
}

export const VISUAL_PRESETS: VisualPreset[] = [
  {
    id: 'preset-swelling',
    name: 'Localized Edema & Soft Tissue Contusion',
    type: 'photo',
    description: 'Patient right lower extremity with apparent localized swelling, erythema, and visible discoloration.',
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200" fill="%23f1f5f9"><rect width="320" height="200" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="2"/><ellipse cx="160" cy="110" rx="90" ry="45" fill="%23fee2e2" stroke="%23ef4444" stroke-width="2" stroke-dasharray="4,4"/><circle cx="150" cy="105" r="28" fill="%23fecaca" opacity="0.8"/><text x="160" y="35" font-family="sans-serif" font-size="12" font-weight="600" fill="%230f172a" text-anchor="middle">CLINICAL PHOTO: RIGHT ANKLE EDEMA</text><text x="160" y="175" font-family="sans-serif" font-size="11" fill="%2364748b" text-anchor="middle">Visible localized swelling with microvascular discoloration</text></svg>',
    totalContribution: 10,
    summary: 'Visible localized soft tissue swelling and discoloration requiring physical verification',
    observations: [
      {
        id: 'obs-1',
        label: 'Visible localized swelling',
        confidence: 78,
        contribution: 6,
        cautiousNote: 'Appearance consistent with localized inflammatory edema; verify compartment softness clinically',
        location: 'Right lateral malleolus',
      },
      {
        id: 'obs-2',
        label: 'Discoloration & micro-bruising',
        confidence: 84,
        contribution: 4,
        cautiousNote: 'Erythematous surface changes observed without obvious active hemorrhage',
        location: 'Peri-articular region',
      },
    ],
  },
  {
    id: 'preset-burn',
    name: 'Thermal Burn / Erythematous Skin Disruption',
    type: 'photo',
    description: 'Visible partial thickness thermal disruption with superficial blistering on distal forearm.',
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200" fill="%23fff1f2"><rect width="320" height="200" fill="%23fff5f5" stroke="%23fca5a5" stroke-width="2"/><ellipse cx="160" cy="100" rx="80" ry="40" fill="%23fed7aa" stroke="%23f97316" stroke-width="2"/><circle cx="140" cy="95" r="18" fill="%23fecdd3" stroke="%23e11d48"/><circle cx="180" cy="105" r="22" fill="%23fecdd3" stroke="%23e11d48"/><text x="160" y="35" font-family="sans-serif" font-size="12" font-weight="600" fill="%23991b1b" text-anchor="middle">CLINICAL PHOTO: SUPERFICIAL DERMAL INJURY</text><text x="160" y="175" font-family="sans-serif" font-size="11" fill="%237f1d1d" text-anchor="middle">Apparent epidermal peeling and localized hyperemic border</text></svg>',
    totalContribution: 12,
    summary: 'Visible partial thickness burn-like pattern with superficial blistering',
    observations: [
      {
        id: 'obs-burn-1',
        label: 'Burn-like visible injury pattern',
        confidence: 89,
        contribution: 8,
        cautiousNote: 'Pattern appears consistent with superficial partial-thickness dermal trauma',
        location: 'Anterior left forearm',
      },
      {
        id: 'obs-burn-2',
        label: 'Superficial blistering / epidermal loss',
        confidence: 82,
        contribution: 4,
        cautiousNote: 'Possible secondary infection risk; requires sterile dressing protocol evaluation',
        location: 'Volar aspect',
      },
    ],
  },
  {
    id: 'preset-video-distress',
    name: 'Video Cue: Mobility Limitation & Respiratory Distress',
    type: 'video',
    description: '6-frame triage gait and posture evaluation clip showing guarding posture, reduced range of motion, and visible compensatory respiratory cues.',
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200" fill="%23eff6ff"><rect width="320" height="200" fill="%23f0f9ff" stroke="%2393c5fd" stroke-width="2"/><rect x="40" y="60" width="240" height="80" rx="4" fill="%231e293b"/><circle cx="160" cy="100" r="22" fill="%233b82f6"/><polygon points="155,90 170,100 155,110" fill="white"/><text x="160" y="35" font-family="sans-serif" font-size="12" font-weight="600" fill="%231e3a8a" text-anchor="middle">SHORT VIDEO: TRIAGE AMBULATION CUES</text><text x="160" y="175" font-family="sans-serif" font-size="11" fill="%23475569" text-anchor="middle">Multi-frame dynamic movement & respiratory pattern capture</text></svg>',
    totalContribution: 14,
    summary: 'Video analysis demonstrates visible distress cues, antalgic guarding, and reduced mobility',
    observations: [
      {
        id: 'obs-vid-1',
        label: 'Reduced mobility observed',
        confidence: 85,
        contribution: 6,
        cautiousNote: 'Patient visibly favors posture; antalgic gait observed in frames 00:03 through 00:08',
      },
      {
        id: 'obs-vid-2',
        label: 'Visible respiratory distress cue',
        confidence: 81,
        contribution: 8,
        cautiousNote: 'Visible sternocleidomastoid accessory muscle recruitment apparent during inspiration',
      },
    ],
    videoFrames: [
      {
        timestamp: '00:02',
        observation: 'Possible distress cue; patient resting hand over left hemithorax',
        cueType: 'distress',
        significance: 'moderate',
      },
      {
        timestamp: '00:05',
        observation: 'Reduced mobility observed; asymmetric step cadence and guarding',
        cueType: 'mobility',
        significance: 'moderate',
      },
      {
        timestamp: '00:08',
        observation: 'Visible swelling appears accentuated on lateral weight bearing',
        cueType: 'swelling',
        significance: 'high',
      },
      {
        timestamp: '00:11',
        observation: 'No major visible change; stable posture maintained in triage chair',
        cueType: 'stable',
        significance: 'low',
      },
      {
        timestamp: '00:14',
        observation: 'Compensatory shallow breathing pattern noticeable',
        cueType: 'respiratory',
        significance: 'moderate',
      },
      {
        timestamp: '00:18',
        observation: 'Visible diaphoresis sheen along temporal hairline',
        cueType: 'distress',
        significance: 'high',
      },
    ],
  },
];

export function getPresetEvidence(presetId: string): VisualEvidenceData {
  const preset = VISUAL_PRESETS.find((p) => p.id === presetId) || VISUAL_PRESETS[0];
  return {
    type: preset.type,
    mediaUrl: preset.thumbnail,
    mediaName: preset.name,
    analyzedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    mode: 'demo',
    summary: preset.summary,
    observations: preset.observations,
    videoFrames: preset.videoFrames,
    totalVisualContribution: preset.totalContribution,
    isAnalyzing: false,
  };
}
