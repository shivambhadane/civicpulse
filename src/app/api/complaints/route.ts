import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getStoredComplaints, addComplaintToStore } from '@/lib/dataStore';

const createComplaintSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  latitude: z.number(),
  longitude: z.number(),
  location_name: z.string(),
  category_id: z.string().optional(),
  department_id: z.string().optional(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  image_urls: z.array(z.string()).optional(),
  ai_category: z.string().optional(),
  ai_department: z.string().optional(),
  ai_confidence: z.number().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category_id = searchParams.get('category_id');
    const status = searchParams.get('status');

    let complaints = getStoredComplaints();

    if (category_id && category_id !== 'all') {
      complaints = complaints.filter(c => c.category_id === category_id || c.category?.slug === category_id);
    }

    if (status && status !== 'all') {
      if (status === 'open') {
        complaints = complaints.filter(c => c.status !== 'RESOLVED' && c.status !== 'REJECTED');
      } else if (status === 'resolved') {
        complaints = complaints.filter(c => c.status === 'RESOLVED');
      } else {
        complaints = complaints.filter(c => c.status === status);
      }
    }

    return NextResponse.json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch complaints';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createComplaintSchema.parse(body);

    const complaint = addComplaintToStore(parsed);

    return NextResponse.json(
      {
        success: true,
        data: complaint,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid complaint payload';
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
