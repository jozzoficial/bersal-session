import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Manrope } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AudioProvider } from '@/context/AudioContext';

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
});

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://bersalsession.com'),
  title: {
    default: 'BERSAL SESSION I — Pré-Venda Oficial | Bersal Studios',
    template: '%s | Bersal Studios',
  },
  description:
    'Acesso antecipado exclusivo ao EP BERSAL SESSION I da Bersal Studios em Uíge, Angola. 9 faixas masterizadas em alta fidelidade analógica. Garanta o EP completo ou faixas individuais.',
  keywords: [
    'Bersal Studios',
    'Bersal Session I',
    'Afro House Angola',
    'Música Angolana',
    'Uíge',
    'Pré-venda EP',
    'Produtora Uíge',
    'Multicaixa Express',
    'T-Beats',
  ],
  authors: [{ name: 'Bersal Studios', url: 'https://bersalsession.com' }],
  creator: 'Bersal Studios',
  publisher: 'Bersal Studios',
  applicationName: 'BERSAL SESSION I',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/img/logo.jpeg', type: 'image/jpeg' },
      { url: '/favicon.ico' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      { url: '/img/logo.jpeg', sizes: '180x180', type: 'image/jpeg' },
    ],
  },
  openGraph: {
    title: 'BERSAL SESSION I — Pré-Venda Oficial | Bersal Studios',
    description:
      'Acesso antecipado exclusivo às 9 faixas masterizadas em alta fidelidade. Ouça as prévias de 30 segundos e garanta já o seu exemplar.',
    url: 'https://bersalsession.com',
    siteName: 'Bersal Studios',
    locale: 'pt_AO',
    type: 'website',
    images: [
      {
        url: '/img/cover.jpeg',
        width: 1200,
        height: 1200,
        alt: 'Capa Oficial BERSAL SESSION I — Bersal Studios',
      },
      {
        url: '/img/logo.jpeg',
        width: 512,
        height: 512,
        alt: 'Logotipo Oficial Bersal Studios',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BERSAL SESSION I — Pré-Venda Oficial | Bersal Studios',
    description:
      'Acesso antecipado exclusivo às 9 faixas masterizadas em alta fidelidade analógica. Bersal Studios · Uíge, Angola.',
    images: ['/img/cover.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://bersalsession.com',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MusicAlbum',
  name: 'BERSAL SESSION I',
  byArtist: {
    '@type': 'MusicGroup',
    name: 'Bersal Studios',
    url: 'https://bersalsession.com',
    locationCreated: {
      '@type': 'Place',
      name: 'Uíge, Angola',
    },
  },
  genre: ['Afro House', 'Instrumental', 'Electronic'],
  numTracks: 9,
  image: 'https://bersalsession.com/img/cover.jpeg',
  description: 'EP BERSAL SESSION I — Pré-venda oficial por Bersal Studios em Uíge, Angola.',
  offers: {
    '@type': 'Offer',
    price: '3000',
    priceCurrency: 'AOA',
    availability: 'https://schema.org/PreOrder',
    url: 'https://bersalsession.com/comprar',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-AO" className={`${jakarta.variable} ${manrope.variable} dark`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#09090f] text-[#ddd9f5] min-h-screen flex flex-col antialiased selection:bg-[#7c52ff]/30 selection:text-[#a77fff]">
        <AudioProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AudioProvider>
      </body>
    </html>
  );
}
