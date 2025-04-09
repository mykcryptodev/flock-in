// Function to send a notification to a user when a request is created for them
export async function sendRequestNotification(completerFid: number, requesterUsername: string, message: string) {
  try {
    // Get the Neynar API key from environment variables
    const apiKey = process.env.NEYNAR_API_KEY;
    if (!apiKey) {
      console.error('Neynar API key is not configured');
      return false;
    }

    // Prepare the notification payload
    const notification = {
      title: "New Request",
      body: `${requesterUsername} requested a video: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`,
      target_url: "https://flock-in.vercel.app", // URL to the requests page
    };

    // Send the notification to the completer
    const response = await fetch('https://api.neynar.com/v2/farcaster/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_key': apiKey,
      },
      body: JSON.stringify({
        target_fid: completerFid,
        notification,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to send notification:', errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
} 