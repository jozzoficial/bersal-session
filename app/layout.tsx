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
  title: 'BERSAL SESSION I — Pré-Venda Oficial | Bersal Studios',
  description:
    'Acesso antecipado exclusivo ao EP BERSAL SESSION I da Bersal Studios. 9 faixas masterizadas em alta fidelidade analógica. Garanta o EP completo ou faixas individuais.',
  keywords: [
    'Bersal Studios',
    'Bersal Session I',
    'Afro House',
    'Pré-venda EP',
    'Música Angola',
    'Multicaixa Express',
  ],
  authors: [{ name: 'Bersal Studios' }],
  openGraph: {
    title: 'BERSAL SESSION I — Pré-Venda Oficial | Bersal Studios',
    description:
      'Ouça as prévias de 30 segundos e garanta o seu acesso antecipado às 9 faixas em formato MP3 320kbps.',
    url: 'https://bersalsession.com',
    siteName: 'Bersal Studios',
    images: [
      {
        url: 'https://lh3.googleusercontent.com/aida/AEtjO1V5xlQjCaeihxIEaV0_jV7YLS0ahButBQ-K6RhDaaLRtlbW8POPAaeWJibotYFrSHA7WB0x7gXnaLZ-1HpfWT8Z7QuS0NuBzzoYnpP6F0IBXeDXxZPpX8cxwEd1788RZmdZIkoiETm5js57BHdVTcLAHRKnwiHSRm3XPkSwyJp2wohQqKOqQooR5vLHUL3xX_2UwJbymRaIaL0D9uS8lmr8WQljBth7YbPEixxDBkNesulY1E5AoGBPpJo',
        width: 1024,
        height: 1024,
        alt: 'Capa Oficial BERSAL SESSION I',
      },
    ],
    locale: 'pt_AO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BERSAL SESSION I — Pré-Venda Oficial',
    description: 'Acesso antecipado exclusivo às faixas em qualidade de estúdio analógico.',
    images: [
      'https://lh3.googleusercontent.com/aida/AEtjO1V5xlQjCaeihxIEaV0_jV7YLS0ahButBQ-K6RhDaaLRtlbW8POPAaeWJibotYFrSHA7WB0x7gXnaLZ-1HpfWT8Z7QuS0NuBzzoYnpP6F0IBXeDXxZPpX8cxwEd1788RZmdZIkoiETm5js57BHdVTcLAHRKnwiHSRm3XPkSwyJp2wohQqKOqQooR5vLHUL3xX_2UwJbymRaIaL0D9uS8lmr8WQljBth7YbPEixxDBkNesulY1E5AoGBPpJo',
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-AO" className={`${jakarta.variable} ${manrope.variable} dark`}>
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
