const OLLAMA_URL = 'http://localhost:11434/api/generate';

export type AIModel = 'qwen3:4b' | 'gemma3:latest' | 'llava:13b' | 'ideaai/hooshafza:latest';

export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

export async function generateContent(prompt: string, model: AIModel = 'gemma3:latest'): Promise<string> {
  try {
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
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data: OllamaResponse = await response.json();
    return data.response;
  } catch (error) {
    console.error('Ollama Generation Error:', error);
    throw error;
  }
}
