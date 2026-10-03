import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '30mb' }));

// Health / info endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    mode: 'Emergency Triage Decision Support',
  });
});

// Multimodal Visual Evidence Analysis Endpoint
app.post('/api/analyze-visual', async (req, res) => {
  try {
    const { mediaDataUrl, fileName, mediaType } = req.body;

    if (!mediaDataUrl) {
      return res.status(400).json({ error: 'Missing mediaDataUrl' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If Gemini API Key is available, use live multimodal model
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });

        // Extract base64 and mime type
        const match = mediaDataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
        let mimeType = 'image/jpeg';
        let base64Data = mediaDataUrl;

        if (match) {
          mimeType = match[1];
          base64Data = match[2];
        }

        // For video files without native video tokenization support in basic inline, handle gracefully
        if (mediaType === 'video' || mimeType.startsWith('video/')) {
          // Use cautious structured video analysis prompt or fallback
          return res.json({
            mode: 'demo',
            summary: 'Dynamic video motion analysis indicates antalgic posture guarding and visible distress cues',
            totalContribution: 12,
            observations: [
              {
                id: 'ai-vid-obs-1',
                label: 'Reduced mobility observed',
                confidence: 86,
                contribution: 6,
                cautiousNote: 'Antalgic gait with compensatory limb off-loading observed across frames',
              },
              {
                id: 'ai-vid-obs-2',
                label: 'Visible distress cue',
                confidence: 82,
                contribution: 6,
                cautiousNote: 'Patient posture demonstrates protective guarding and grimacing cues',
              },
            ],
            videoFrames: [
              { timestamp: '00:02', observation: 'Possible distress cue; asymmetric trunk alignment', cueType: 'distress', significance: 'moderate' },
              { timestamp: '00:05', observation: 'Reduced mobility observed; hesitation upon weight transfer', cueType: 'mobility', significance: 'moderate' },
              { timestamp: '00:08', observation: 'Visible localized swelling accentuated during active flexion', cueType: 'swelling', significance: 'high' },
              { timestamp: '00:11', observation: 'No major visible change; stable posture maintained in triage chair', cueType: 'stable', significance: 'low' },
              { timestamp: '00:14', observation: 'Compensatory shallow breathing pattern noticeable', cueType: 'respiratory', significance: 'moderate' },
              { timestamp: '00:18', observation: 'Visible diaphoresis sheen along temporal hairline', cueType: 'distress', significance: 'high' },
            ],
          });
        }

        const prompt = `You are a clinical decision support visual triage assistant in a simulated emergency room.
Analyze this clinical image for VISIBLE physical evidence and observable trauma cues.

IMPORTANT CONSTRAINTS:
1. You are NOT diagnosing disease or replacing a doctor.
2. Use cautious, observational language ONLY: "visible", "possible", "appears consistent with", "observable".
3. Identify visual observations from: apparent swelling, visible bleeding, discoloration, superficial wound, burn-like visible injury, bruising, visible distress.
4. Output JSON strictly with this schema:
{
  "summary": "Short 1-2 sentence description of visible cues",
  "totalContribution": 10, // number between 4 and 18 points added to triage risk
  "observations": [
    {
      "id": "obs-1",
      "label": "Visible localized swelling" (or burn-like visible injury, superficial wound, bruising, discoloration, visible bleeding),
      "confidence": 85, // percentage 60-95
      "contribution": 6, // points between 2 and 10
      "cautiousNote": "Cautious sentence noting visible appearance without diagnosing",
      "location": "Anatomical region visible"
    }
  ]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    data: base64Data,
                    mimeType: mimeType.startsWith('image/') ? mimeType : 'image/jpeg',
                  },
                },
                { text: prompt },
              ],
            },
          ],
          config: {
            responseMimeType: 'application/json',
          },
        });

        const text = response.text?.trim() || '{}';
        const parsed = JSON.parse(text);

        if (parsed.observations && Array.isArray(parsed.observations)) {
          return res.json({
            mode: 'ai',
            summary: parsed.summary || 'Visible physical cues analyzed via multimodal vision model',
            totalContribution: Math.min(20, Math.max(4, parsed.totalContribution || 10)),
            observations: parsed.observations,
          });
        }
      } catch (geminiError) {
        console.warn('Gemini vision API execution encountered an error, falling back to deterministic demo response:', geminiError);
      }
    }

    // Deterministic fallback response
    const isBurn = fileName.toLowerCase().includes('burn') || fileName.toLowerCase().includes('scald');
    if (isBurn) {
      return res.json({
        mode: 'demo',
        summary: 'Visible partial-thickness thermal injury pattern with localized erythema and blistering',
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
      });
    }

    // Default swelling / injury fallback
    return res.json({
      mode: 'demo',
      summary: 'Visible localized swelling with microvascular discoloration and soft-tissue distortion',
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
    });
  } catch (error: any) {
    console.error('Visual analysis endpoint error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Mount Vite or static server
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
