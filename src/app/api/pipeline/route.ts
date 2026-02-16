import { NextResponse } from 'next/server';

const OLLAMA_URL = 'http://localhost:11434/api/generate';

async function callOllama(model: string, prompt: string) {
  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) throw new Error(`Ollama error: ${response.statusText}`);
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error(`Error calling Ollama model ${model}:`, error);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const { config } = await req.json();
    const results = [];

    // Stage 1: Explorer (qwen3:4b) - Generating Titles
    const explorerPrompt = "Generate 5 interesting and trending scientific/tech news titles in Persian. Return only the titles, one per line.";
    const explorerResponse = await callOllama(config.explorer || 'qwen3:4b', explorerPrompt);

    // Fallback if Ollama is not available
    const titles = explorerResponse
      ? explorerResponse.split('\n').filter((t: string) => t.trim().length > 0).slice(0, 5)
      : [
          "کشف حیات در اعماق اقیانوس‌های مشتری",
          "پیشرفت خیره‌کننده در محاسبات کوانتومی",
          "تراشه‌های بیومتریک جدید و آینده امنیت",
          "انرژی هسته‌ای پاک: رویایی که به حقیقت پیوست",
          "هوش مصنوعی و بازآفرینی هنرهای باستانی"
        ];

    for (const title of titles) {
      // Stage 2: Analyzer (gemma3:latest) - Analyzing and Translating
      const analyzerPrompt = `Analyze this title and provide a short summary and key points in Persian: ${title}`;
      const analysis = await callOllama(config.analyzer || 'gemma3:latest', analyzerPrompt) || `تحلیل تخصصی برای عنوان "${title}" در حال آماده‌سازی است. این خبر نشان‌دهنده تحول بزرگی در حوزه علم و فناوری است.`;

      // Stage 3: Reporter (llava:13b) - Generating Full Content
      const reporterPrompt = `Create a full social media post in Persian based on this analysis: ${analysis}. Include emojis and a professional tone.`;
      const content = await callOllama(config.reporter || 'llava:13b', reporterPrompt) || `🚀 خبر فوری: ${title}\n\n${analysis}\n\n#تکنولوژی #علم #آینده`;

      // Stage 4: Scheduler (ideaai/hooshafza:latest) - Refinement and Scheduling
      const schedulerPrompt = `Refine this post for maximum engagement and suggest a refined Persian title: ${content}`;
      const refinement = await callOllama(config.scheduler || 'ideaai/hooshafza:latest', schedulerPrompt) || title;

      results.push({
        id: Math.random().toString(36).substr(2, 9),
        originalTitle: title,
        refinedTitle: refinement.split('\n')[0] || title,
        content: content,
        analysis: analysis,
        scheduleTime: new Date(Date.now() + Math.random() * 86400000).toISOString(),
        status: 'scheduled'
      });
    }

    return NextResponse.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Pipeline error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
