import { NextResponse } from 'next/server';
import { generateContent, AIModel } from '@/lib/ollama';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { topic } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    console.log(`Starting pipeline for topic: ${topic}`);

    // Step 1: Explorer (qwen3:4b) - Researching the topic
    console.log('Step 1: Explorer (qwen3:4b) is researching...');
    const researchPrompt = `Research and provide 5 key interesting facts about the topic: ${topic}. Be concise.`;
    const researchData = await generateContent(researchPrompt, 'qwen3:4b');

    // Step 2: Analyzer (gemma3:latest) - Analyzing research data
    console.log('Step 2: Analyzer (gemma3:latest) is analyzing...');
    const analysisPrompt = `Analyze the following facts and identify the most engaging angle for a social media post: ${researchData}`;
    const analysisData = await generateContent(analysisPrompt, 'gemma3:latest');

    // Step 3: Reporter (llava:13b) - Generating the final post in Persian
    console.log('Step 3: Reporter (llava:13b) is writing the post...');
    const reportPrompt = `Based on the following analysis, write a professional and engaging social media post in Persian (Farsi) with relevant hashtags: ${analysisData}`;
    const reportData = await generateContent(reportPrompt, 'llava:13b');

    // Step 4: Scheduler (ideaai/hooshafza:latest) - Determining best post time
    console.log('Step 4: Scheduler (ideaai/hooshafza:latest) is scheduling...');
    const schedulePrompt = `Determine the best time of day to post this content for maximum engagement on Rubika: ${reportData}`;
    const scheduleData = await generateContent(schedulePrompt, 'ideaai/hooshafza:latest');

    // Save results to storage
    const date = new Date().toISOString().split('T')[0];
    const storageDir = path.join(process.cwd(), 'storage', date);
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    const pipelineResult = {
      id: Date.now(),
      topic,
      steps: [
        { model: 'qwen3:4b', role: 'Explorer', result: researchData },
        { model: 'gemma3:latest', role: 'Analyzer', result: analysisData },
        { model: 'llava:13b', role: 'Reporter', result: reportData },
        { model: 'ideaai/hooshafza:latest', role: 'Scheduler', result: scheduleData },
      ],
      final_post: reportData,
      scheduled_time: scheduleData,
      timestamp: new Date().toISOString(),
    };

    fs.writeFileSync(
      path.join(storageDir, `pipeline_${pipelineResult.id}.json`),
      JSON.stringify(pipelineResult, null, 2)
    );

    return NextResponse.json({
      success: true,
      data: pipelineResult
    });

  } catch (error: any) {
    console.error('Pipeline Execution Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Pipeline failed'
    }, { status: 500 });
  }
}
