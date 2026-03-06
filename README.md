# 🚀 Flowra — Speak It. Build It. Automate It.

> "Tell Flowra what to automate — it builds the workflow for you, in any language, in seconds."

---

## 🌍 Problem Statement

Every day, teams across the world waste thousands of hours on repetitive, manual digital tasks:

- Manually routing emails and support tickets
- Copy-pasting data between CRM tools, spreadsheets, and databases
- Sending the same Slack alerts over and over
- Processing orders, updating inventory, and notifying fulfillment by hand
- Onboarding customers through multi-step processes that nobody has automated yet

Existing automation platforms like Zapier, Make, or n8n are either:

- Too expensive for small teams and indie developers
- Too technical for non-engineers who just want something to work
- Too rigid — they force users to learn a proprietary visual language before automating anything

The result? Powerful automation stays in the hands of a small technical minority — while the rest of the world keeps doing things manually.

---

## 💡 Solution

Flowra is an AI-first, browser-based workflow automation platform that lets anyone — from a developer to a small business owner — build, manage, and deploy intelligent automation pipelines in seconds, using nothing but natural language.

### What makes Flowra different?

| Traditional Tools | Flowra |
|---|---|
| Learn a proprietary UI | Just describe it in plain language |
| English-only interfaces | Works in 12+ languages including Tamil, Hindi, Arabic |
| Separate tools for devs vs. non-devs | Dual-mode: Pro canvas + AI-first Simple mode |
| Need to know which steps to add | AI generates the entire workflow for you |
| No AI assistant to guide you | An AI agent that controls your canvas |
| Expensive SaaS subscriptions | Zero-dependency, open, deployable anywhere |

Flowra is not just an automation tool — it is an AI co-pilot for your business operations.

---

## ✨ Key Features

### 🤖 AI Copilot — Natural Language to Workflow
- Describe any automation in plain text and the AI instantly builds the full step-by-step workflow on the canvas
- Supports 12+ languages — English, Tamil, Hindi, Spanish, French, German, Chinese, Japanese, Korean, Arabic, Portuguese, Russian
- Predefined prompt chips for the most common automation patterns
- Real-time execution log showing the AI's reasoning as it constructs each step
- Offline fallback parser so basic workflows still generate even without API access

### 🦇 Bruce Wayne — Conversational Canvas Agent
- An embedded AI chat agent that directly controls the workflow canvas via conversation
- Add steps, clear the canvas, get suggestions, or build entire workflows — all through chat
- Canvas-aware: every message includes the current step context so the agent always knows your state
- Quick-command chips: Add Trigger, Lead Workflow, Suggest Next, Clear Canvas

### 🏗️ Visual Drag-and-Drop Workflow Builder
- Six step types: Trigger, Condition, AI Action, Webhook, Database, Transform
- Drag from the palette, reorder by dragging cards, configure inline — no code required
- Named workflows saved to state and editable at any time
- Undo support for AI-generated changes

### 🌗 Dual-Mode Interface
- Pro Mode (dark, developer-focused) — full canvas, step palette, and advanced configuration
- Simple Mode (light, AI-first) — clean UI built for non-technical users where AI does the heavy lifting
- One-click toggle with smooth animated transition; preference persisted across sessions

### 🛒 Template Marketplace
- Pre-built, production-ready workflow templates across Sales, Marketing, E-Commerce, Support, and DevOps
- Free and paid tiers with community-published templates from other users
- One-click Use Template to load directly into the builder
- Publish your own workflows and share with the community

### 🐛 AI Code Debugger
- Paste any code snippet in JS, Python, TypeScript, Go, Rust, Java, PHP, or SQL and get AI analysis
- Returns structured output: Errors, Warnings, Optimizations, and Fixed Code
- One-click Apply Fix copies the corrected code directly into the editor
- Q&A mode: ask follow-up questions about the code with full context retained

### 📊 Live Dashboard and Analytics
- Real-time stats: total workflows, active automations, runs today, and success rate
- Execution log with status, duration, and step count per run
- Notification centre with unread badge and categorised alerts

### 👥 Team Management
- Invite team members with role-based access: Admin, Editor, Viewer
- View all members, join dates, and roles at a glance

### 📱 Fully Responsive
- Mobile-first design with a dedicated top bar, hamburger drawer, and bottom navigation bar
- Complete feature parity across desktop and mobile

---

## 🧠 How It Works

### End-to-End System Flow

