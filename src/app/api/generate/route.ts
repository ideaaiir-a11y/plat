import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { generateContent, AIModel } from '@/lib/ollama';

export async function POST(req: Request) {
  try {
    const { prompt, model, type } = await req.json();

    const responseText = await generateContent(prompt, model as AIModel);

    // Persist to storage
    const date = new Date().toISOString().split('T')[0];
    const storageDir = path.join(process.cwd(), 'storage', date);

    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    const entry = {
      id: Date.now(),
      type: type || 'generation',
      prompt,
      model,
      response: responseText,
      timestamp: new Date().toISOString(),
    };

    const filename = `${entry.type}_${entry.id}.json`;
    fs.writeFileSync(path.join(storageDir, filename), JSON.stringify(entry, null, 2));

    return NextResponse.json({ success: true, data: entry });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
