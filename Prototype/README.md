# AI Emergency Triage & Risk Monitoring

A frontend prototype for **AI-assisted emergency triage, risk scoring, patient prioritization, and live deterioration monitoring**.

The dashboard is designed as a clinical command-center style demo where synthetic emergency-department patients are continuously assessed using a transparent demonstration risk engine. Patients are automatically ordered by risk, abnormal vitals are highlighted, and a live simulation can demonstrate patient deterioration and risk escalation.

> **⚠️ Decision-support prototype. Not for clinical use.**
>
> This project uses synthetic demonstration data and a mock risk model. It is not intended for diagnosis, treatment, clinical decision-making, or real-world patient care.

---

## 🚀 Key Features

### 1. Emergency Priority Queue
- Patients are automatically sorted by risk score.
- Highest-risk patients appear first.
- Risk scores are calculated dynamically from patient vitals.
- Queue ordering updates when patient risk changes.

### 2. Transparent Risk Engine
The prototype calculates a 0–100 risk score using demonstration rules based on:

- SpO₂
- Respiratory rate
- GCS
- Systolic blood pressure
- Heart rate
- Temperature
- Age

The system also identifies the major contributing factors behind a patient's score.

### 3. Triage Classification

Risk scores are mapped to demonstration triage levels:

| Risk Score | Level | Status |
|---|---|---|
| 80–100 | ESI 1 | Critical |
| 60–79 | ESI 2 | Urgent |
| 40–59 | ESI 3 | Guarded |
| 0–39 | ESI 4/5 | Stable |

These mappings are **prototype classifications** and should not be interpreted as an official implementation of the Emergency Severity Index.

### 4. Live Vitals Simulation

The **Simulate Live Vitals Stream** feature demonstrates how a patient's condition can deteriorate over time.

During simulation:
- Vital signs change progressively.
- Risk scores are recalculated.
- Patients can move upward in the priority queue.
- Critical threshold crossings can trigger alerts.
- The dashboard timestamp updates continuously.

### 5. Silent Deteriorator

One synthetic patient is designated as a silent deteriorator.

During the simulation, the patient's:
- Heart rate increases
- Respiratory rate increases
- SpO₂ decreases
- Temperature changes
- GCS can deteriorate

This demonstrates the core concept:

```text
Changing Vitals
      ↓
Risk Recalculation
      ↓
Higher Risk Score
      ↓
Queue Reordering
      ↓
Critical Alert
```

### 6. Risk Explainability

Each patient has a:

**"Why? / Risk Analysis"**

button.

The analysis shows:
- Major risk contributors
- Feature contribution chart
- Clinical-style summary
- Current risk interpretation

The chart is generated from the same demonstration risk factors used by the risk engine.

### 7. Critical Alerts

When a patient's risk score crosses the critical threshold, the prototype can generate an urgent review notification.

The dashboard also highlights patients currently classified as Critical.

### 8. Search & Filtering

Patients can be searched by:

- Name
- Patient ID
- Chief complaint

The queue can also be filtered by:

- All
- Critical
- Urgent
- Guarded
- Stable

### 9. Responsive Clinical Dashboard

The interface is designed as a compact clinical command center with:

- Risk-based colors
- Patient cards
- Vital-sign panels
- Alert banners
- Explainability modal
- Live status indicator
- Responsive layout

---

## 🧠 System Architecture

```text
Synthetic Patient Data
        ↓
Demonstration Risk Engine
        ↓
Risk Score (0–100)
        ↓
Triage Mapping
        ↓
Priority Queue
        ↓
Risk Explainability
        ↓
Live Vitals Simulation
        ↓
Risk Recalculation
        ↓
Automatic Queue Reordering
        ↓
Critical Alert
```

---

## 🛠️ Technology Stack

The current prototype is implemented as a single HTML file using browser-loaded libraries:

- **HTML5**
- **React 18**
- **ReactDOM 18**
- **Babel Standalone**
- **Tailwind CSS CDN**
- **Chart.js 4.4.1**
- **React Hooks**
- **JavaScript**

The application currently does **not** require a backend, database, API, or external patient-data service.

All patient data is synthetic and embedded in the frontend.

---

## 📁 Project Structure

```text
AI-Emergency-Triage/
│
├── ed-triage-demo.html
└── README.md
```

