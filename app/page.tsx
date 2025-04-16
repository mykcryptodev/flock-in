import { Metadata } from "next";
import ClientPage from "./client-page";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL;
  const urlSearchParams = new URLSearchParams();
  const fid = searchParams?.fid;
  
  if (fid) {
    urlSearchParams.set('fid', fid?.toString());
  }
  
  const imageUrl = `${URL}/api/frame?${urlSearchParams.toString()}`;

  return {
    title: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
    description:
      "Flock In lets you pay for videos from your favorite farcaster creators!",
    other: {
      "fc:frame": JSON.stringify({
        version: process.env.NEXT_PUBLIC_VERSION,
        imageUrl,
        button: {
          title: `Launch ${process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME}`,
          action: {
            type: "launch_frame",
            name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
            url: URL,
            splashImageUrl: process.env.NEXT_PUBLIC_SPLASH_IMAGE_URL,
            splashBackgroundColor: `#${process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR}`,
          },
        },
      }),
    },
  };
}

export default function Page() {
  return <ClientPage />;
}
