# MASTER CONTEXT FILE – READ THIS FIRST (updated April 2025)

This is the single source of truth for our entire backend architecture.

Current state (as of today):
- n8n is fully integrated as our workflow engine
- All automation logic lives in n8n, NOT in Express
- Express backend is ONLY a thin API gateway + webhook receiver
- Custom AI models are called via custom n8n nodes in backend/src/n8n-workflows/nodes/
- All future agents, CRM triggers, email sequences, onboarding flows → built in n8n
- VS Code + Copilot is fully configured with PROJECT_CONTEXT.md and .copilot-prompt.md

Golden Rule:
Never write business logic in Express controllers.
Always ask: "Can this be a workflow or custom node instead?" → 99% of the time the answer is YES.

Current models available in n8n custom node (OurAI-Chat-Model):
- Grok-2 (default)
- Claude-3.5-Sonnet (fallback)
- Llama-3.1-70B (long context)
- GPT-4o (premium users only)

All models are reachable via our internal AI gateway at http://ai_engine:8000/v1/chat/completions
Headers: { "X-API-Key": process.env.AI_GATEWAY_KEY }

Never expose model details to frontend. Always go through /api/workflow/run

Anyone who touches backend code MUST have PROJECT_CONTEXT.md open in VS Code at all times.

This file will be updated every time we add a new model, workflow, or architecture decision.
