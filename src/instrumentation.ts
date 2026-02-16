export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const cron = await import('node-cron');
    const { generateContent } = await import('@/lib/ollama');
    const fs = await import('fs');
    const path = await import('path');

    console.log('Registering Cron Jobs...');

    // The specific schedule from memory: '20/1 2 * 1 3'
    // Note: Node-cron might have different interpretation of some non-standard crons.
    // We'll use it as provided.
    cron.schedule('20/1 2 * 1 3', async () => {
      console.log('Running scheduled generation task...');
      try {
        const prompt = "Generate a daily automated post for Rubika channel about technology trends.";
        const responseText = await generateContent(prompt, 'ideaai/hooshafza:latest');

        const date = new Date().toISOString().split('T')[0];
        const storageDir = path.join(process.cwd(), 'storage', date);
        if (!fs.existsSync(storageDir)) {
          fs.mkdirSync(storageDir, { recursive: true });
        }

        const entry = {
          id: Date.now(),
          type: 'cron_generation',
          prompt,
          model: 'ideaai/hooshafza:latest',
          response: responseText,
          timestamp: new Date().toISOString(),
        };

        fs.writeFileSync(
          path.join(storageDir, `cron_${entry.id}.json`),
          JSON.stringify(entry, null, 2)
        );
        console.log('Scheduled task completed successfully.');
      } catch (error) {
        console.error('Scheduled task failed:', error);
      }
    });
  }
}
