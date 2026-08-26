import { NextRequest, NextResponse } from 'next/server';
import { supportComplaintInStore } from '@/lib/dataStore';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updated = supportComplaintInStore(id);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Complaint not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        complaint_id: updated.id,
        supporters_count: updated.supporters_count,
        updated_at: updated.updated_at,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error supporting complaint';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
