import type { Metadata } from 'next';
import { Space_Grotesk, Instrument_Sans, Geist } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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

export const metadata: Metadata = {
  title: 'Jarline Vieira — Arquitetura e Interiores',
  description: 'Projetos e soluções em arquitetura e interiores.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={cn(spaceGrotesk.variable, instrumentSans.variable, castleRocks.variable, "font-sans", geist.variable)}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
