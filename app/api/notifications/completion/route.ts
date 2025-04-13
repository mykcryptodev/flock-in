import { NextRequest, NextResponse } from 'next/server';
import { sendFrameNotification } from "@/app/lib/notification-client";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { requesterFid, completerUsername } = body;

    // Validate the required fields
    if (!requesterFid || !completerUsername) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send the notification using MiniKit's notification system
    const result = await sendFrameNotification({
      fids: [Number(requesterFid)],
      title: "Request Completed",
      body: `${completerUsername} has completed your video request!`,
      uuid: crypto.randomUUID(),
    });

    if (result.state === "error") {
      console.error('Failed to send completion notification:', result.error);
      return NextResponse.json(
        { error: 'Failed to send notification' },
        { status: 500 }
      );
    }

    if (result.state === "no_token") {
      console.log('User has not enabled notifications');
      return NextResponse.json(
        { message: 'User has not enabled notifications' },
        { status: 200 }
      );
    }

    if (result.state === "rate_limit") {
      console.log('Notification rate limited');
      return NextResponse.json(
        { message: 'Notification rate limited' },
        { status: 200 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in completion notification API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 