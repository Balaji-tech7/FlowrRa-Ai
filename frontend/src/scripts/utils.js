// general utility functions used throughout the app
export function escHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
export function escAttr(s) {
  return String(s)
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
export function tick(ms) { return new Promise(r=>setTimeout(r,ms)); }

export function normaliseType(t) {
  const map={trigger:"trigger",webhook:"webhook",condition:"condition",ai:"ai",database:"database",transform:"transform",action:"webhook",notification:"webhook",filter:"condition",delay:"transform",loop:"transform",email:"webhook",slack:"webhook",http:"webhook",api:"webhook",schedule:"trigger",timer:"trigger",crm:"database",storage:"database"};
  return map[(t||"").toLowerCase()]||"webhook";
}
export function pickIcon(label,type) {
  const l=(label||"").toLowerCase();
  const rules=[[/webhook|http|api/,"⚡"],[/schedule|timer|cron|daily|hour/,"⏰"],[/form|submit/,"📋"],[/order|shopify/,"🛒"],[/payment|stripe|invoice/,"💳"],[/email|gmail|mail/,"📧"],[/slack/,"💬"],[/sms|twilio|text/,"📱"],[/notif|alert|admin/,"🔔"],[/database|db|mysql|mongo|postgres/,"🗄️"],[/crm|hubspot|salesforce/,"👥"],[/ai|gpt|openai|claude|llm/,"🤖"],[/condition|check|branch|if|valid/,"🔀"],[/transform|format|convert|map/,"🔧"],[/delay|wait|pause/,"⏱️"],[/log|audit/,"📝"],[/inventory|stock/,"📦"],[/tag|label|mark/,"🏷️"],[/task|ticket|jira/,"✅"],[/delivery|ship/,"🚚"],[/calendar|event/,"📅"],[/content|writ|blog/,"✍️"]/];
  for(const [re,ic] of rules) if(re.test(l)) return ic;
  const ti={trigger:"⚡",webhook:"🔔",condition:"🔀",ai:"🤖",database:"🗄️",transform:"🔧"};
  return ti[type]||"⚙️";
}