```
User Input (Natural Language / UI Action)
        │
        ▼
┌──────────────────────────────┐
│      Flowra Frontend SPA     │  ← HTML + CSS + Vanilla JS
│  ┌─────────────────────────┐ │
│  │  Mode Router (Pro/Simple)│ │  ← CSS class toggle + localStorage
│  │  Page Router (SPA)      │ │  ← navigateTo() — zero-reload routing
│  │  STATE Manager          │ │  ← In-memory reactive state object
│  └─────────────────────────┘ │
└──────────────┬───────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
    ▼                     ▼
[UI Interaction]    [AI Prompt Input]
Drag, click,        Copilot panel or
configure step      Bruce Wayne chat
    │                     │
    │              ┌──────▼──────────────────────┐
    │              │   Anthropic Claude API       │
    │              │   claude-sonnet-4-20250514   │
    │              │                              │
    │              │  System prompt injects:      │
    │              │  • Current canvas state      │
    │              │  • Step type definitions     │
    │              │  • Language preference       │
    │              │  • User's natural language   │
    │              └──────────────────────────────┘
    │                          │
    │                 JSON Response Parsed:
    │                 { steps[], reasoning,
    │                   workflowName, canvasUpdate }
    │                          │
    └──────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│     Canvas Renderer          │
│  renderBuilderSteps()        │  ← Stateful step cards with
│  • Generates step card HTML  │    drag-drop, expand, edit
│  • Animates connectors       │
│  • Updates STATE[]           │
└──────────────────────────────┘
               │
               ▼
┌──────────────────────────────┐
│     Output / Action          │
│  • Workflow saved to state   │
│  • Toast notification shown  │
│  • Log entry created         │
│  • Template publishable      │
└──────────────────────────────┘
```

### AI Copilot — Step by Step

1. User types a natural language description, for example: "When a new Shopify order arrives, check inventory, if low notify admin on Slack, otherwise send the customer a receipt email"
2. Flowra constructs a system prompt containing the step type schema, current canvas state, and selected language
3. Claude API processes the prompt and returns a structured JSON object with steps, reasoning, and a workflow name
4. The response parser validates and normalises each step, assigning icons and colors by type
5. The canvas renderer re-renders the full step list with entrance animations
6. The execution log updates with the AI's reasoning and a success entry
7. If the API is unavailable, the local fallback parser uses regex pattern matching to generate a sensible workflow client-side with zero downtime

### Bruce Wayne Agent — Step by Step

1. User sends a chat message, for example: "Add a webhook trigger step"
2. The message plus the full serialised canvas state is sent to Claude as context
3. Claude responds with a natural language reply and a structured canvas update command
4. Flowra parses the command and mutates STATE.builderSteps[] directly
5. The canvas re-renders instantly and the message is appended to conversation history

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FLOWRA APPLICATION                       │
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌───────────────────┐  │
│  │   Auth Layer │    │  SPA Router  │    │   Mode System     │  │
│  │  (Login gate)│    │ navigateTo() │    │  Pro <-> Simple   │  │
│  └──────────────┘    └──────────────┘    └───────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                      PAGE MODULES                        │   │
│  │                                                          │   │
│  │  Dashboard  |  Builder   |  Workflows  |  Marketplace    │   │
│  │  Analytics  |  Publish   |  Team       |  Debugger       │   │
│  │  Settings   |  Notifications           |  Bruce Wayne    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────┐   ┌──────────────────────────┐  │
│  │     STATE MANAGER          │   │     DESIGN SYSTEM        │  │
│  │  • workflows[]             │   │  • CSS Custom Properties  │  │
│  │  • builderSteps[]          │   │  • Glassmorphism cards    │  │
│  │  • execLogs[]              │   │  • Dual theme tokens      │  │
│  │  • marketplaceTemplates[]  │   │  • Responsive breakpoints │  │
│  │  • notifications[]         │   │  • Keyframe animations    │  │
│  └────────────────────────────┘   └──────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  AI INTEGRATION LAYER                    │   │
│  │                                                          │   │
│  │  ┌─────────────────┐  ┌───────────────┐  ┌───────────┐  │   │
│  │  │  AI Copilot      │  │  Bruce Wayne  │  │ Debugger  │  │   │
│  │  │  runCopilot      │  │  builderAsk   │  │ runDebug  │  │   │
│  │  │  Prompt()        │  │  Bruce()      │  │ askDebug  │  │   │
│  │  └────────┬─────────┘  └──────┬────────┘  └─────┬─────┘  │   │
│  │           └───────────────────┴────────────────┘         │   │
│  └───────────────────────────────┬───────────────────────────┘  │
└───────────────────────────────────┼──────────────────────────────┘
                                    │
                                    ▼
                    ┌──────────────────────────┐
                    │   Anthropic Claude API    │
                    │  claude-sonnet-4-20250514 │
                    │  /v1/messages endpoint    │
                    └──────────────────────────┘
