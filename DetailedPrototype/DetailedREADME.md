# AI-Assisted Emergency Triage & Early Risk Detection

A clinical command-center style prototype for **emergency triage, early deterioration detection, explainable risk scoring, and AI-assisted multimodal visual evidence analysis**.

The system combines synthetic patient data, a deterministic risk engine, live deterioration simulation, explainable risk factors, visual evidence analysis, risk history, and early-warning alerts into a single emergency-department dashboard.

> **⚠️ Decision-support prototype. Not for clinical use.**
>
> This project uses fictional/synthetic patient data and a demonstration risk model. It is not intended for diagnosis, treatment, clinical decision-making, or real-world patient care.

---

## ✨ What This Project Demonstrates

The central workflow is:

```text
Synthetic Patient Data
        ↓
Vitals + Symptoms + History
        ↓
Deterministic Risk Engine
        ↓
Composite Risk Score
        ↓
Triage Priority
        ↓
Priority Queue
        ↓
Early Warning Detection
        ↓
Live Deterioration Simulation
        ↓
Risk Recalculation
        ↓
Queue Reordering + Alert
        ↓
Explainable Risk Factors
        ↓
Multimodal Visual Evidence
```

The goal is to demonstrate how an AI-assisted emergency dashboard could help surface changing risk and make the reasoning behind a prototype risk score visible to a clinician.

---

## 🚀 Key Features

### 1. Emergency Priority Queue

The dashboard maintains a live priority queue of **10 fictional emergency patients**.

Each patient includes:

- Patient ID
- Name
- Age
- Sex
- Arrival time
- Chief complaint
- Symptoms
- Medical history
- Vital signs
- ECG state
- Current risk score
- Triage level
- Risk history
- Visual evidence

Patients can move through different risk states as their data changes.

---

### 2. Deterministic Risk Engine

The project uses a transparent, rule-based risk engine instead of relying on an external AI model for the final numeric risk calculation.

The engine considers:

- SpO₂
- Heart rate
- Systolic blood pressure
- Respiratory rate
- Temperature
- Symptoms
- Medical history
- Visual evidence

The result contains:

```text
Risk Score
Risk Level
Priority
Vital Contribution
Symptom Contribution
History Contribution
Visual Contribution
Risk Factors
Clinical-style Reasons
Warnings
```

This makes the prototype easier to inspect and demonstrate than a black-box model.

> The risk engine is a fictional heuristic created for demonstration purposes and has not been clinically validated.

---

### 3. Explainable Risk Analysis

The dashboard provides a **"Why This Risk?"** / clinical rationale view.

It breaks the composite score into categories such as:

```text
Vital Signs
Symptoms
Medical History
Visual Evidence
```

The interface displays the individual risk factors and their contribution to the overall score.

This is intended to demonstrate **explainable decision support**, not validated clinical explainability.

---

### 4. Early Warning Detection

The application monitors changes in patient risk.

When a patient's risk crosses a higher-risk threshold, an early warning can be generated containing:

- Patient name
- Previous risk score
- New risk score
- Risk level
- Vital-sign changes
- Contributing factors
- Visual evidence cue
- Review recommendation

The dashboard can therefore demonstrate the transition from:

```text
Stable
   ↓
Moderate
   ↓
High
   ↓
Critical
```

---

### 5. Live Deterioration Simulation

The project includes a simulated patient deterioration workflow.

Patient vitals can progress through predefined states:

```text
Baseline
   ↓
Moderate
   ↓
High
   ↓
Critical
```

As the simulated vitals change:

1. Vitals are updated.
2. The risk engine recalculates the score.
3. Risk history is updated.
4. Triage level changes when appropriate.
5. Early-warning checks run.
6. The patient can move in the priority queue.
7. Alerts can be generated.

This allows the complete deterioration workflow to be demonstrated without real patient data.

---

### 6. Multimodal Visual Evidence

The dashboard includes a **Visual Evidence & Multimodal Inspection** workflow.

Users can provide:

- Clinical photos
- Video evidence

The visual evidence workflow supports two modes:

#### Demo Analysis Engine

A deterministic fallback mode designed for reliable demonstrations.

It can generate structured observations such as:

- Visible localized swelling
- Discoloration / bruising
- Burn-like visible injury
- Superficial wound
- Visible distress cues
- Reduced mobility
- Other observable visual cues

#### Live Multimodal AI

When a Gemini API key is configured, uploaded image evidence can be sent through the server-side visual-analysis endpoint.

The AI analysis is instructed to use cautious observational language and return structured observations rather than making a diagnosis.

If the AI service is unavailable, the application falls back to deterministic demo analysis.

---

### 7. Visual Evidence Risk Contribution

Visual observations can contribute additional points to the demonstration risk score.

The dashboard shows:

