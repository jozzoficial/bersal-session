import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Finalizar Compra — BERSAL SESSION I',
  description:
    'Garanta o seu acesso antecipado ao EP BERSAL SESSION I ou faixas individuais por Multicaixa Express. Bersal Studios · Uíge, Angola.',
  openGraph: {
    title: 'Finalizar Compra — BERSAL SESSION I | Bersal Studios',
    description:
      'Garanta o seu acesso antecipado ao EP BERSAL SESSION I ou faixas avulsas por Multicaixa Express.',
    url: 'https://bersalsession.com/comprar',
    images: ['/img/cover.jpeg'],
  },
};

export default function ComprarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
