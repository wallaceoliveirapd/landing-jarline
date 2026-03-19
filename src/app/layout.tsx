import type { Metadata } from 'next';
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { Space_Grotesk, Instrument_Sans, Geist } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { cn } from "@/lib/utils";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-heading',
});

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ui',
});

const castleRocks = localFont({
  src: '../../public/assets/fonts/CASTLEROCKS-Bold.ttf',
  variable: '--font-display',
  weight: '700',
});

export async function generateMetadata(): Promise<Metadata> {
  let seoTitle = 'Jarline Vieira — Arquitetura e Interiores';
  let seoDescription = 'Projetos e soluções em arquitetura e interiores.';
  let ogImage = undefined;

  try {
    const seoSettings: any = await fetchQuery(api.settings.getSetting, { key: "seo" });
    if (seoSettings?.value) {
      if (seoSettings.value.title) seoTitle = seoSettings.value.title;
      if (seoSettings.value.description) seoDescription = seoSettings.value.description;
      if (seoSettings.value.ogImage) {
        const raw = seoSettings.value.ogImage;
        if (raw.startsWith("http")) {
          ogImage = raw;
        } else {
          const resolved = await fetchQuery(api.files.getImageUrl, { storageId: raw });
          ogImage = resolved ?? undefined;
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch seo settings", error);
  }

  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: ogImage ? [ogImage] : [],
    }
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={cn(spaceGrotesk.variable, instrumentSans.variable, castleRocks.variable, "font-sans", geist.variable)}>
      <body className="antialiased font-sans">
        <ConvexClientProvider>
          {children}
          <Analytics />
          <SpeedInsights />
        </ConvexClientProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
