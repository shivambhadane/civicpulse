import { NextRequest, NextResponse } from 'next/server';
import { getStoredComplaints, updateComplaintStatusInStore } from '@/lib/dataStore';
import { z } from 'zod';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const complaints = getStoredComplaints();
    const complaint = complaints.find(c => c.id === id);

    if (!complaint) {
      return NextResponse.json({ success: false, error: 'Complaint not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: complaint });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error retrieving complaint';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

const updateStatusSchema = z.object({
  status: z.enum(['SUBMITTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'REJECTED']),
  message: z.string(),
  image_url: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = updateStatusSchema.parse(body);

    const updated = updateComplaintStatusInStore(id, parsed.status, parsed.message, parsed.image_url);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Complaint not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error updating complaint';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
