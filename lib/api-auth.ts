import { NextResponse } from 'next/server';
import { getAuthUserId } from '@/lib/auth';

export async function requireAuth(): Promise<{ userId: string } | NextResponse> {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return { userId };
}

export function isUnauthorized(result: { userId: string } | NextResponse): result is NextResponse {
  return result instanceof NextResponse;
}
