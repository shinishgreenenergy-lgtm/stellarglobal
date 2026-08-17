import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/lib/brand";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: `${BRAND.product} — ${BRAND.tagline} | ${BRAND.company}`,
  description: `${BRAND.product} is ${BRAND.descriptor} from ${BRAND.company}. 312 automations pull evidence from your cloud, identity, ticketing and HR systems, test every control on a schedule, and map one result to every framework you carry.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="bg-marshal-bg text-marshal-text min-h-full">{children}</body>
    </html>
  );
}
