import { Track, EpSettings } from './types';

export const DEFAULT_PAYMENT = {
  multicaixa_express: process.env.NEXT_PUBLIC_PAYMENT_MULTICAIXA_EXPRESS || '941160814',
  entidade: process.env.NEXT_PUBLIC_PAYMENT_ENTIDADE || '10116',
  referencia: process.env.NEXT_PUBLIC_PAYMENT_REFERENCIA || '941160814',
};

export const DEFAULT_EP_SETTINGS: EpSettings = {
  id: 1,
  title: 'BERSAL SESSION I',
  produtora: 'Bersal Studios',
  tagline: 'Uma imersão sonora e texturas cinemáticas gravadas em alta resolução valvulada.',
  cover_url: '/img/cover.jpeg',
  full_ep_price_kz: 3500,
  // 5 dias à frente por padrão para contagem decrescente ativa
  release_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000).toISOString(),
  payment_multicaixa_express: DEFAULT_PAYMENT.multicaixa_express,
  payment_entidade: DEFAULT_PAYMENT.entidade,
  payment_referencia: DEFAULT_PAYMENT.referencia,
};

export const INITIAL_TRACKS: Track[] = [
  {
    id: 'track-01',
    track_number: 1,
    title: 'Mansony : Formato',
    duration_seconds: 180,
    preview_url: '/audio/track1_preview.mp3',
    price_kz: 500,
    description: 'Faixa 1',
    is_featured: false,
  },
  {
    id: 'track-02',
    track_number: 2,
    title: 'Chainz & Fago : Batota',
    duration_seconds: 180,
    preview_url: '/audio/track2_preview.mp3',
    price_kz: 500,
    description: 'Faixa 2',
    is_featured: false,
  },
  {
    id: 'track-03',
    track_number: 3,
    title: 'Mief e The real I essei',
    duration_seconds: 180,
    preview_url: '/audio/track3_preview.mp3',
    price_kz: 500,
    description: 'Faixa 3',
    is_featured: false,
  },
  {
    id: 'track-04',
    track_number: 4,
    title: 'Edy Correia : Contra o vento',
    duration_seconds: 180,
    preview_url: '/audio/track4_preview.mp3',
    price_kz: 500,
    description: 'Faixa 4',
    is_featured: false,
  },
  {
    id: 'track-05',
    track_number: 5,
    title: 'Vilar x Iam Boss : Ecossimba',
    duration_seconds: 180,
    preview_url: '/audio/track5_preview.mp3',
    price_kz: 500,
    description: 'Faixa 5',
    is_featured: false,
  },
  {
    id: 'track-06',
    track_number: 6,
    title: 'Beezy Bhau x Danger Blackson  : Ás de copa',
    duration_seconds: 180,
    preview_url: '/audio/track6_preview.mp3',
    price_kz: 500,
    description: 'Faixa 6',
    is_featured: false,
  },
  {
    id: 'track-07',
    track_number: 7,
    title: 'Edy Correia x Igolias x Enny B : Habla tudo',
    duration_seconds: 180,
    preview_url: '/audio/track7_preview.mp3',
    price_kz: 500,
    description: 'Faixa 7',
    is_featured: false,
  },
  {
    id: 'track-08',
    track_number: 8,
    title: 'Keren dos Santos : Progulema',
    duration_seconds: 180,
    preview_url: '/audio/track8_preview.mp3',
    price_kz: 500,
    description: 'Faixa 8',
    is_featured: false,
  },
  {
    id: 'track-09',
    track_number: 9,
    title: 'Flappy : Bolingó',
    duration_seconds: 180,
    preview_url: '/audio/track9_preview.mp3',
    price_kz: 500,
    description: 'Faixa 9',
    is_featured: false,
  },
];

export function formatKz(val: number): string {
  return new Intl.NumberFormat('pt-AO', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(val) + ' Kz';
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
