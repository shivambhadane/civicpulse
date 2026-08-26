import { NextResponse } from 'next/server';
import { INITIAL_CATEGORIES } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: INITIAL_CATEGORIES,
  });
}