```text
Visual Evidence
       ↓
Observations
       ↓
Confidence
       ↓
Contribution
       ↓
Composite Risk Score
```

This demonstrates how multiple information sources can be combined into a single explainable risk view.

---

### 8. Risk History & Trend Visualization

Patients can have historical risk points containing:

- Time
- Risk score
- Heart rate
- SpO₂
- Systolic BP
- Event note

The dashboard uses Recharts-based visualization to display changes over time.

This helps demonstrate the difference between:

```text
Single snapshot
```

and

```text
Risk trajectory over time
```

---

### 9. ECG Simulation

The dashboard includes a simulated ECG state for patients, such as:

- NORMAL
- TACHYCARDIA
- IRREGULAR

This is a **visual/demo representation only** and is not real ECG acquisition or interpretation.

---

### 10. Automated Hackathon Demo

The project includes an automated presentation/demo controller.

It can guide the dashboard through a predefined deterioration sequence, making it easier to demonstrate the concept during:

- Hackathons
- Project presentations
- College evaluations
- Prototype reviews

The automated demo can start, pause, reset, and move through deterioration stages.

---

## 🧠 Risk Engine Architecture

The risk engine is implemented in:

```text
src/services/riskEngine.ts
```

The general scoring flow is:

```text
                ┌── Vital Signs
                │
                ├── Symptoms
Patient Data ───┼── Medical History
                │
                └── Visual Evidence
                         ↓
                Deterministic Risk Engine
                         ↓
                  Risk Contributions
                         ↓
                  Composite Score
                         ↓
              Risk Level + Priority
```

The engine deliberately does **not** depend on Gemini for the final numeric score.

This keeps the main risk calculation deterministic and reproducible.

---

## 🏥 Patient Data

The project contains 10 fictional patients with emergency-department scenarios including examples such as:

- Acute dyspnea
- Chest pressure
- Trauma / orthopedic injury
- Febrile illness
- Burns
- Syncope
- Neurological presentations
- Other emergency triage scenarios

Patient data is stored in:

```text
src/data/mockPatients.ts
```

No real patient records are included.

---

## 🛠️ Technology Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Lucide React
- Motion

### Backend / Development Server

- Node.js
- Express
- TSX
- Vite middleware

### AI / Multimodal Analysis

- Google Gemini API via `@google/genai`
- Server-side API route for visual evidence analysis
- Deterministic fallback analysis for reliable demos

---

## 📁 Project Structure

```text
ai-assisted-emergency-triage/
│
├── index.html
├── package.json
├── server.ts
├── vite.config.ts
├── tsconfig.json
├── .env.example
├── bun.lock
│
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    │
    ├── types/
    │   └── triage.ts
    │
    ├── data/
    │   ├── mockPatients.ts
    │   └── visualPresets.ts
    │
    ├── services/
    │   ├── riskEngine.ts
    │   └── visualAnalysisService.ts
    │
    └── components/
        ├── Header.tsx
        ├── KPICards.tsx
        ├── EarlyWarningBanner.tsx
        ├── PriorityQueue.tsx
        ├── VitalsGrid.tsx
        ├── SimulatedECG.tsx
        ├── MultimodalRiskPanel.tsx
        ├── RiskHistoryChart.tsx
        ├── VisualEvidence.tsx
        ├── VitalsUpdateModal.tsx
        ├── AutomatedDemoModal.tsx
        └── PatientDetail.tsx
```

---

## ⚙️ Getting Started

### Prerequisites

Install:

- Node.js
- npm

Check your versions:

```bash
node --version
npm --version
```

---

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd ai-assisted-emergency-triage
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

On Windows PowerShell, you can use:

```powershell
Copy-Item .env.example .env
```

For deterministic demo mode, the application can fall back to local demo analysis when the AI visual-analysis service is unavailable.

To enable the live Gemini visual-analysis path, configure:

```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

Do **not** commit your real API key to GitHub.

---

### 4. Start the Development Server

```bash
npm run dev
```

The project uses the Express server with Vite middleware during development.

Open:

```text
http://localhost:3000
```

---

## 🔐 Environment Variables

The project uses environment variables for server-side configuration.

Example:

```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
APP_URL="YOUR_APP_URL"
```

### Important

Never commit:

```text
.env
.env.local
```

or any file containing a real API key.

The repository should only contain:

```text
.env.example
```

with placeholder values.

---

## 🔌 API Endpoints

### Health Check

```http
GET /api/health
```

Returns basic server status and whether a Gemini API key is configured.

Example:

```json
{
  "status": "ok",
  "hasGeminiKey": true,
  "mode": "Emergency Triage Decision Support"
}
```

---

### Visual Analysis

```http
POST /api/analyze-visual
```

Used by the frontend to request multimodal visual evidence analysis.

The request can contain:

```json
{
  "mediaDataUrl": "...",
  "fileName": "clinical-image.jpg",
  "mediaType": "photo"
}
```

The endpoint returns structured observations and risk contribution data.

If live Gemini analysis is unavailable, the server uses a deterministic demonstration fallback.

---

## 🧪 Demo Mode vs AI Mode

The visual evidence feature intentionally supports both modes.

### Demo Mode

```text
Upload / Preset
      ↓
