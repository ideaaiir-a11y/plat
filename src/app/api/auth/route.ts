import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  // Simple check using environment variables or defaults
  const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin@rubika.ir';
  const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin123';

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return NextResponse.json({ success: true, token: 'mock-jwt-token' });
  }

  return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
}
