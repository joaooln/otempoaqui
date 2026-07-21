import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'O Tempo Aqui - Previsão do Tempo no Acre',
    short_name: 'O Tempo Aqui',
    description: 'Portal de previsão do tempo, boletins diários e análises meteorológicas do Acre mantido pelo meteorologista Davi Friale.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#0284c7',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
