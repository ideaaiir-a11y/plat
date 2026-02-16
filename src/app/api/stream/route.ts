import { NextResponse } from 'next/server';

// In-memory stream state (for simulation)
let isStreaming = false;

export async function POST(request: Request) {
  try {
    const { action } = await request.json();

    if (action === 'start') {
      console.log('Starting RTMP Stream with settings:');
      console.log(`URL: ${process.env.STREAM_URL}`);
      console.log(`Key: ${process.env.STREAM_KEY?.substring(0, 10)}...`);
      console.log(`Resolution: ${process.env.STREAM_WIDTH}x${process.env.STREAM_HEIGHT}`);
      console.log(`Bitrate: ${process.env.STREAM_BITRATE}`);

      // Simulation of launching FFmpeg
      isStreaming = true;
      return NextResponse.json({ success: true, message: 'Stream started' });
    } else {
      console.log('Stopping RTMP Stream...');
      isStreaming = false;
      return NextResponse.json({ success: true, message: 'Stream stopped' });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ isStreaming });
}
