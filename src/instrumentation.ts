export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const cron = await import('node-cron');
    const fs = await import('fs');
    const path = await import('path');

    console.log('Registering Cron Jobs...');

    // The specific schedule from memory: '20/1 2 * 1 3'
    // This cron will trigger the full content pipeline.
    cron.schedule('20/1 2 * 1 3', async () => {
      console.log('Running scheduled pipeline task...');
      try {
        // We simulate a request to the pipeline
        const topic = "Technology and AI Trends";

        // We can't easily call our own API route internally without a full URL,
        // so we'll import the logic or just use a fetch to localhost if the server is up.
        // For instrumentation, it's safer to use the lib functions directly.
        const { generateContent } = await import('@/lib/ollama');

        // Step 1: Explorer
        const research = await generateContent(`Research 5 tech trends about ${topic}`, 'qwen3:4b');
        // Step 2: Analyzer
        const analysis = await generateContent(`Analyze these trends: ${research}`, 'gemma3:latest');
        // Step 3: Reporter
        const post = await generateContent(`Write a Persian post about: ${analysis}`, 'llava:13b');
        // Step 4: Scheduler
        const schedule = await generateContent(`Best time to post this: ${post}`, 'ideaai/hooshafza:latest');

        const date = new Date().toISOString().split('T')[0];
        const storageDir = path.join(process.cwd(), 'storage', date);
        if (!fs.existsSync(storageDir)) {
          fs.mkdirSync(storageDir, { recursive: true });
        }

        const entry = {
          id: Date.now(),
          type: 'scheduled_pipeline',
          topic,
          results: { research, analysis, post, schedule },
          timestamp: new Date().toISOString(),
        };

        fs.writeFileSync(
          path.join(storageDir, `cron_pipeline_${entry.id}.json`),
          JSON.stringify(entry, null, 2)
        );
        console.log('Scheduled pipeline completed successfully.');
      } catch (error) {
        console.error('Scheduled pipeline failed:', error);
      }
    });
  }
}
