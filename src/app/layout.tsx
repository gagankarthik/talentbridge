import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
// Editorial display serif for large marketing statements only
const display = Newsreader({ variable: "--font-newsreader", subsets: ["latin"], weight: ["300", "400"], style: ["normal", "italic"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} | Pre-vetted engineers in 48 hours`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: ["IT staffing", "contract staffing", "contract-to-hire", "staff augmentation", "pre-vetted engineers", "staffing agency partnerships", "technical vetting"],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: "/",
    title: `${SITE_NAME} | Pre-vetted engineers in 48 hours`,
    description: SITE_DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: `${SITE_NAME} | Pre-vetted engineers in 48 hours`, description: SITE_DESCRIPTION },
  robots: { index: true, follow: true },
  formatDetection: { telephone: true, email: true },
};

export const viewport: Viewport = {
  themeColor: "#071a14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${display.variable} h-full`}>
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
