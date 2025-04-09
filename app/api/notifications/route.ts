import { NextRequest, NextResponse } from 'next/server';
import { sendRequestNotification } from '@/app/services/notifications';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { completerFid, requesterUsername, message } = body;

    // Validate the required fields
    if (!completerFid || !requesterUsername || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send the notification
    const success = await sendRequestNotification(
      Number(completerFid),
      requesterUsername,
      message
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to send notification' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in notification API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 