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

    // Directories to search in
    const searchDirs = [
      path.join(storageRoot, 'posts'),
      path.join(storageRoot, 'runs')
    ];

    for (const rootDir of searchDirs) {
      if (!fs.existsSync(rootDir)) continue;

      const dates = fs.readdirSync(rootDir);
      for (const date of dates) {
        const dateDir = path.join(rootDir, date);
        if (fs.lstatSync(dateDir).isDirectory()) {
          const files = fs.readdirSync(dateDir);
          for (const file of files) {
            if (file.endsWith('.json')) {
              try {
                const content = fs.readFileSync(path.join(dateDir, file), 'utf-8');
                const data = JSON.parse(content);
                posts.push({
                  ...data,
                  fileName: file,
                  date: date,
                  source: path.basename(rootDir)
                });
              } catch (e) {
                console.error(`Failed to parse ${file}`, e);
              }
            }
          }
        }
      }
    }

    // Sort by timestamp if available, else by runId
    posts.sort((a, b) => {
      const timeA = new Date(a.timestamp || 0).getTime();
      const timeB = new Date(b.timestamp || 0).getTime();
      return timeB - timeA;
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('API Posts Error:', error);
    return NextResponse.json({ posts: [] });
  }
}
