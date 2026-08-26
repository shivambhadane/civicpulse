import { NextRequest, NextResponse } from 'next/server';
import { findNearbyComplaintsFromStore } from '@/lib/dataStore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const latStr = searchParams.get('lat');
    const lngStr = searchParams.get('lng');
    const radiusStr = searchParams.get('radius');

    if (!latStr || !lngStr) {
      return NextResponse.json({ success: false, error: 'lat and lng parameters are required' }, { status: 400 });
    }

    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    const radius = radiusStr ? parseFloat(radiusStr) : 300; // 300m default as approved in architecture audit

    const nearby = findNearbyComplaintsFromStore(lat, lng, radius);

    return NextResponse.json({
      success: true,
      count: nearby.length,
      data: nearby,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error fetching nearby complaints';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