```

### Key Architectural Decisions

- Single HTML file — Zero build tooling, zero dependencies, instantly portable and deployable anywhere
- In-memory STATE object — Reactive single source of truth; all renders derive from state mutations
- CSS custom property theming — Full dual-theme swap via a single body class toggle with no JavaScript repainting required
- Local fallback AI parser — Regex-based workflow generator ensures the builder works even when the Claude API is unreachable
- Canvas-aware AI prompts — Every Claude call includes the serialised current canvas state, making responses context-accurate and non-destructive

---

## 🛠️ Tech Stack

### Frontend
- HTML5 — Application structure and semantic markup
- CSS3 with Custom Properties — Design system, dual theming, animations
- Vanilla JavaScript ES2020+ — All application logic, state management, and routing
- Google Fonts: Syne, DM Sans, JetBrains Mono — Typography system
- Native HTML5 Drag and Drop API — Step palette and canvas reordering

### AI and Intelligence
- Anthropic Claude claude-sonnet-4-20250514 — Workflow generation, canvas control, code debugging
- Claude /v1/messages REST API — Direct browser-to-API fetch calls
- Local Fallback Parser — Regex-based offline workflow generation
- Multi-language prompt engineering — 12-language natural language understanding

### Architecture Patterns
- Single-Page Application — Zero-reload navigateTo() router
- In-memory state management — Centralised STATE object
- CSS variable theming — Design token system for dual modes
- Glassmorphism UI — backdrop-filter with layered transparency
- Progressive enhancement — Works without AI, works without a backend

### Third-Party Integrations Referenced
Slack, Gmail, Shopify, HubSpot, Zendesk, SendGrid, AWS S3, Stripe, WordPress, ShipStation, Google Calendar, PostgreSQL

---

## 📂 Project Structure

```
flowra/
│
├── Flowra-2.html                    # Complete application — single file
│   │
│   ├── <style>                      # Full CSS design system
│   │   ├── :root {}                 # Design tokens — Pro Mode
│   │   ├── body.mode-simple {}      # Design tokens — Simple Mode override
│   │   ├── Component styles         # Glass cards, buttons, badges, builder
│   │   ├── AI Copilot panel         # Resizable panel and status indicators
│   │   ├── Mobile responsive        # Top bar, drawer, bottom navigation
│   │   └── @keyframes               # fadeIn, breathe, waveBar, stepIn
│   │
│   ├── <body>                       # Application HTML
│   │   ├── #login-screen            # Animated auth gate
│   │   └── #main-app                # App shell
│   │       ├── #mobile-topbar       # Mobile header
│   │       ├── #mobile-drawer       # Slide-in navigation
│   │       ├── #sidebar             # Desktop navigation + mode toggle
│   │       ├── #page-dashboard      # Stats, logs, notifications
│   │       ├── #page-builder        # Canvas + palette + Copilot + Bruce Wayne
│   │       ├── #page-workflows      # Workflow list table
│   │       ├── #page-templates      # Marketplace grid
│   │       ├── #page-publish        # Template submission form
│   │       ├── #page-analytics      # Execution analytics
│   │       ├── #page-team           # Member management
│   │       ├── #page-andrea         # Bruce Wayne standalone chat
│   │       ├── #page-debugger       # AI Code Debugger
│   │       ├── #page-settings       # User preferences
│   │       ├── #flora-footer        # Status bar and language selector
│   │       └── #toast-container     # Floating notification toasts
│   │
│   └── <script>                     # Application logic
│       ├── STATE {}                 # Global reactive state object
│       ├── Auth                     # doLogin(), doLogout()
│       ├── Router                   # navigateTo(), page renderers
│       ├── Mode System              # applyMode(), localStorage persist
│       ├── Builder Engine           # renderBuilderSteps(), drag/drop, save
│       ├── AI Copilot               # runCopilotPrompt() — Claude API
│       ├── Bruce Wayne Agent        # builderAskBruce(), sendBuilderChat()
│       ├── Marketplace              # renderMarketplace(), filterMarketplace()
│       ├── Publish Flow             # publishTemplate(), updatePublishPreview()
│       ├── Analytics                # renderAnalytics(), renderTeam()
│       ├── Code Debugger            # runDebugger(), askDebugger() — Claude API
│       ├── Notifications            # updateNotifBadge(), renderNotifPanel()
│       ├── Toast System             # showToast()
│       ├── Local Fallback           # localFallbackParse(), normaliseType()
│       ├── Copilot Resize           # initCopilotResize() — drag handle
│       └── Helpers                  # tick(), escHtml(), escAttr()
│
└── README.md
```

---

## ⚙️ Installation & Setup

Flowra requires no build tools, no npm, and no server. It runs entirely in the browser.

### Step 1 — Clone the Repository

```bash
git clone https://github.com/your-username/flowra.git
cd flowra
```

### Step 2 — Open in Browser

```bash
# macOS
open Flowra-2.html

