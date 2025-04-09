import { NextRequest, NextResponse } from 'next/server';

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
const NEYNAR_API_URL = 'https://api.neynar.com/v2/farcaster/notifications';

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

    // Get the API key from environment variables
    if (!NEYNAR_API_KEY) {
      return NextResponse.json(
        { error: 'Neynar API key is not configured' },
        { status: 500 }
      );
    }

    // Prepare the notification payload
    const notification = {
      title: "Request Completed",
      body: `${completerUsername} has completed your video request!`,
      target_url: "https://flock-in.vercel.app", // URL to the requests page
    };

    // Send the notification to the requester
    const response = await fetch(NEYNAR_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_key': NEYNAR_API_KEY,
      },
      body: JSON.stringify({
        target_fid: requesterFid,
        notification,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to send completion notification:', errorData);
      return NextResponse.json(
        { error: 'Failed to send notification' },
        { status: response.status }
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