'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Radio, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const supabase = createClient();
      if (supabase) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message || 'Credenciais inválidas.');
          setLoading(false);
          return;
        }
      }

      router.push('/admin');
    } catch {
      setErrorMsg('Ocorreu um erro ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12">
      <div className="w-full max-w-md bg-[#1c1b1d] rounded-2xl p-6 sm:p-8 border border-[#e8c76b]/20 shadow-2xl flex flex-col gap-5">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-[#201f21] border border-[#e8c76b]/30 flex items-center justify-center text-[#e8c76b] shadow-[0_0_20px_rgba(232,199,107,0.15)]">
            <Radio className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-[#e8c76b] uppercase tracking-widest mt-1">
            Bersal Studios
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Acesso Administrativo
          </h1>
          <p className="text-xs text-[#cfc5b2]">
            Autenticação restrita para confirmação de comprovativos e entrega do EP.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-[#93000a]/20 border border-[#ffb4ab]/30 flex items-center gap-2 text-xs text-[#ffdad6]">
            <AlertCircle className="w-4 h-4 text-[#ffb4ab] shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-white uppercase tracking-wider">
              Email do Dono
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-[#98907e]" />
              <input
                type="email"
                required
                placeholder="admin@bersalstudios.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 pl-10 pr-4 bg-[#2a2a2c] rounded-xl text-sm text-white placeholder:text-[#98907e] border border-white/5 focus:border-[#e8c76b] focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-white uppercase tracking-wider">
              Palavra-passe
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-[#98907e]" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 pl-10 pr-4 bg-[#2a2a2c] rounded-xl text-sm text-white placeholder:text-[#98907e] border border-white/5 focus:border-[#e8c76b] focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-13 mt-2 rounded-xl bg-gradient-to-r from-[#f3dc8f] via-[#e8c76b] to-[#d4af37] text-[#0b0b0d] font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(232,199,107,0.3)] hover:brightness-105 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'A verificar...' : 'Entrar no Painel'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
