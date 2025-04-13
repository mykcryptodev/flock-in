type SendFrameNotificationResult =
  | {
      state: "error";
      error: unknown;
    }
  | { state: "no_token" }
  | { state: "rate_limit" }
  | { state: "success" };

export async function sendFrameNotification({
  fids,
  title,
  body,
  uuid,
}: {
  fids: number[];
  title: string;
  body: string;
  uuid: string;
}): Promise<SendFrameNotificationResult> {
  console.log({ fids, title, body, uuid });
  const appUrl = process.env.NEXT_PUBLIC_URL || "";

  try {
    const response = await fetch(`${appUrl}/api/notifications/requested`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fids,
        title,
        body,
        uuid,
      }),
    });
  
    const responseJson = await response.json();
    console.log({ responseJson });
  
    if (response.status === 200) {
      return { state: "success" };
    }
  
    if (response.status === 429) {
      return { state: "rate_limit" };
    }
  
    return { state: "error", error: responseJson };
  } catch (error) {
    return { state: "error", error };
  }
}