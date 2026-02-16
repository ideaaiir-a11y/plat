import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  // Simple hardcoded check for the demo/admin panel
  if (username === 'admin@rubika.ir' && password === 'admin123') {
    return NextResponse.json({ success: true, token: 'mock-jwt-token' });
  }

  return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
}