# Linux
xdg-open Flowra-2.html

# Windows
start Flowra-2.html
```

### Step 3 — Or Serve Locally

```bash
# Python
python3 -m http.server 8080

# Node.js
npx serve .
```

Then open `http://localhost:8080/Flowra-2.html` in your browser.

### Step 4 — Configure the AI API Key

Open `Flowra-2.html` in a code editor. Find all `fetch("https://api.anthropic.com/v1/messages"` calls and add your key to the request headers:

```javascript
headers: {
  "Content-Type": "application/json",
  "x-api-key": "sk-ant-YOUR_KEY_HERE",
  "anthropic-version": "2023-06-01"
}
```

Get your API key at console.anthropic.com under API Keys.

Note: If no API key is configured, Flowra still works. The local fallback parser generates workflows from pattern matching without any API call.

### Step 5 — Log In

| Email | Password | Role |
|---|---|---|
| demo@demo.com | password123 | Admin — Pro Plan |
| user@example.com | test123 | Editor — Free Plan |

---

## 🎯 Hackathon Impact

### Real-World Relevance

Workflow automation is a multi-billion dollar market growing rapidly — yet the majority of small businesses, freelancers, and non-technical professionals are locked out of it. Flowra democratises automation by replacing complex visual editors with something everyone already knows how to use: natural conversation.

### What Makes Flowra Innovative

Language is the interface. Most automation tools make users learn a new visual grammar. Flowra flips this — users speak naturally, and the AI translates intent into structured logic instantly.

12-language AI support. This is not a translation layer bolted on after the fact. Flowra's AI Copilot natively understands prompts in Tamil, Hindi, Arabic, and 9 other languages — making it accessible to billions of people who have never been served by English-only SaaS tools.

Three distinct AI modes, one coherent product. The AI Copilot builds workflows. Bruce Wayne controls the canvas through conversation. The Debugger fixes code. Each is a distinct AI capability, yet they all share the same context model and feel like one integrated assistant.

Dual-mode UX without compromise. Pro Mode gives developers complete control. Simple Mode removes every piece of complexity for non-technical users. One codebase, one toggle, two completely different experiences — a UX pattern no other automation tool has implemented.

Zero-dependency, zero-infrastructure. The entire platform ships as a single HTML file. No webpack, no React, no backend, no database. This proves that sophisticated AI-integrated software does not require sprawling infrastructure to deliver real value.

### Who Benefits

- Small businesses can automate customer workflows without hiring developers
- Non-English speakers can build automations in their native language for the first time
- Developers get an AI pair programmer for workflow design and code debugging
- Teams can collaborate on shared automations via the template marketplace

---

## 🔮 Future Improvements

- Backend API and database for persistent workflows and real user accounts
- Live execution engine that actually calls Slack, Gmail, Shopify, and other services
- OAuth login with Google and GitHub plus JWT session management
- Incoming webhook endpoints per workflow hosted on a backend server
- Cron and schedule-based workflow triggering with a job queue
- Streaming Claude API responses for real-time token-by-token output
- Node-graph visual canvas with branching and parallel execution paths
- Workflow version history with diff view and rollback
- Real-time multi-user collaborative canvas using WebSockets
- Stripe integration for paid marketplace template purchases
- React Native mobile app for monitoring and triggering workflows on the go
- Plugin system for third-party step type extensions

---

## 👨‍💻 Contributors

| Name | Role |
|---|---|
| Your Name | Full-Stack Development, AI Integration, UI/UX Design |

Built during [Hackathon Name] · [Date]

---

## 📜 License

MIT License

Copyright (c) 2025 Flowra

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

Flowra — Automation for Everyone, in Every Language

Built in [X] hours · Powered by Anthropic Claude · Zero dependencies
