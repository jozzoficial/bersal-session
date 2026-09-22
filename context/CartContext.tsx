'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Track } from '@/lib/types';
import { DEFAULT_EP_SETTINGS } from '@/lib/constants';

interface CartContextType {
  selectedTracks: Track[];
  isFullEp: boolean;
  addTrack: (track: Track) => void;
  removeTrack: (trackId: string) => void;
  toggleTrack: (track: Track) => void;
  selectFullEp: () => void;
  clearCart: () => void;
  totalKz: number;
  totalItemsCount: number;
  orderType: 'faixas' | 'ep_completo';
  fullEpPriceKz: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
  const [isFullEp, setIsFullEp] = useState<boolean>(false);
  const fullEpPriceKz = DEFAULT_EP_SETTINGS.full_ep_price_kz;

  const isLoadedRef = useRef(false);

  // Carregar do localStorage na inicialização
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bersal_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        queueMicrotask(() => {
          if (parsed.isFullEp) {
            setIsFullEp(true);
            setSelectedTracks([]);
          } else if (Array.isArray(parsed.selectedTracks)) {
            setSelectedTracks(parsed.selectedTracks);
            setIsFullEp(false);
          }
          isLoadedRef.current = true;
        });
        return;
      }
    } catch {}
    isLoadedRef.current = true;
  }, []);

  // Salvar no localStorage sempre que houver mudanças após inicialização
  useEffect(() => {
    if (!isLoadedRef.current) return;
    try {
      localStorage.setItem(
        'bersal_cart',
        JSON.stringify({ isFullEp, selectedTracks })
      );
    } catch {}
  }, [isFullEp, selectedTracks]);

  const addTrack = (track: Track) => {
    setIsFullEp(false); // Respeita a regra de negócio: ou faixas ou EP completo
    setSelectedTracks((prev) => {
      if (prev.some((t) => t.id === track.id)) return prev;
      return [...prev, track];
    });
  };

  const removeTrack = (trackId: string) => {
    setSelectedTracks((prev) => prev.filter((t) => t.id !== trackId));
  };

  const toggleTrack = (track: Track) => {
    setIsFullEp(false);
    setSelectedTracks((prev) => {
      const exists = prev.some((t) => t.id === track.id);
      if (exists) {
        return prev.filter((t) => t.id !== track.id);
      }
      return [...prev, track];
    });
  };

  const selectFullEp = () => {
    setIsFullEp(true);
    setSelectedTracks([]); // Substitui faixas avulsas
  };

  const clearCart = () => {
    setIsFullEp(false);
    setSelectedTracks([]);
    try {
      localStorage.removeItem('bersal_cart');
    } catch {}
  };

  const totalKz = isFullEp
    ? fullEpPriceKz
    : selectedTracks.reduce((sum, t) => sum + (Number(t.price_kz) || 500), 0);

  const totalItemsCount = isFullEp ? 6 : selectedTracks.length;
  const orderType: 'faixas' | 'ep_completo' = isFullEp ? 'ep_completo' : 'faixas';

  return (
    <CartContext.Provider
      value={{
        selectedTracks,
        isFullEp,
        addTrack,
        removeTrack,
        toggleTrack,
        selectFullEp,
        clearCart,
        totalKz,
        totalItemsCount,
        orderType,
        fullEpPriceKz,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
}
