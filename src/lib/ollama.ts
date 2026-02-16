const OLLAMA_URL = 'http://localhost:11434/api/generate';

export type AIModel = string;

export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

/**
 * Generates content using Ollama.
 * Includes a long timeout (30 minutes) to account for large models and slow hardware.
 */
import { Agent } from 'undici';

const agent = new Agent({
  headersTimeout: 1800000, // 30 minutes
  bodyTimeout: 1800000,    // 30 minutes
  connectTimeout: 60000,   // 1 minute
});

export async function generateContent(prompt: string, model: AIModel = 'gemma3:latest'): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1800000); // 30 minutes timeout

  try {
    // @ts-ignore - dispatcher is a valid property in undici-enhanced fetch
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
      }),
      signal: controller.signal,
      dispatcher: agent,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      throw new Error(`Ollama API error (${response.status}): ${errorText}`);
    }

    const data: OllamaResponse = await response.json();
    return data.response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.error(`Ollama Generation Timeout for model ${model}`);
      throw new Error(`Ollama Generation Timeout for model ${model} after 30 minutes`);
    }
    console.error(`Ollama Generation Error (${model}):`, error);
    throw error;
  }
}
