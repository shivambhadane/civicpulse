import { NextResponse } from 'next/server';
import { getStoredHotspots } from '@/lib/dataStore';

export async function GET() {
  try {
    const hotspots = getStoredHotspots();
    return NextResponse.json({
      success: true,
      count: hotspots.length,
      data: hotspots,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error fetching hotspots';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
