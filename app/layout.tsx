import "./theme.css";
import "@coinbase/onchainkit/styles.css";
import type { Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ToastContainer } from "react-toastify";
import { WelcomeModal } from "./components/WelcomeModal";

export const dynamic = 'force-dynamic';

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background overflow-hidden">
        <Providers>
          {children}
          <WelcomeModal />
        </Providers>
        <ToastContainer />
      </body>
    </html>
  );
}