The main application is contained in:

```text
ed-triage-demo.html
```

The file contains:
- Synthetic patient dataset
- Risk calculation
- Triage mapping
- Patient cards
- Priority queue
- Search/filter logic
- Live simulation
- Alert logic
- Explainability chart
- Dashboard UI

---

## ▶️ Running the Project

### Option 1 — Direct Browser

Because the current prototype loads its dependencies through CDNs, the HTML file can be opened directly in a modern browser.

Open:

```text
ed-triage-demo.html
```

### Option 2 — VS Code Live Server

For development, using **Live Server** in VS Code is recommended.

1. Open the project folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `ed-triage-demo.html`.
4. Select **Open with Live Server**.

The dashboard should open in your browser.

---

## 🎬 Demo Flow

A typical demonstration can follow this sequence:

### Step 1 — Open the Dashboard

The dashboard displays the emergency patient priority queue.

Patients are already ordered according to their demonstration risk score.

### Step 2 — Review a Critical Patient

Click:

```text
Why? / Risk Analysis
```

Review:
- Risk score
- Contributing factors
- Feature contribution chart
- Clinical-style summary

### Step 3 — Start Live Simulation

Click:

```text
▶ Simulate Live Vitals Stream
```

The live indicator becomes active.

### Step 4 — Observe Patient Deterioration

The designated silent deteriorator gradually changes vital signs.

The system recalculates the risk score.

### Step 5 — Observe Queue Reordering

As risk increases, the patient moves upward in the priority queue.

This demonstrates dynamic triage prioritization.

### Step 6 — Critical Alert

When the demonstration risk crosses the critical threshold, the system can generate an urgent-review notification.

---

## 🔬 Demonstration Risk Model

The prototype intentionally uses a transparent rule-based model instead of a black-box machine-learning model.

For example:

```text
Low SpO₂
    +
High Respiratory Rate
    +
Low GCS
    +
Abnormal Blood Pressure
    +
Abnormal Heart Rate
    +
Abnormal Temperature
    +
Age Modifier
    ↓
Demonstration Risk Score
```

The model is designed for **explainability during a hackathon/demo**, not for clinical validation.

---

## 🧪 Synthetic Patient Data

The project contains synthetic emergency-department scenarios such as:

- Chest pain
- Shortness of breath
- Fever and confusion
- Abdominal pain
- Stroke-code presentation
- Trauma/MVC
- Palpitations and dizziness
- Migraine
- Fall with hip pain
- Sports injury

No real patient records are used.

---

## 🔮 Planned / Future Improvements

Potential future versions could include:

- AI Patient Report Analysis
- Patient history and trend visualization
- More advanced explainability
- ML-based risk prediction
- Structured clinical report ingestion
- Voice-based clinician interaction
- Multi-patient trend monitoring
- Backend/API integration
- Authentication and role-based access
- EHR integration
- Persistent patient records

Any future clinical/ML functionality would require appropriate validation, governance, privacy protections, and clinical oversight before real-world use.

---

## ⚠️ Clinical Safety Disclaimer

This project is a **software prototype for demonstration and educational purposes**.

It:

- Uses synthetic data.
- Uses a demonstration risk engine.
- Does not provide medical diagnosis.
- Does not provide treatment recommendations.
- Does not predict actual patient outcomes.
- Is not clinically validated.
- Is not an FDA/CE-approved medical device.
- Is not connected to a real EHR.
- Must not be used for real patient care.

**Decision-support prototype. Not for clinical use.**

---

## 📌 Project Goal

The central concept of the project is:

> **A patient is deteriorating. The system notices. The risk increases. The patient moves up the queue. The system explains why. The clinician gets alerted.**

The prototype focuses on making this workflow visible, understandable, and easy to demonstrate.

---

## 👥 Use Cases

This prototype can be useful for demonstrating concepts related to:

- Emergency department triage
- Clinical decision-support interfaces
- Early deterioration detection
- Risk prioritization
- Explainable AI
- Healthcare dashboards
- Human-in-the-loop AI
- Hackathons and academic prototypes

---

## 📄 License

Add your preferred license before publishing if this repository will be distributed publicly.

For example:

```text
MIT License
```

or use the license required by your institution/team.
