import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Galeria Exclusiva — BERSAL SESSION I',
  description:
    'Fotos e bastidores oficiais da gravação e produção do projeto BERSAL SESSION I em Uíge, Angola.',
  openGraph: {
    title: 'Galeria Exclusiva — BERSAL SESSION I | Bersal Studios',
    description:
      'Confira os bastidores e fotos exclusivas da produção do EP BERSAL SESSION I.',
    url: 'https://bersalsession.com/galeria',
    images: ['/img/cover.jpeg'],
  },
};

export default function GaleriaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
