// central state and sample data for the Flowra frontend
export const STATE = {
  user: null,
  workflows: [],
  builderSteps: [],
  builderName: "Untitled Workflow",
  builderEditingId: null,
  notifications: [],
  execLogs: [],
  teamMembers: [],
  dragSrcIndex: null,
  andreaMsgs: [],
  builderChatMsgs: [],
  builderChatOpen: false,
  currentPage: "dashboard",
  marketplaceTemplates: [],
  aiLanguage: "auto",
  debugHistory: [],
};

export const USERS = [
  {
    email: "demo@demo.com",
    password: "password123",
    name: "Demo User",
    role: "admin",
    plan: "Pro",
  },
  {
    email: "user@example.com",
    password: "test123",
    name: "Test User",
    role: "editor",
    plan: "Free",
  },
];

export const STEP_TYPES = [
  {
    type: "trigger",
    label: "Trigger",
    icon: "⚡",
    color: "#4aa06a",
    desc: "Start on event",
  },
  {
    type: "condition",
    label: "Condition",
    icon: "🔀",
    color: "#c4a444",
    desc: "Branch logic",
  },
  {
    type: "ai",
    label: "AI Action",
    icon: "🤖",
    color: "#5f84a8",
    desc: "AI processing",
  },
  {
    type: "webhook",
    label: "Webhook",
    icon: "🔔",
    color: "#FF6B35",
    desc: "Send HTTP request",
  },
  {
    type: "database",
    label: "Database",
    icon: "🗄️",
    color: "#3a8fa8",
    desc: "Read/write data",
  },
  {
    type: "transform",
    label: "Transform",
    icon: "🔧",
    color: "#8f6a7f",
    desc: "Modify data",
  },
];

export const STEP_COLORS = {
  trigger: "#4aa06a",
  condition: "#c4a444",
  ai: "#5f84a8",
  webhook: "#FF6B35",
  database: "#3a8fa8",
  transform: "#8f6a7f",
};

export function getDefaultTemplates() {
  return [
    {
      id: "tpl_001",
      name: "Lead Capture & CRM Sync",
      description:
        "Automatically capture leads from web forms and sync them to your CRM with AI enrichment and scoring.",
      category: "Sales",
      price: "free",
      rating: 4.8,
      uses: 1240,
      steps: [
        {
          type: "trigger",
          label: "Webhook Trigger",
          icon: "⚡",
          config: "POST /leads",
        },
        {
          type: "ai",
          label: "AI Lead Scoring",
          icon: "🤖",
          config: "Score 0-100",
        },
        {
          type: "database",
          label: "Save to CRM",
          icon: "🗄️",
          config: "HubSpot",
        },
        {
          type: "webhook",
          label: "Notify Slack",
          icon: "💬",
          config: "#sales-alerts",
        },
      ],
      tags: ["CRM", "Leads", "AI"],
      author: "Flowra Team",
      userPublished: false,
    },
    // ...other default templates
  ];
}

export function seedSampleData() {
  STATE.workflows = [
    {
      id: "wf_1",
      name: "Lead Nurture Pipeline",
      status: "active",
      runs: 142,
      lastRun: "2min ago",
      steps: 4,
      created: "2025-12-01",
    },
    {
      id: "wf_2",
      name: "Daily Report Generator",
      status: "active",
      runs: 30,
      lastRun: "1hr ago",
      steps: 3,
      created: "2025-12-05",
    },
    {
      id: "wf_3",
      name: "Slack Alert Bot",
      status: "draft",
      runs: 0,
      lastRun: "Never",
      steps: 2,
      created: "2025-12-10",
    },
    {
      id: "wf_4",
      name: "Customer Onboarding",
      status: "active",
      runs: 88,
      lastRun: "30min ago",
      steps: 6,
      created: "2025-11-15",
    },
  ];
  STATE.teamMembers = [
    {
      id: "u1",
      name: "Demo User",
      email: "demo@demo.com",
      role: "admin",
      joined: "Nov 2025",
      avatar: "D",
    },
    {
      id: "u2",
      name: "Alice Chen",
      email: "alice@company.com",
      role: "editor",
      joined: "Dec 2025",
      avatar: "A",
    },
    {
      id: "u3",
      name: "Bob Patel",
      email: "bob@company.com",
      role: "viewer",
      joined: "Dec 2025",
      avatar: "B",
    },
  ];
  STATE.execLogs = [
    {
      id: "l1",
      wfName: "Lead Nurture Pipeline",
      status: "success",
      duration: "1.2s",
      time: "2min ago",
      steps: 4,
    },
    {
      id: "l2",
      wfName: "Daily Report Generator",
      status: "success",
      duration: "3.4s",
      time: "1hr ago",
      steps: 3,
    },
    {
      id: "l3",
      wfName: "Customer Onboarding",
      status: "fail",
      duration: "0.8s",
      time: "2hr ago",
      steps: 6,
    },
    {
      id: "l4",
      wfName: "Lead Nurture Pipeline",
      status: "success",
      duration: "1.1s",
      time: "3hr ago",
      steps: 4,
    },
  ];
  STATE.notifications = [
    {
      id: "n1",
      type: "error",
      title: "Workflow Failed",
      body: "Customer Onboarding failed at step 3.",
      time: "2hr ago",
      read: false,
    },
    {
      id: "n2",
      type: "success",
      title: "Workflow Completed",
      body: "Daily Report Generator ran successfully.",
      time: "1hr ago",
      read: false,
    },
    {
      id: "n3",
      type: "info",
      title: "New Template Available",
      body: "Check out the new AI Support Triage template.",
      time: "3hr ago",
      read: true,
    },
  ];
  STATE.marketplaceTemplates = getDefaultTemplates();
  STATE.andreaMsgs = [
    {
      role: "assistant",
      content:
        "I'm Bruce Wayne. I've built systems that protect an entire city — now let me help you build yours. Ask me anything about workflow automation, or type a command like \"add a webhook trigger\" and I'll update your canvas directly.",
    },
  ];
}
