import { NextResponse } from 'next/server';
import { generateContent, AIModel } from '@/lib/ollama';
import fs from 'fs';
import path from 'path';
import { uploadToS3 } from '@/lib/s3';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic, count = 1, models, batch, linked = false } = body;

    const explorerModel = models?.explorer || 'qwen3:4b';
    const analyzerModel = models?.analyzer || 'gemma3:latest';
    const reporterModel = models?.reporter || 'llava:13b';
    const schedulerModel = models?.scheduler || 'ideaai/hooshafza:latest';

    if (!topic && !batch) {
      return NextResponse.json({ error: 'Topic or batch is required' }, { status: 400 });
    }

    // Process either a single topic or a batch
    const itemsToProcess = batch ? batch : [{ topic }];
    console.log(`Starting pipeline for ${itemsToProcess.length} items. Linked: ${linked}`);

    const date = new Date().toISOString().split('T')[0];
    const storageDir = path.join(process.cwd(), 'storage', 'runs', date);
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    const runId = Date.now();
    const posts = [];
    let previousPostContent = "";

    for (let itemIdx = 0; itemIdx < itemsToProcess.length; itemIdx++) {
      const currentItem = itemsToProcess[itemIdx];
      const currentTopic = currentItem.topic || currentItem.title || topic;

      console.log(`Processing item ${itemIdx + 1}/${itemsToProcess.length}: ${currentTopic}`);

      // Step 1: Search / Explorer
      console.log(`Step 1: Search using ${explorerModel}...`);
      const searchPrompt = `Research and find detailed and interesting facts about "${currentTopic}". Focus on quality for social media. Present as a list.`;
      const searchData = await generateContent(searchPrompt, explorerModel as AIModel);

      const searchJson = JSON.stringify({ topic: currentTopic, data: searchData, timestamp: new Date().toISOString() }, null, 2);
      fs.writeFileSync(path.join(storageDir, `${runId}_${itemIdx}_search.json`), searchJson);
      await uploadToS3(`runs/${date}/${runId}_${itemIdx}_search.json`, searchJson, 'application/json').catch(e => console.error('S3 Upload failed for search', e));

      // Step 2: Analysis / Analyzer
      console.log(`Step 2: Analysis using ${analyzerModel}...`);
      const analysisPrompt = `به عنوان تحلیلگر، داده‌های زیر را بررسی کرده و تم‌های جذاب برای روبیکا استخراج کنید.
      داده‌ها: ${searchData}`;
      const analysisData = await generateContent(analysisPrompt, analyzerModel as AIModel);

      const analysisJson = JSON.stringify({ analysis: analysisData, timestamp: new Date().toISOString() }, null, 2);
      fs.writeFileSync(path.join(storageDir, `${runId}_${itemIdx}_analysis.json`), analysisJson);
      await uploadToS3(`runs/${date}/${runId}_${itemIdx}_analysis.json`, analysisJson, 'application/json').catch(e => console.error('S3 Upload failed for analysis', e));

      // Step 3: Production (Linked logic)
      console.log(`Step 3: Generating post using ${reporterModel}...`);
      let postPrompt = `با استفاده از تحلیل زیر، یک پست حرفه‌ای برای روبیکا بنویسید.
      تحلیل: ${analysisData}`;

      if (linked && previousPostContent) {
        postPrompt += `\n\nنکته مهم: این پست باید در ادامه و مرتبط با پست قبلی باشد تا یک زنجیره محتوایی ایجاد شود.
        محتوای پست قبلی برای حفظ پیوستگی: ${previousPostContent.substring(0, 500)}...`;
      }

      const postContent = await generateContent(postPrompt, reporterModel as AIModel);
      previousPostContent = postContent;

      // Step 4: Scheduling
      console.log(`Step 4: Scheduling using ${schedulerModel}...`);
      const schedulePrompt = `بهترین زمان انتشار برای این پست در روبیکا چیست؟ فقط زمان و دلیل کوتاه به فارسی.
      پست: ${postContent}`;
      const schedule = await generateContent(schedulePrompt, schedulerModel as AIModel);

      posts.push({
        id: posts.length + 1,
        topic: currentTopic,
        content: postContent,
        schedule,
        linked: linked && itemIdx > 0
      });
    }

    const postsDir = path.join(process.cwd(), 'storage', 'posts', date);
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }

    const finalResult = {
      runId,
      topic: batch ? "Batch Processing" : topic,
      posts,
      stats: {
        itemsProcessed: itemsToProcess.length,
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
        path.join(postsDir, `daily_posts_${runId}.json`),
        path.join(postsDir, `posts_${runId}.txt`)
      ]
    });

  } catch (error: any) {
    console.error('Pipeline Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
