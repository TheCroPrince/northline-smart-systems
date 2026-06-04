import type { Metadata } from "next";

// Portal routes are demonstration/client surfaces. Keep them out of search so
// visitors discover Northline through the marketing experience first. Set on the
// layout so it is inherited by /portal and every /portal/* child route. Note: we
// intentionally do NOT disallow /portal in robots.txt — crawlers must be able to
// fetch the pages to see this noindex directive.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen">{children}</div>;
}
