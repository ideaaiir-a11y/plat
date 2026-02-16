import { NextResponse } from 'next/server';

const OLLAMA_URL = 'http://localhost:11434/api';

export async function POST(req: Request) {
  try {
    const { action, name } = await req.json();

    if (action === 'push') {
      const response = await fetch(`${OLLAMA_URL}/push`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, stream: false }),
      });
      const data = await response.json();
      return NextResponse.json({ success: true, data });
    }

    if (action === 'pull') {
      const response = await fetch(`${OLLAMA_URL}/pull`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, stream: false }),
      });
      const data = await response.json();
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' });
  } catch (error) {
    console.error('Model API error:', error);
    return NextResponse.json({ success: false, error: 'Ollama service unavailable' }, { status: 503 });
  }
}

export async function GET() {
  try {
    const response = await fetch(`${OLLAMA_URL}/tags`);
    const data = await response.json();
    return NextResponse.json({ success: true, models: data.models });
  } catch (error) {
    return NextResponse.json({ success: false, models: [] });
  }
}
