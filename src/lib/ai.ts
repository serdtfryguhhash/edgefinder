/**
 * EdgeFinder — AI Client powered by Anthropic Claude SDK
 *
 * Uses Claude claude-sonnet-4-20250514 for trading strategy analysis and market commentary.
 */

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
const MODEL = "claude-sonnet-4-20250514";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function chat(
  messages: ChatMessage[],
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<string> {
  try {
    // Extract system messages and pass them separately (Anthropic API requirement)
    const systemMessages = messages.filter((m) => m.role === "system");
    const nonSystemMessages = messages.filter((m) => m.role !== "system");

    const systemPrompt = systemMessages.map((m) => m.content).join("\n\n");

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: options.maxTokens ?? 2048,
      temperature: options.temperature ?? 0.7,
      ...(systemPrompt ? { system: systemPrompt } : {}),
      messages: nonSystemMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const textBlock = response.content.find((block) => block.type === "text");
    return textBlock?.text ?? "No response generated.";
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      throw new Error(`Anthropic API error: ${error.status} — ${error.message}`);
    }
    throw error;
  }
}

/** Analyze a trading strategy and provide insights */
export async function analyzeStrategy(strategy: {
  name: string;
  description: string;
  indicators: string[];
  timeframe: string;
  market: string;
}): Promise<string> {
  return chat([
    {
      role: "system",
      content: `You are EdgeFinder's strategy analysis engine. Analyze the trading strategy
      and provide insights on its strengths, weaknesses, ideal market conditions,
      risk profile, and potential improvements. Be objective and data-driven.
      Note: This is educational analysis, not financial advice.`,
    },
    {
      role: "user",
      content: `Analyze this trading strategy: ${JSON.stringify(strategy)}`,
    },
  ]);
}

/** Explain a technical indicator */
export async function explainIndicator(indicator: string): Promise<string> {
  return chat([
    {
      role: "system",
      content: `You are a technical analysis educator. Explain the indicator in clear terms:
      what it measures, how to interpret it, common settings, and how traders use it
      in real strategies. Include practical examples.`,
    },
    {
      role: "user",
      content: `Explain the ${indicator} indicator for a trader looking to use it in their strategy.`,
    },
  ]);
}

/** Generate market commentary */
export async function generateMarketCommentary(market: string): Promise<string> {
  return chat([
    {
      role: "system",
      content: `You are a market analyst for EdgeFinder. Provide concise market commentary
      covering: current trend, key levels, momentum, volume analysis, and what
      traders should watch for. Be specific with price levels and timeframes.
      Note: For educational purposes only, not trading advice.`,
    },
    {
      role: "user",
      content: `Provide market commentary for ${market}.`,
    },
  ]);
}

export async function checkAIStatus(): Promise<{ available: boolean; model: string; error?: string }> {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return { available: false, model: MODEL, error: "ANTHROPIC_API_KEY is not set" };
    }
    return { available: true, model: MODEL };
  } catch {
    return { available: false, model: MODEL, error: "Failed to initialize Anthropic client" };
  }
}
