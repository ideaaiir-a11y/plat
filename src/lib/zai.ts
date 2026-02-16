export interface ZAIConfig {
  apiKey: string;
  baseURL?: string;
}

export interface ZAIChatCompletionOptions {
  model: string;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  temperature?: number;
  max_tokens?: number;
}

/**
 * A lightweight wrapper for Z.ai API, mimicking the SDK interface
 */
export class ChatZAI {
  private apiKey: string;
  private baseURL: string;

  constructor(config: ZAIConfig) {
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL || 'https://api.z.ai/v1';
  }

  get chat() {
    return {
      completions: {
        create: async (options: ZAIChatCompletionOptions) => {
          const response = await fetch(`${this.baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify(options),
          });

          if (!response.ok) {
            const errorText = await response.text().catch(() => response.statusText);
            throw new Error(`Z.ai API error (${response.status}): ${errorText}`);
          }

          const data = await response.json();
          return data;
        },
      },
    };
  }
}

/**
 * Utility function to generate content using Z.ai
 */
export async function generateWithZai(prompt: string, apiKey: string, model: string = 'z-pro'): Promise<string> {
  if (!apiKey) {
    throw new Error('Z.ai API key is required');
  }

  const zai = new ChatZAI({ apiKey });
  const response = await zai.chat.completions.create({
    model,
    messages: [
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}
