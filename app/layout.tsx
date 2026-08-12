import './globals.css';
import type { Metadata, Viewport } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: {
    default: 'गानों का अड्डा (Gaano Ka Adda) - Immersive Indian Audio Experiences',
    template: '%s | गानों का अड्डा',
  },
  description:
    'गानों का अड्डा (Gaano Ka Adda) - The ultimate Indian music hangout spot. Step into 7 immersive scenic musical eras spanning 90s Village Nostalgia, 2000s Bollywood Romance, Highway Truck Vibes, Action Cinema, Late Night Road Trips, Bollywood Lo-Fi, and Phonk.',
  keywords: [
    'Gaano Ka Adda',
    'गानों का अड्डा',
    'Tractor Waala',
    'ट्रैक्टर वाला',
    '90s Bollywood Songs',
    'Indian Nostalgia Music',
    '90s Hindi Music Player',
    'Indian Village Lo-Fi',
    '2000s Bollywood Hits',
    'Highway Truck Songs',
    'Dhurandhar Soundtrack',
    'Bollywood Long Drive Playlist',
    'Bollywood Slowed and Reverb',
    'Brazilian Phonk Drift Mix',
  ],
  authors: [{ name: 'Gaano Ka Adda' }],
  creator: 'Gaano Ka Adda',
  publisher: 'Gaano Ka Adda',
  openGraph: {
    title: 'गानों का अड्डा (Gaano Ka Adda) - Immersive Indian Audio Experiences',
    description:
      'The ultimate Indian music hangout spot across 7 musical eras: 90s Village Nostalgia, 2000s Romance, Highway Truck Vibes, Action Cinema, Late Night Road Trips, Bollywood Lo-Fi, and Phonk.',
    siteName: 'Gaano Ka Adda',
    locale: 'hi_IN',
    alternateLocale: ['en_IN'],
    type: 'website',
    images: [
      {
        url: '/image.png',
        width: 1200,
        height: 630,
        alt: 'Gaano Ka Adda - Immersive Indian Audio Experiences',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'गानों का अड्डा (Gaano Ka Adda) - Immersive Indian Audio Experiences',
    description:
      'The ultimate Indian music hangout spot across 7 musical eras - 90s village nostalgia, classic golden hits, and ambient vibes.',
    images: ['/image.png'],
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
  themeColor: '#12180e',
};

const rootJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'गानों का अड्डा (Gaano Ka Adda)',
  alternateName: ['Gaano Ka Adda', 'GaanoKaAdda'],
  description:
    'Immersive Indian musical experiences spanning 90s Village Nostalgia, 2000s Romance, Highway Truck Vibes, Action Cinema, Late Night Road Trips, Bollywood Lo-Fi, and Phonk.',
  hasPart: [
    {
      '@type': 'WebPage',
      name: 'ट्रैक्टर वाला (90s Village Nostalgia)',
      url: '/',
    },
    {
      '@type': 'WebPage',
      name: 'सदाबहार 2000s (Bollywood Romance Classics)',
      url: '/2000s',
    },
    {
      '@type': 'WebPage',
      name: 'ट्रक वाला (Highway Road Trip Express)',
      url: '/truck',
    },
    {
      '@type': 'WebPage',
      name: 'धुरंधर (Action Cinema Soundtrack)',
      url: '/dhurandhar',
    },
    {
      '@type': 'WebPage',
      name: 'लॉन्ग ड्राइव (Late Night Road Trip Anthems)',
      url: '/long-drive',
    },
    {
      '@type': 'WebPage',
      name: 'लो-फाई लव (Bollywood Lofi Love Songs)',
      url: '/lofi',
    },
    {
      '@type': 'WebPage',
      name: 'PHONK / FUNK (Brazilian Phonk & Drift Beats)',
      url: '/phonk',
    },
  ],
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
        <link rel="manifest" href="/manifest.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootJsonLd) }}
        />
      </head>
      <body className="bg-[#12180e] text-cream antialiased select-none overflow-hidden fixed inset-0">
        {children}
      </body>
    </html>
  );
}
