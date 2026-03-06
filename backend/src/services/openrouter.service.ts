// backend/src/services/openrouter.service.ts
import fetch from "node-fetch";
import { broadcastToUser } from "../ws";
import config from "../config";

// Pricing per 1K tokens (USD)
const PRICE_PER_1K_TOKENS: Record<string, { input: number; output: number }> = {
  "openai/gpt-4": { input: 0.03, output: 0.06 },
  "openai/gpt-4-turbo": { input: 0.01, output: 0.03 },
  "anthropic/claude-3.5-sonnet": { input: 0.003, output: 0.015 },
  "anthropic/claude-3-haiku": { input: 0.00025, output: 0.00125 },
  "meta-llama/llama-3.1-70b-instruct": { input: 0.00059, output: 0.00079 },
  "meta-llama/llama-3.1-8b-instruct": { input: 0.00004, output: 0.00004 },
};

export interface OpenRouterStreamOpts {
  model: string;
  messages: Array<{ role: string; content: string }>;
  userId: string;
  streamId: string;
  temperature?: number;
  max_tokens?: number;
  transforms?: string[];
}

interface OpenRouterStreamChunk {
  id: string;
  model: string;
  choices: Array<{
    delta: { content?: string; role?: string };
    finish_reason: string | null;
    index: number;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenRouterService {
  private static instance: OpenRouterService;
  private activeStreams: Map<string, AbortController> = new Map();
  private activeStreamModels: Map<string, string> = new Map();

  static getInstance(): OpenRouterService {
    if (!OpenRouterService.instance) {
      OpenRouterService.instance = new OpenRouterService();
    }
    return OpenRouterService.instance;
  }

  async startAIStream(opts: OpenRouterStreamOpts): Promise<void> {
    const {
      model,
      messages,
      userId,
      streamId,
      temperature = 0.7,
      max_tokens = 1000,
      transforms = ["middle-out"],
    } = opts;

    if (!config.openRouterKey) {
      throw new Error("OpenRouter API key not configured");
    }

    const controller = new AbortController();
    this.activeStreams.set(streamId, controller);
    this.activeStreamModels.set(streamId, model);

    let outputTokens = 0;
    let inputTokens = 0;
    let fullResponse = "";
    let hasReceivedUsage = false;

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.openRouterKey}`,
            "HTTP-Referer": config.siteUrl || "http://localhost:8000",
            "X-Title": "FlowRai AI Automation",
          },
          body: JSON.stringify({
            model,
            messages,
            stream: true,
            temperature,
            max_tokens,
            transforms,
            include_usage: true,
          }),
          signal: controller.signal as any,
        },
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
      }

      if (!response.body) {
        throw new Error("No response body from OpenRouter");
      }

      broadcastToUser(userId, {
        type: "ai.stream_start",
        streamId,
        model,
        timestamp: new Date().toISOString(),
      });

      const reader = (response.body as any).getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.trim() === "") continue;

          if (line === "data: [DONE]") {
            this.handleStreamComplete(
              userId,
              streamId,
              model,
              fullResponse,
              inputTokens,
              outputTokens,
            );
            return;
          }

          if (line.startsWith("data: ")) {
            try {
              const chunk: OpenRouterStreamChunk = JSON.parse(line.slice(6));

              // Handle content delta — guard against undefined choice
              const choice = chunk.choices?.[0];
              if (choice?.delta?.content) {
                const content = choice.delta.content;
                fullResponse += content;

                if (!hasReceivedUsage) {
                  outputTokens += this.estimateTokens(content);
                }

                broadcastToUser(userId, {
                  type: "ai.token",
                  streamId,
                  chunk: content,
                  timestamp: new Date().toISOString(),
                });
              }

              // Handle usage data
              if (chunk.usage) {
                hasReceivedUsage = true;
                inputTokens = chunk.usage.prompt_tokens;
                outputTokens = chunk.usage.completion_tokens;

                const cost = this.calculateCost(
                  model,
                  inputTokens,
                  outputTokens,
                );

                broadcastToUser(userId, {
                  type: "ai.usage",
                  streamId,
                  prompt_tokens: inputTokens,
                  completion_tokens: outputTokens,
                  total_tokens: chunk.usage.total_tokens,
                  cost,
                  timestamp: new Date().toISOString(),
                });
              }

              // Handle finish reason — guard against undefined choice
              if (choice?.finish_reason) {
                this.handleStreamComplete(
                  userId,
                  streamId,
                  model,
                  fullResponse,
                  inputTokens,
                  outputTokens,
                  choice.finish_reason,
                );
              }
            } catch (parseError) {
              console.warn("Failed to parse SSE chunk:", line);
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        broadcastToUser(userId, {
          type: "ai.stream_cancelled",
          streamId,
          timestamp: new Date().toISOString(),
        });
      } else {
        console.error("OpenRouter stream error:", error);
        broadcastToUser(userId, {
          type: "ai.error",
          streamId,
          message: error.message,
          timestamp: new Date().toISOString(),
        });
      }
    } finally {
      this.activeStreams.delete(streamId);
      this.activeStreamModels.delete(streamId);
    }
  }

  private handleStreamComplete(
    userId: string,
    streamId: string,
    model: string,
    fullResponse: string,
    inputTokens: number,
    outputTokens: number,
    finishReason: string = "stop",
  ): void {
    const totalCost = this.calculateCost(model, inputTokens, outputTokens);

    broadcastToUser(userId, {
      type: "ai.stream_complete",
      streamId,
      finish_reason: finishReason,
      fullResponse,
      totalTokens: inputTokens + outputTokens,
      totalCost,
      timestamp: new Date().toISOString(),
    });
  }

  stopStream(streamId: string): boolean {
    const controller = this.activeStreams.get(streamId);
    if (controller) {
      controller.abort();
      this.activeStreams.delete(streamId);
      this.activeStreamModels.delete(streamId);
      return true;
    }
    return false;
  }

  getActiveStreams(userId: string): string[] {
    return Array.from(this.activeStreams.keys()).filter((id) =>
      id.startsWith(`${userId}-`),
    );
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  calculateCost(
    model: string,
    inputTokens: number,
    outputTokens: number,
  ): number {
    const pricing = PRICE_PER_1K_TOKENS[model];
    if (!pricing) {
      console.warn(
        `No pricing for model "${model}", falling back to gpt-4 pricing`,
      );
      const fallback = PRICE_PER_1K_TOKENS["openai/gpt-4"]!;
      return (
        (inputTokens * fallback.input + outputTokens * fallback.output) / 1000
      );
    }
    return (inputTokens * pricing.input + outputTokens * pricing.output) / 1000;
  }

  async getAvailableModels(): Promise<any> {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        Authorization: `Bearer ${config.openRouterKey}`,
        "HTTP-Referer": config.siteUrl || "http://localhost:3000",
        "X-Title": "FlowRai AI Automation",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }

    return response.json();
  }
}

export const openRouterService = OpenRouterService.getInstance();
