import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const storageRoot = path.join(process.cwd(), 'storage');
    if (!fs.existsSync(storageRoot)) {
      return NextResponse.json({ posts: [] });
    }

    const posts: any[] = [];
    const dates = fs.readdirSync(storageRoot);

    for (const date of dates) {
      const dateDir = path.join(storageRoot, date);
      if (fs.lstatSync(dateDir).isDirectory()) {
        const files = fs.readdirSync(dateDir);
        for (const file of files) {
          if (file.endsWith('.json')) {
            const content = fs.readFileSync(path.join(dateDir, file), 'utf-8');
            posts.push(JSON.parse(content));
          }
        }
      }
    }

    return NextResponse.json({ posts: posts.sort((a, b) => b.id - a.id) });
  } catch (error) {
    return NextResponse.json({ posts: [] });
  }
}
