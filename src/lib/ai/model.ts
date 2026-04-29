import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const apiKey = process.env.OPENROUTER_API_KEY;

const openrouter = apiKey ? createOpenRouter({ apiKey }) : null;

function pickModel(envVar: string, fallback: string) {
  if (!openrouter) {
    throw new Error(
      "OPENROUTER_API_KEY is not set. Required for any LLM call.",
    );
  }
  const id = process.env[envVar] || fallback;
  return openrouter(id);
}

export const smartModel = () =>
  pickModel("LLM_MODEL_SMART", "anthropic/claude-sonnet-4.6");

export const fastModel = () =>
  pickModel("LLM_MODEL_FAST", "anthropic/claude-haiku-4.5");

export const premiumModel = () =>
  pickModel("LLM_MODEL_PREMIUM", "anthropic/claude-opus-4.7");

// Used by the signal runner when a per-step model override is set.
// Bare Anthropic-style IDs (e.g. "claude-haiku-4-5-20251001") get the
// "anthropic/" prefix so legacy signal configs keep working.
export const customModel = (id: string) => {
  if (!openrouter) {
    throw new Error(
      "OPENROUTER_API_KEY is not set. Required for any LLM call.",
    );
  }
  const normalized = id.includes("/") ? id : `anthropic/${id}`;
  return openrouter(normalized);
};
