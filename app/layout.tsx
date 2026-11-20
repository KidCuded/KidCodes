import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { THEME_INIT_SCRIPT } from "@/app/components/wall/theme";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kid-codes.vercel.app"),
  title: {
    default: "Akid — Software Engineer",
    template: "%s · Akid — Software Engineer",
  },
  description: "Portfolio of Akid, a Software Engineer based in Kuala Lumpur.",
  openGraph: {
    title: "Akid — Software Engineer",
    description: "Portfolio of Akid, a Software Engineer based in Kuala Lumpur.",
    url: "/",
    siteName: "Akid — Software Engineer",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the theme script may set data-room-theme before React hydrates.
    <html lang="en" className={`${plusJakartaSans.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-room-wall text-ink font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
