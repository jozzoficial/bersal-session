'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Camera, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { GalleryImage } from '@/lib/types';

export default function GaleriaPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();
    if (supabase) {
      supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (isMounted) {
            if (!error && data) {
              setImages(data as GalleryImage[]);
            }
            setLoading(false);
          }
        });
    } else {
      queueMicrotask(() => {
        if (isMounted) setLoading(false);
      });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0e0e10] flex flex-col font-sans selection:bg-[#e8c76b] selection:text-[#0b0b0d]">
      <Header />
      
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-24 pb-20 flex flex-col gap-8">
        <section className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#201f21] border border-[#e8c76b]/20 flex items-center justify-center text-[#e8c76b] shadow-lg">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Galeria Bersal</h1>
              <p className="text-sm text-[#cfc5b2]">Acompanha as atualizações e fotos exclusivas do projeto.</p>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="w-8 h-8 rounded-full border-2 border-[#e8c76b] border-t-transparent animate-spin" />
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#1c1b1d] rounded-2xl border border-white/5">
            <ImageIcon className="w-12 h-12 text-[#98907e] mb-3" />
            <p className="text-[#cfc5b2]">Ainda não há fotos na galeria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img) => (
              <div key={img.id} className="group relative rounded-2xl overflow-hidden bg-[#1c1b1d] border border-white/5 shadow-md aspect-square">
                <img src={img.image_url} alt={img.description || 'Galeria Bersal'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {img.description && (
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                    <p className="text-sm text-white font-medium">{img.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
