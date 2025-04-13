import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { fids, title, body: notificationBody, uuid } = body;

    // Validate required fields
    if (!fids || !Array.isArray(fids) || !title || !notificationBody || !uuid) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_URL || "";
    const neynarApiKey = process.env.NEYNAR_API_KEY;

    if (!neynarApiKey) {
      return NextResponse.json(
        { error: 'Neynar API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.neynar.com/v2/farcaster/frame/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "application/json",
        "x-api-key": neynarApiKey,
      },
      body: JSON.stringify({
        notification: {
          title,
          body: notificationBody,
          target_url: appUrl,
          uuid,
        },
        target_fids: fids,
      }),
    });

    const responseJson = await response.json();

    if (response.status === 200) {
      return NextResponse.json({ state: "success" });
    }

    if (response.status === 429) {
      return NextResponse.json({ state: "rate_limit" });
    }

    return NextResponse.json(
      { state: "error", error: responseJson },
      { status: response.status }
    );

  } catch (error) {
    console.error('Error in notification API:', error);
    return NextResponse.json(
      { state: "error", error: 'Internal server error' },
      { status: 500 }
    );
  }
}
