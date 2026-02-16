import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { data, type } = await req.json();

    const storageDir = path.join(process.cwd(), 'storage');
    const typeDir = path.join(storageDir, type || 'runs');

    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir);
    }
    if (!fs.existsSync(typeDir)) {
      fs.mkdirSync(typeDir);
    }

    const filename = `${new Date().getTime()}.json`;
    const filepath = path.join(typeDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));

    return NextResponse.json({
      success: true,
      path: filepath,
      filename: filename
    });

  } catch (error) {
    console.error('Storage error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
