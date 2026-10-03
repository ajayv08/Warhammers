import React, { useState, useRef } from 'react';
import {
  Camera,
  Video,
  Upload,
  Sparkles,
  CheckCircle2,
  Trash2,
  AlertCircle,
  FileText,
  Clock,
  Layers,
  Shield,
  Film,
} from 'lucide-react';
import { VisualEvidenceData, VisualObservation, VideoFrameAnalysis } from '../types/triage';
import { VISUAL_PRESETS, getPresetEvidence } from '../data/visualPresets';
import { analyzeVisualEvidence } from '../services/visualAnalysisService';

interface VisualEvidenceProps {
  evidence: VisualEvidenceData;
  onUpdateEvidence: (evidence: VisualEvidenceData) => void;
}

export const VisualEvidence: React.FC<VisualEvidenceProps> = ({ evidence, onUpdateEvidence }) => {
  const [activeTab, setActiveTab] = useState<'photo' | 'video'>(evidence.type || 'photo');
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiMode, setAiMode] = useState<'demo' | 'ai'>(evidence.mode || 'demo');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setErrorMessage(null);

    // Basic file validation
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      setErrorMessage('Unsupported file format. Please upload an image (.jpg, .png) or video (.mp4, .webm).');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('File size exceeds 25MB limit. Please upload a smaller compressed clip or image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const mediaType: 'photo' | 'video' = isVideo ? 'video' : 'photo';
      setActiveTab(mediaType);

      // Set uploaded media without analysis yet
      onUpdateEvidence({
        type: mediaType,
        mediaUrl: dataUrl,
        mediaName: file.name,
        analyzedAt: null,
        mode: aiMode,
        summary: 'Media uploaded. Ready for AI-assisted visual analysis.',
        observations: [],
        videoFrames: undefined,
        totalVisualContribution: 0,
        isAnalyzing: false,
      });
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read media file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleRunAnalysis = async (forceDemo: boolean = false) => {
    if (!evidence.mediaUrl) return;

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const res = await analyzeVisualEvidence(
        evidence.mediaUrl,
        evidence.mediaName || 'Uploaded Media',
        evidence.type || activeTab,
        forceDemo || aiMode === 'demo'
      );

      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      onUpdateEvidence({
        type: evidence.type || activeTab,
        mediaUrl: evidence.mediaUrl,
        mediaName: evidence.mediaName,
        analyzedAt: timestamp,
        mode: res.mode,
        summary: res.summary,
        observations: res.observations,
        videoFrames: res.videoFrames,
        totalVisualContribution: res.totalContribution,
        isAnalyzing: false,
      });
    } catch (err: any) {
      setErrorMessage('Visual analysis failed. Switching to deterministic Demo analysis fallback.');
      const fallback = getPresetEvidence('preset-swelling');
      onUpdateEvidence({
        ...fallback,
        mediaUrl: evidence.mediaUrl,
        mediaName: evidence.mediaName,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyPreset = (presetId: string) => {
    const presetData = getPresetEvidence(presetId);
    setActiveTab(presetData.type || 'photo');
    onUpdateEvidence(presetData);
    setErrorMessage(null);
  };

  const handleRemoveMedia = () => {
    onUpdateEvidence({
      type: null,
      mediaUrl: null,
      mediaName: null,
      analyzedAt: null,
      mode: 'demo',
      summary: '',
      observations: [],
      videoFrames: undefined,
      totalVisualContribution: 0,
      isAnalyzing: false,
    });
    setErrorMessage(null);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
      {/* Header and Disclaimers */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900">
              Visual Evidence & Multimodal Inspection
            </h3>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
              AI-Assisted Visual Evidence — Demo Only
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Integrates visible anatomical trauma, swelling, and distress cues into deterministic triage scoring.
          </p>
        </div>

        {/* AI Mode vs Demo Mode toggle */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <div className="flex items-center p-0.5 bg-slate-200/80 rounded-md text-xs">
            <button
              onClick={() => setAiMode('demo')}
              className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                aiMode === 'demo'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Demo Analysis Engine
            </button>
            <button
              onClick={() => setAiMode('ai')}
              className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                aiMode === 'ai'
                  ? 'bg-white text-blue-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Live Multimodal AI
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Preset Quick Selectors */}
        <div>
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Instant Clinical Demo Presets (No Upload Needed)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {VISUAL_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleApplyPreset(p.id)}
                className="text-left p-2.5 rounded border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-colors text-xs flex items-center gap-2.5 cursor-pointer bg-white"
              >
                <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center shrink-0 text-slate-600">
                  {p.type === 'video' ? <Film className="w-4 h-4 text-indigo-600" /> : <Camera className="w-4 h-4 text-blue-600" />}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-slate-800 truncate">{p.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    +{p.totalContribution} pts · {p.type === 'video' ? '6 Video Frames' : '2 Observations'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Media Upload / Drop Zone or Active Media Preview */}
        {!evidence.mediaUrl ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
              isDragging
                ? 'border-blue-500 bg-blue-50/60'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,video/*"
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">
                  Upload Clinical Photo or Video Evidence
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Drag and drop files here, or click to browse (JPG, PNG, MP4 up to 25MB)
                </p>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono mt-1">
                <span>· Superficial wounds</span>
                <span>· Soft tissue edema</span>
                <span>· Burn injury</span>
                <span>· Mobility cues</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
              <div className="flex items-center gap-2">
                {evidence.type === 'video' ? (
                  <Film className="w-4 h-4 text-indigo-600" />
                ) : (
                  <Camera className="w-4 h-4 text-blue-600" />
                )}
                <span className="font-semibold text-xs text-slate-900 truncate max-w-xs">
                  {evidence.mediaName || 'Uploaded Clinical Evidence'}
                </span>
                {evidence.analyzedAt && (
                  <span className="text-[11px] text-slate-500 font-mono">
                    · Analyzed at {evidence.analyzedAt}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRunAnalysis(true)}
                  disabled={isAnalyzing}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Use Demo Analysis
                </button>

                <button
                  onClick={() => handleRunAnalysis(false)}
                  disabled={isAnalyzing}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Evidence'}</span>
                </button>

                <button
                  onClick={handleRemoveMedia}
                  className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                  title="Remove media"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Media Display Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div className="md:col-span-1 rounded-lg overflow-hidden border border-slate-300 bg-slate-900 relative aspect-4/3 flex items-center justify-center">
                {evidence.type === 'video' && evidence.mediaUrl.startsWith('data:video') ? (
                  <video
                    src={evidence.mediaUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src={evidence.mediaUrl}
                    alt={evidence.mediaName || 'Visual Evidence'}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute bottom-1 right-1 bg-black/70 text-[10px] font-mono text-white px-1.5 py-0.5 rounded">
                  {evidence.type?.toUpperCase()}
                </div>
              </div>

              {/* Analysis Summary and Risk Contribution Callout */}
              <div className="md:col-span-2 space-y-2.5">
                <div className="p-3 bg-white rounded border border-slate-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">Visual Evidence Summary</span>
                    <span className="font-mono font-bold text-blue-700 text-sm tabular-nums">
                      +{evidence.totalVisualContribution} Risk Points
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {evidence.summary || 'Awaiting analysis. Click "Analyze Evidence" to run visual inspection.'}
                  </p>
                </div>

                {/* Cautious Language Banner */}
                <div className="flex items-start gap-2 p-2 bg-amber-50/70 border border-amber-200/80 rounded text-[11px] text-amber-900">
                  <Shield className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="leading-tight">
                    <strong>Cautious Observational Framework:</strong> Observations express visual appearance only ("visible", "possible", "appears consistent with"). Does not confirm diagnosis or tissue pathology.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-2.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Section 5: Photo Analysis / Visual Observations */}
        {evidence.observations && evidence.observations.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Visual Observations (Photo / Morphology)
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">
                {evidence.observations.length} Identified Clinical Findings
              </span>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden bg-white">
              {evidence.observations.map((obs) => (
                <div key={obs.id} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{obs.label}</span>
                      {obs.location && (
                        <span className="text-[11px] text-slate-500 font-mono">({obs.location})</span>
                      )}
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed italic">
                      "{obs.cautiousNote}"
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 font-mono">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase">Confidence</div>
                      <div className="font-semibold text-slate-700 tabular-nums">{obs.confidence}%</div>
                    </div>
                    <div className="text-right pl-3 border-l border-slate-200">
                      <div className="text-[10px] text-slate-400 uppercase">Contribution</div>
                      <div className="font-bold text-blue-700 tabular-nums">+{obs.contribution} pts</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 6: Video Analysis / Temporal Cues */}
        {evidence.videoFrames && evidence.videoFrames.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Video Analysis (Dynamic Ambulation & Distress Timeline)
                </h4>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                Frames analyzed: {evidence.videoFrames.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {evidence.videoFrames.map((frame, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded border border-slate-200 bg-slate-50/70 text-xs flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between font-mono text-[11px] border-b border-slate-200/80 pb-1 mb-1">
                    <span className="font-bold text-slate-800">{frame.timestamp}</span>
                    <span
                      className={`text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded ${
                        frame.significance === 'high'
                          ? 'bg-red-100 text-red-700'
                          : frame.significance === 'moderate'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {frame.cueType}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">{frame.observation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
