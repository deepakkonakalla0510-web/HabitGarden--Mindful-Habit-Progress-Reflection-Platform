# 🌿 HabitGarden – Mindful Habit Progress & Reflection Platform

[![Node.js](https://img.shields.io/badge/Node.js-v26.13-339933?logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-v4.21-000000?logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-v9.0-47A248?logo=mongodb)](https://www.mongodb.com)
[![React](https://img.shields.io/badge/React-v18.3-61DAFB?logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-v5.4-646CFF?logo=vite)](https://vitejs.dev)

> **Mindful Habit Tracking & Reflection**: A soothing MERN platform that replaces toxic, anxiety-inducing streak resets with flexible multi-day weekly targets, non-punitive analytics, botanical dormancy metaphors, and day-of-week behavioral rhythm comparisons.

---

### 👨‍💻 Project Metadata & Student Attribution
- **Student Architect**: **DEEPAK KONAKALLA**
- **Student ID / USN**: **2102508559**
- **Role**: Principal Full-Stack MERN Architect & Product Designer
- **Core Theme**: Mindful habit progress, emotional self-reflection, and non-shaming behavioral analytics

---

## 🌸 1. Design Philosophy & Non-Shaming UX

| Traditional Habit Trackers | HabitGarden Philosophy |
| :--- | :--- |
| **Harsh Streak Resets**: Missing one day breaks a 30-day streak down to 0, inducing shame and abandonment. | **Botanical Dormancy**: Missing a day is recorded as a *Rest Day*. Plants do not die overnight; they enter dormancy to gather energy for future blooms. |
| **Rigid Daily Demands**: Requires 7-day daily checking even during illness or heavy work sprints. | **Flexible Multi-Day Weekly Targets**: Set sustainable goals (e.g., 4 days/week). Completing any 4 days fulfills your weekly intention. |
| **Red "FAILED" Banners**: Shaming alerts and loud alarms. | **Calm Oatmeal & Earth Palette**: Zero red banners. Earthy botanical greens (`#2D5A27`, `#608056`), oatmeals (`#FAF7F2`), and warm terracottas (`#D97757`). |
| **Zero "Why" Context**: No understanding of why a day was skipped. | **Gentle Reflection Logs**: Categorize rest by gentle tags (`Low Energy`, `Mental Health/Rest`, `Overworked/Busy`) with custom notes up to 500 characters. |
| **Cold Numbers**: Only raw counts and percentages. | **Automated Compassionate Insights**: Empathy-first analysis turning behavioral patterns into constructive, guilt-free habit advice. |

---

## 🪴 2. Botanical Plant Evolution System

Habits evolve based on **cumulative mindful completions** rather than fragile consecutive streaks. Rest days keep plants nourished in dormancy without degrading their growth stage:

1. **Seed** (0 – 2 check-ins): A snug seed pod resting peacefully in fertile soil.
2. **Sprout** (3 – 7 check-ins): Tender dual green leaves unfurling with morning dew.
3. **Bud** (8 – 14 check-ins): Rising stalk with nascent blossom petals preparing to open.
4. **Bloom** (15 – 24 check-ins): Vibrant, fully open blossom radiating custom botanical colors.
5. **Lush Tree** (25+ check-ins): Magnificent canopy tree with deep roots and abundant foliage.

---

## 🏛️ 3. Full-Stack MERN Architecture

```
Habit Garden/
├── backend/
│   ├── config/
│   │   └── db.js                 # Resilient MongoDB connection
│   ├── controllers/
│   │   ├── habitController.js    # Habit CRUD, weekly date ranges, stage calculation
│   │   ├── logController.js      # Actions 1 & 2: checkin, rest reflection, toggles
│   │   └── analyticsController.js# Action 3: MongoDB weekday aggregation pipeline
│   ├── models/
│   │   ├── Habit.js              # Habit Mongoose Schema
│   │   └── HabitLog.js           # HabitLog & Reflection Schema (indexed)
│   ├── routes/
│   │   ├── habitRoutes.js        # Habit & Log REST endpoints
│   │   ├── analyticsRoutes.js    # Weekly patterns & summary endpoints
│   │   └── seedRoutes.js         # Realistic 28-day sample data seeder
│   ├── middleware/
│   │   ├── errorHandler.js       # Centralized error handler & 404 catcher
│   │   └── validators.js         # Express-validator schemas & ObjectId checks
│   ├── utils/
│   │   ├── plantEvolution.js     # Cumulative stage & progress calculator
│   │   └── insightGenerator.js   # Dynamic natural language compassionate insights
│   ├── test-api.js               # End-to-end API verification test suite
│   ├── server.js                 # Express server & security headers
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx               # Brand, student attribution, tab navigation
│   │   │   ├── GardenCanvas.jsx         # Visual canopy grid & category filters
│   │   │   ├── HabitCard.jsx            # Action 1 trigger, 7-day strip, flexible progress
│   │   │   ├── ReflectionModal.jsx      # Action 2: Reason tags & reflection notes
│   │   │   ├── WeeklyRhythmChart.jsx    # Action 3: Recharts Bar & Radar comparison
│   │   │   ├── CompassionateInsights.jsx# Dynamic empathetic insight cards
│   │   │   ├── MonthlyGrowthSummary.jsx # Harmony index & canopy distribution
│   │   │   ├── CreateHabitModal.jsx     # Action 4: Plant habit with flexible targets
│   │   │   ├── EditHabitModal.jsx       # Target tuning modal
│   │   │   ├── PlantIllustration.jsx    # Custom animated SVG plant stages
│   │   │   └── Toast.jsx                # Botanical floating notifications
│   │   ├── services/
│   │   │   └── api.js                   # Unified frontend API service layer
│   │   ├── App.jsx                      # Global state, optimistic updates, rollback
│   │   ├── main.jsx
│   │   └── index.css                    # Tailwind CSS & botanical styling
│   ├── vite.config.js                   # Vite dev server + proxy to port 5000
│   ├── tailwind.config.js               # Botanical, oatmeal, and terracotta colors
│   └── package.json
├── start-habitgarden.bat                # 1-click Windows launcher
├── start-habitgarden.ps1                # 1-click PowerShell launcher
└── package.json                         # Root workspace scripts
```

---

## 🗄️ 4. Database Schema Specifications (Mongoose)

### 1. `Habit` Schema (`backend/models/Habit.js`)
```javascript
{
  title: { type: String, required: true, trim: true, minlength: 3, maxlength: 80 },
  category: {
    type: String,
    required: true,
    enum: ['Mindfulness', 'Physical Health', 'Deep Work', 'Creativity', 'Rest'],
    default: 'Mindfulness'
  },
  flexibleTarget: {
    targetDays: { type: Number, required: true, min: 1, max: 7, default: 4 },
    frequency: { type: String, enum: ['weekly'], default: 'weekly' }
  },
  plantStage: {
    type: String,
    enum: ['Seed', 'Sprout', 'Bud', 'Bloom', 'Lush Tree'],
    default: 'Seed'
  },
  color: { type: String, default: '#2D5A27' },
  isArchived: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}
```

### 2. `HabitLog` Schema (`backend/models/HabitLog.js`)
```javascript
{
  habitId: { type: Schema.Types.ObjectId, ref: 'Habit', required: true, index: true },
  date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/, index: true },
  status: { type: String, required: true, enum: ['completed', 'rest_day', 'missed'] },
  reflectionNote: { type: String, maxlength: 500, trim: true, default: '' },
  reasonTag: {
    type: String,
    enum: ['Low Energy', 'Overworked/Busy', 'Mental Health/Rest', 'Unplanned Event', 'Slept In', 'None'],
    default: 'None'
  },
  dayOfWeek: { type: Number, required: true, min: 0, max: 6 } // 0 = Sunday, 1 = Monday, ...
}
// Compound unique index ensuring 1 log per habit per date
habitLogSchema.index({ habitId: 1, date: 1 }, { unique: true });
```

---

## ⚡ 5. Structured Interaction Framework ("What Happens On Click")

### ACTION 1: Clicking "Water Habit" (Check-in as Completed)
1. **Frontend Trigger**: User clicks the water droplet button on a habit card.
2. **Optimistic UI Update**: Card immediately animates via Framer Motion; status updates to completed; weekly count increments; progress bar slides forward.
3. **API Call**: `POST /api/habits/:id/checkin` with `{ date: today, status: 'completed' }`.
4. **Backend Pipeline**: Upserts log; recalculates total completed count; triggers plant stage evolution if milestones (3, 8, 15, 25) are met.
5. **Database**: Writes `HabitLog` record, updates `Habit.plantStage`.
6. **Response**: Status 200 with new stage metrics and celebratory message. If a milestone is passed, botanical confetti triggers in the UI!
7. **UI Fallback**: If the network is interrupted, state automatically rolls back and a friendly notification alerts the user: *"Could not save progress. Reconnecting..."*

### ACTION 2: Clicking "Log Gentle Reflection" (Handling a Missed/Rest Day)
1. **Frontend Trigger**: User clicks "Log Rest" on the card or any uncompleted day on the 7-day strip.
2. **UI State**: Opens the non-judgmental modal: *"Every garden rests. What was today's rhythm?"*
3. **Form Selection**: User selects a gentle reason tag (`Low Energy`, `Mental Health/Rest`, etc.) and optionally inputs a personal note up to 500 characters.
4. **API Call**: `POST /api/habits/:id/reflect` with `{ date, status: 'rest_day', reasonTag, reflectionNote }`.
5. **Backend Pipeline**: Validates note length <= 500 chars; sanitizes string; saves log.
6. **Response**: Status 201 with *"Rest recorded. Progress preserved."*
7. **UI Visual Update**: The day indicator turns into a soothing moss-grey seed icon. Weekly streak score and plant growth remain safe.

### ACTION 3: Clicking "Weekly Rhythm" (Differentiating Feature)
1. **Frontend Trigger**: User selects the "Weekly Rhythm" navigation tab or filters by habit.
2. **API Call**: `GET /api/analytics/weekly-patterns?habitId=optionalId`.
3. **Backend Pipeline**:
   - MongoDB Aggregation Pipeline 1 groups logs by `dayOfWeek` (0–6), calculating `completionRate` and `restRate`.
   - Pipeline 2 aggregates and ranks top reason tags per weekday.
4. **UI Render**:
   - Recharts Bar Chart & Radar Canopy comparing completion % across Monday through Sunday.
   - Dynamic Compassionate Insight Cards generated by analyzing peak days, low energy days, and frequent reason tags without shaming.

### ACTION 4: Creating a Habit with Flexible Targets
1. **Frontend Trigger**: User clicks "+ Plant Habit".
2. **Form Interaction**: Sets title, category, custom botanical accent, and flexible weekly target (e.g. 4 days/week via slider).
3. **Validation**: Client-side validation + backend express-validator blocking empty titles or invalid ranges.
4. **API Call**: `POST /api/habits`.
5. **UI Render**: A fresh "Seed" card appears with entry animation and custom color accent.

---

## 🚀 6. How to Run the Project

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on `mongodb://127.0.0.1:27017` or Atlas URI in `.env`)

### Quick Start (Option A - Automatic Launchers)
- **Windows**: Double click `start-habitgarden.bat`
- **PowerShell**: Run `./start-habitgarden.ps1`

### Manual Start (Option B)

#### 1. Start the Backend API
```bash
cd backend
npm install
npm start
```
*Backend runs on `http://localhost:5000` (Health check at `http://localhost:5000/api/health`)*

#### 2. Start the Frontend App
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

#### 3. Run Automated E2E Test Suite
```bash
cd backend
node test-api.js
```

---

## 🏆 Key Features Summary
- **Zero Streak Resets**: 100% non-punitive, guilt-free architecture.
- **Differentiating Day-of-Week Behavioral Rhythm**: Mon–Sun Recharts Bar & Radar visualizations.
- **Empathetic AI Insights**: Natural language advice identifying flow states and rest patterns.
- **Botanical Gamification**: Handcrafted SVGs for Seed, Sprout, Bud, Bloom, and Lush Tree.
- **Optimistic UI with Rollback**: Instant user feedback with rock-solid server synchronization.
- **Preloaded Seed Engine**: 1-click button to load 5 diverse habits with 28 days of history.

