import { NextResponse } from 'next/server';
import { sendMessageToRubika } from '@/lib/rubika';

export async function POST(request: Request) {
  try {
    const { token, chatId, text } = await request.json();

    if (!token || !chatId || !text) {
      return NextResponse.json({ success: false, error: 'Token, Chat ID, and Text are required' }, { status: 400 });
    }

    const result = await sendMessageToRubika(token, chatId, text);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error: any) {
    console.error('Rubika API Route Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
