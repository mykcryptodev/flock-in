import { NextRequest, NextResponse } from 'next/server';

// hold idempotency key in memory
const idempotencyKeys = new Map<string, boolean>();

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { requesterAddress, completerUsername, uuid } = body;
    const idempotencyKey = uuid;

    if (idempotencyKeys.has(idempotencyKey)) {
      return NextResponse.json({ state: "duplicate" });
    }

    idempotencyKeys.set(idempotencyKey, true);

    // Validate required fields
    if (!requesterAddress || !completerUsername || !uuid) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_URL || "";
    const neynarApiKey = process.env.NEYNAR_API_KEY;

    if (!neynarApiKey) {
      console.log("neynar api key not configured");
      return NextResponse.json(
        { error: 'Neynar API key not configured' },
        { status: 500 }
      );
    }

    // First, look up the user by address using our existing endpoint
    const userResponse = await fetch(`${appUrl}/api/users/get-by-address?addresses=${requesterAddress}`);
    
    if (!userResponse.ok) {
      console.log("user lookup failed", await userResponse.text());
      return NextResponse.json(
        { error: 'Failed to look up user' },
        { status: userResponse.status }
      );
    }

    const userData = await userResponse.json();
    const users = userData.users || [];

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'No user found for address' },
        { status: 404 }
      );
    }

    // Now send the notification
    const response = await fetch("https://api.neynar.com/v2/farcaster/frame/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "application/json",
        "x-api-key": neynarApiKey,
      },
      body: JSON.stringify({
        notification: {
          title: "Request Completed!",
          body: `${completerUsername} has completed your request!`,
          target_url: `${appUrl}/?tab=requests-by-me`,
          uuid,
        },
        target_fids: [users[0].fid],
      }),
    });

    // Clone the response before reading it
    const responseClone = response.clone();
    const responseJson = await responseClone.json();

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
    console.error('Error in completion notification API:', error);
    return NextResponse.json(
      { state: "error", error: 'Internal server error' },
      { status: 500 }
    );
  }
} 