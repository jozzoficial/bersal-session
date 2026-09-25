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
  full_ep_price_kz: 4000,
  // data de lançamento em 30 de Outubro as 20:00
  release_at: new Date("2026-10-30T20:00:00+01:00").toISOString(),
  full_ep_zip_url: 'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/BERSAL_SESSION_I_COMPLETO.zip',
  payment_multicaixa_express: DEFAULT_PAYMENT.multicaixa_express,
  payment_entidade: DEFAULT_PAYMENT.entidade,
  payment_referencia: DEFAULT_PAYMENT.referencia,
};

export const INITIAL_TRACKS: Track[] = [
  {
    id: 'b7ce1d67-ad30-4a22-b524-f2ce40e12191',
    track_number: 1,
    title: 'Mansony : Formato',
    duration_seconds: 180,
    preview_url: 'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/1.FORMATO.-.PREVIEW.mp3',
    full_file_url: 'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/1.FORMATO.mp3',
    price_kz: 500,
    description: 'Faixa 1',
    is_featured: false,
  },
  {
    id: '4eea6435-34f2-466b-884a-6f5cf88ea4e3',
    track_number: 2,
    title: 'Chainz & Fago : Batota',
    duration_seconds: 180,
    preview_url: 'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/2.BATOTA-PREVIEW.mp3',
    full_file_url: 'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/2.BATOTA.mp3',
    price_kz: 500,
    description: 'Faixa 2',
    is_featured: false,
  },
  {
    id: '89e3f03a-0ecc-4f57-ad8e-c086c17d2b6d',
    track_number: 3,
    title: 'Mief e The real I essei : Mbali',
    duration_seconds: 180,
    preview_url: 'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/3.MBALI-PREVIEW.mp3',
    full_file_url: 'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/3.MBALI.mp3',
    price_kz: 500,
    description: 'Faixa 3',
    is_featured: false,
  },
  {
    id: '3f4e4a9e-c5b7-4a04-b1bf-d842bdb9f4db',
    track_number: 4,
    title: 'Edy Correia : Contra o vento',
    duration_seconds: 180,
    preview_url: 'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/4.CONTRA.O.VENTO-PREVIEW.mp3',
    full_file_url: 'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/4.CONTRA.O.VENTO.mp3',
    price_kz: 500,
    description: 'Faixa 4',
    is_featured: false,
  },
  {
    id: '2eb6398e-be97-482e-9f55-60e1edfa20d2',
    track_number: 5,
    title: 'Vilar x Iam Boss : Ecossimba',
    duration_seconds: 180,
    preview_url: '/audio/track5_preview.mp3',
    full_file_url: 'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/5.ECOSSIMBA.mp3',
    price_kz: 500,
    description: 'Faixa 5',
    is_featured: false,
  },
  {
    id: '0c13b870-f49b-4a0f-9993-8dc882a41f14',
    track_number: 6,
    title: 'Beezy Bhau x Danger Blackson  : Ás de copa',
    duration_seconds: 180,
    preview_url: 'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/6.AS.DE.COPA-PREVIEW.mp3',
    full_file_url: 'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/6.AS.DE.COPA.mp3',
    price_kz: 500,
    description: 'Faixa 6',
    is_featured: false,
  },
  {
    id: '9fdf628b-e735-4ac7-a0ee-0526de74d5ba',
    track_number: 7,
    title: 'Edy Correia x Igolias x Enny B : Habla tudo',
    duration_seconds: 180,
    preview_url: 'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/7.HABLA.TUDO-PREVIEW.mp3',
    full_file_url: 'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/7.HABLA.TUDO.mp3',
    price_kz: 500,
    description: 'Faixa 7',
    is_featured: false,
  },
  {
    id: 'f0afeb37-f4e4-4caf-8cad-1cf176030075',
    track_number: 8,
    title: 'Keren dos Santos : Progulema',
    duration_seconds: 180,
    preview_url: 'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/8.PROGULEMA-PREVIEW.mp3',
    full_file_url: 'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/8.PROGULEMA.mp3',
    price_kz: 500,
    description: 'Faixa 8',
    is_featured: false,
  },
  {
    id: '752bd44e-a7d8-42f6-9064-140f05ea5930',
    track_number: 9,
    title: 'Flappy : Bolingó',
    duration_seconds: 180,
    preview_url: 'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/9.BOLINGO-PREVIEW.mp3',
    full_file_url: 'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/9.BOLINGO.mp3',
    price_kz: 500,
    description: 'Faixa 9',
    is_featured: false,
  },
];

export function findTrackByIdOrNumber(trackIdOrNumber?: string | number): Track | undefined {
  if (!trackIdOrNumber) return undefined;
  const str = String(trackIdOrNumber).toLowerCase().trim();
  return INITIAL_TRACKS.find(
    (t) =>
      t.id.toLowerCase() === str ||
      String(t.track_number) === str ||
      `track-0${t.track_number}` === str ||
      `track-${t.track_number}` === str ||
      t.title.toLowerCase().includes(str)
  );
}

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
