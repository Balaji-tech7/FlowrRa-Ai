// wrapper for Anthropic calls
export async function callAnthropic({
  system,
  messages,
  model = "claude-sonnet-4-20250514",
  max_tokens = 500,
}) {
  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, max_tokens, system, messages }),
    });
    const data = await resp.json();
    return data;
  } catch (err) {
    console.warn("anthropic request failed", err);
    throw err;
  }
}
