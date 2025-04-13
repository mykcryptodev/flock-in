import { sendFrameNotification } from "@/app/lib/notification-client";

// Function to send a notification to a user when a request is created for them
export async function sendRequestNotification(completerFid: number, requesterUsername: string, message: string) {
  try {
    // Send the notification using MiniKit's notification system
    const result = await sendFrameNotification({
      fids: [completerFid],
      title: "New Request",
      body: `${requesterUsername} requested a video: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`,
      uuid: crypto.randomUUID(),
    });

    if (result.state === "error") {
      console.error('Failed to send notification:', result.error);
      return false;
    }

    if (result.state === "no_token") {
      console.log('User has not enabled notifications');
      return true; // Consider this a success since the user just hasn't enabled notifications
    }

    if (result.state === "rate_limit") {
      console.log('Notification rate limited');
      return true; // Consider this a success since it's just rate limited
    }

    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
} 