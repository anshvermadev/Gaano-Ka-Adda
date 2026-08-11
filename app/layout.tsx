import './globals.css';
import type { Metadata, Viewport } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'गानों का अड्डा (Gaano Ka Adda) - Immersive Indian Audio Experiences',
  description:
    'गानों का अड्डा (Gaano Ka Adda) - The ultimate Indian music hangout spot. Step into immersive scenic musical eras, starting with Tractor Waala (90s Village Nostalgia), classic Bollywood hits, and ambient village atmosphere.',
  keywords: [
    'Gaano Ka Adda',
    'गानों का अड्डा',
    'Tractor Waala',
    'ट्रैक्टर वाला',
    '90s Bollywood Songs',
    'Indian Nostalgia',
    '90s Hindi Music Player',
    'Indian Village Lo-Fi',
    'Retro Hindi Music',
    '2000s Bollywood Hits'
  ],
  authors: [{ name: 'Gaano Ka Adda' }],
  creator: 'Gaano Ka Adda',
  openGraph: {
    title: 'गानों का अड्डा (Gaano Ka Adda) - Immersive Indian Audio Experiences',
    description:
      'The ultimate Indian music hangout spot. A cinematic musical journey across Indian eras - starting with 90s Village Nostalgia, vintage red tractor, and timeless golden classics.',
    siteName: 'Gaano Ka Adda',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'गानों का अड्डा (Gaano Ka Adda) - Immersive Indian Audio Experiences',
    description:
      'The ultimate Indian music hangout spot across Indian eras - 90s village nostalgia, classic golden hits, and ambient vibes.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="hi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Gotu&family=Outfit:wght@300;400;500;600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Rozha+One&family=Tiro+Devanagari+Hindi:ital@0;1&family=Yatra+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#12180e] text-cream antialiased select-none overflow-hidden fixed inset-0">
        {children}
      </body>
    </html>
  );
}
