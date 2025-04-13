import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, phone } = await req.json();

    return NextResponse.json(
      { message: 'Reset instructions sent' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 