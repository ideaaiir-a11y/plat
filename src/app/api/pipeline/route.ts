import { NextResponse } from 'next/server';
import { generateContent, AIModel } from '@/lib/ollama';
import fs from 'fs';
import path from 'path';
import { uploadToS3 } from '@/lib/s3';

export async function POST(request: Request) {
  try {
    const { topic, count = 1, models } = await request.json();

    const explorerModel = models?.explorer || 'qwen3:4b';
    const analyzerModel = models?.analyzer || 'gemma3:latest';
    const reporterModel = models?.reporter || 'llava:13b';
    const schedulerModel = models?.scheduler || 'ideaai/hooshafza:latest';

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    console.log(`Starting pipeline for topic: ${topic}, target count: ${count}`);

    const date = new Date().toISOString().split('T')[0];
    const storageDir = path.join(process.cwd(), 'storage', 'runs', date);
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    const runId = Date.now();

    // Step 1: Search / Explorer
    console.log(`Step 1: Search using ${explorerModel}...`);
    const searchPrompt = `Find 10 recent news or interesting facts about: ${topic}. Format as a list.`;
    const searchData = await generateContent(searchPrompt, explorerModel as AIModel);

    const searchJson = JSON.stringify({ topic, data: searchData, timestamp: new Date().toISOString() }, null, 2);
    fs.writeFileSync(path.join(storageDir, `${runId}_search.json`), searchJson);
    await uploadToS3(`runs/${date}/${runId}_search.json`, searchJson, 'application/json').catch(e => console.error('S3 Upload failed for search', e));

    // Step 2: Analysis / Analyzer
    console.log(`Step 2: Analysis using ${analyzerModel}...`);
    const analysisPrompt = `Analyze these facts and extract key themes for content creation: ${searchData}`;
    const analysisData = await generateContent(analysisPrompt, analyzerModel as AIModel);

    const analysisJson = JSON.stringify({ analysis: analysisData, timestamp: new Date().toISOString() }, null, 2);
    fs.writeFileSync(path.join(storageDir, `${runId}_analysis.json`), analysisJson);
    await uploadToS3(`runs/${date}/${runId}_analysis.json`, analysisJson, 'application/json').catch(e => console.error('S3 Upload failed for analysis', e));

    // Step 3 & 4: Production & Save (llava:13b & hooshafza)
    // We'll generate the requested number of posts (up to a reasonable limit for simulation)
    const actualCount = Math.min(count, 5); // Limit to 5 for the API call to avoid huge delays
    const posts = [];

    for (let i = 0; i < actualCount; i++) {
      console.log(`Step 3: Generating post ${i + 1}/${actualCount} using ${reporterModel}...`);
      const postPrompt = `Create a unique Persian social media post (Post #${i + 1}) about: ${analysisData}`;
      const postContent = await generateContent(postPrompt, reporterModel as AIModel);

      console.log(`Step 4: Scheduling using ${schedulerModel}...`);
      const schedulePrompt = `Best time to post this content on Rubika? ${postContent}`;
      const schedule = await generateContent(schedulePrompt, schedulerModel as AIModel);

      posts.push({ id: i + 1, content: postContent, schedule });
    }

    const postsDir = path.join(process.cwd(), 'storage', 'posts', date);
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }

    const finalResult = {
      runId,
      topic,
      posts,
      stats: {
        newsCount: 10,
        postsGenerated: posts.length
      },
      timestamp: new Date().toISOString()
    };

    const finalJson = JSON.stringify(finalResult, null, 2);
    fs.writeFileSync(path.join(postsDir, `daily_posts_${runId}.json`), finalJson);
    await uploadToS3(`posts/${date}/daily_posts_${runId}.json`, finalJson, 'application/json').catch(e => console.error('S3 Upload failed for final json', e));

    // Also write a human readable txt file as seen in screenshots
    const txtContent = posts.map(p => `Post #${p.id}\n${p.content}\nSchedule: ${p.schedule}\n---\n`).join('\n');
    fs.writeFileSync(path.join(postsDir, `posts_${runId}.txt`), txtContent);
    await uploadToS3(`posts/${date}/posts_${runId}.txt`, txtContent, 'text/plain').catch(e => console.error('S3 Upload failed for txt', e));

    return NextResponse.json({
      success: true,
      data: finalResult,
      files: [
        path.join(storageDir, `${runId}_search.json`),
        path.join(storageDir, `${runId}_analysis.json`),
        path.join(postsDir, `daily_posts_${runId}.json`),
        path.join(postsDir, `posts_${runId}.txt`)
      ]
    });

  } catch (error: any) {
    console.error('Pipeline Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
