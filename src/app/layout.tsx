import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { auth0 } from "@/lib/auth0";
import AuthProviderWrapper from "@/components/auth/AuthProviderWrapper";
import ServiceWorkerRegistration from "@/components/pwa/ServiceWorkerRegistration";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "CarTrackr",
  description:
    "Track fuel costs, maintenance, and parts for your vehicles.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CarTrackr",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1e3a8a",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session = null;
  if (auth0) {
    try {
      session = await auth0.getSession();
    } catch {
      // Stale/invalid session cookie — ignore so the page still renders
    }
  }

  return (
    <html lang="en" className={`${jakarta.variable} h-full`}>
      <body className="h-full font-sans">
        <AuthProviderWrapper user={session?.user ?? undefined}>
          <ServiceWorkerRegistration />
          {children}
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
