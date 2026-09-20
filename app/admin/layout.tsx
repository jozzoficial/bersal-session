'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Radio, LogOut, LayoutDashboard, Disc, ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Se estiver na tela de login, não bloqueia
    if (pathname === '/admin/login') {
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          // Se não houver sessão ativa e estiver em produção com Supabase, redireciona para login
          // Se estiver em modo local sem chaves Supabase, permite visualização do painel em modo demonstrativo
          const hasSupabaseUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
          if (hasSupabaseUrl) {
            router.push('/admin/login');
          } else {
            setUserEmail('produtor@bersalstudios.com');
          }
        } else {
          setUserEmail(session.user.email ?? 'admin@bersalstudios.com');
        }
        setIsLoading(false);
      });
    } else {
      // Fallback gracioso local
      setUserEmail('produtor@bersalstudios.com');
      setIsLoading(false);
    }
  }, [pathname, router]);

  const handleLogout = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push('/admin/login');
  };

  if (isLoading && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen bg-[#0e0e10] flex items-center justify-center text-[#e8c76b]">
        <div className="w-8 h-8 border-2 border-[#e8c76b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131315] text-[#e5e1e4] flex flex-col">
      {/* Header Administrativo */}
      <header className="sticky top-0 z-40 bg-[#0e0e10]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-[#201f21] border border-[#e8c76b]/20 flex items-center justify-center text-[#e8c76b]">
                <Radio className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#e8c76b] uppercase tracking-widest">
                  Bersal Studios
                </span>
                <span className="text-sm font-extrabold text-white">
                  Painel de Gestão
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c1b1d] hover:bg-[#2a2a2c] text-xs font-semibold text-[#cfc5b2] hover:text-white border border-white/5 transition-all"
            >
              <span>Ver Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {userEmail && (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#201f21] hover:bg-[#93000a]/20 text-xs font-semibold text-[#cfc5b2] hover:text-[#ffb4ab] border border-white/5 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Terminar Sessão</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col">
        {children}
      </main>
    </div>
  );
}
