import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Northline Smart Systems",
    template: "%s · Northline Smart Systems",
  },
  description: "Smart systems. Designed to disappear.",
  metadataBase: new URL("https://northline.example"),
  openGraph: {
    title: "Northline Smart Systems",
    description: "Smart systems. Designed to disappear.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-bg-0 text-text-hi antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-surface focus:px-4 focus:py-2 focus:text-text-hi focus:shadow-[var(--shadow-2)]"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