Deterministic Analysis
      ↓
Structured Visual Observations
      ↓
Risk Contribution
```

Advantages:

- Works without an API key
- Predictable output
- Reliable for presentations
- No external AI dependency during the demo

### AI Mode

```text
Uploaded Image
      ↓
Frontend
      ↓
Express API
      ↓
Gemini Multimodal Model
      ↓
Structured Observations
      ↓
Risk Contribution
```

The application still falls back to demo analysis if the AI request fails.

---

## 🎬 Recommended Demo Flow

For a hackathon or project presentation:

### 1. Start the dashboard

Show the emergency priority queue and KPI cards.

### 2. Select a high-risk patient

Open the patient detail/risk analysis view.

Show:

- Current risk score
- Risk level
- Vital contributions
- Symptom contributions
- History contributions
- Visual contribution
- Explainable risk factors

### 3. Show the risk history

Use the trend chart to demonstrate that risk can change over time.

### 4. Start deterioration simulation

Use the simulation controls to progressively change a patient's physiological state.

### 5. Observe risk escalation

Demonstrate:

```text
Changing Vitals
      ↓
Risk Score Changes
      ↓
Triage Level Changes
      ↓
Early Warning
      ↓
Priority Queue Update
```

### 6. Show multimodal evidence

Open Visual Evidence and demonstrate either:

- a preset demo
- an uploaded image
- an uploaded video

### 7. Compare Demo vs AI mode

If a Gemini API key is configured, demonstrate the live multimodal analysis path.

Otherwise, use the deterministic demo engine.

### 8. Finish with the safety message

> Decision-support prototype. Not for clinical use.

---

## 🧩 Development Commands

### Start development server

```bash
npm run dev
```

### Build production bundle

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Type-check the project

```bash
npm run lint
```

---

## 📊 Design Principles

The dashboard is designed around several principles:

### Explainability

The system should show **why** a patient has a particular demonstration risk score.

### Determinism

The core risk calculation should be reproducible and independent of an external AI response.

### Human-in-the-loop

The prototype is designed as decision support rather than autonomous clinical decision-making.

### Progressive Risk Detection

The system demonstrates how a patient can move from a lower-risk state toward a higher-risk state as physiological measurements change.

### Multimodal Evidence

The prototype explores combining:

```text
Vitals
+
Symptoms
+
Medical History
+
Visual Evidence
=
Composite Demonstration Risk
```

---

## ⚠️ Clinical & AI Safety Disclaimer

This project is a **fictional software prototype for educational, research, and hackathon demonstration purposes**.

It:

- Uses synthetic/fictional patient data.
- Uses a deterministic demonstration risk engine.
- Uses demonstration visual-analysis fallbacks.
- Does not provide medical diagnosis.
- Does not prescribe treatment.
- Does not replace professional clinical judgment.
- Does not represent a validated clinical scoring system.
- Does not provide validated mortality or outcome prediction.
- Does not claim FDA, CE, or other medical-device approval.
- Is not connected to a real EHR or hospital system.
- Must not be used to make decisions about real patients.

Visual analysis is intentionally framed as **observational evidence**, not definitive diagnosis.

**Decision-support prototype. Not for clinical use.**

---

## 🔮 Future Scope

Possible future work includes:

- AI-assisted patient report analysis
- More advanced patient risk trajectory prediction
- Structured clinical-report ingestion
- Additional multimodal inputs
- More sophisticated machine-learning models
- Model evaluation and calibration
- Patient-specific trend forecasting
- Role-based clinician workflows
- EHR interoperability
- Secure authentication
- Audit logging
- Persistent backend storage
- Formal clinical validation
- Privacy and regulatory compliance workflows

Any real-world clinical implementation would require extensive validation, safety testing, privacy controls, governance, and appropriate clinical oversight.

---

## 👥 Intended Use

This repository is intended for:

- Hackathon demonstrations
- Academic projects
- Healthcare-AI UI prototypes
- Explainable-AI experiments
- Human-in-the-loop decision-support research
- Frontend engineering demonstrations
- Multimodal AI experimentation

---

## 📌 Core Project Idea

> **A patient is deteriorating. The system notices. The risk increases. The patient moves up the queue. The system explains why. Multimodal evidence can add another layer of observable context. The clinician remains in the loop.**

---

## 📄 License

Add the license required by your team, institution, or competition before publishing the repository publicly.

For example:

```text
MIT License
```

If you use a third-party model/API, also follow the applicable provider terms and usage policies.
