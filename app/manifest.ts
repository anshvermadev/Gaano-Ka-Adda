import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'गानों का अड्डा (Gaano Ka Adda) - Indian Music Hangout',
    short_name: 'गानों का अड्डा',
    description: 'Immersive scenic Indian audio experiences spanning 90s Nostalgia, 2000s Hits, Highway Truck Vibes, Action Cinema, Road Trips, Bollywood Lo-Fi, and Phonk.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0d0714',
    theme_color: '#12180e',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
