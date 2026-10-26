'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { girisYap, oturumKaydet } from '@/lib/api';

type Role = 'akademisyen' | 'temsilci';

const BEKLENEN_ROL: Record<Role, string> = {
  akademisyen: 'ACADEMICIAN',
  temsilci: 'REPRESENTATIVE',
};

export default function LoginPage() {
  const router = useRouter();

  const [role, setRole] = useState<Role>('akademisyen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!/^[^\s@]+@[^\s@]+\.edu\.tr$/i.test(email.trim())) {
      setError('Lütfen kurumsal (.edu.tr) e-posta adresinizi girin.');
      return;
    }
    if (!password) {
      setError('Lütfen şifrenizi girin.');
      return;
    }

    setLoading(true);
    try {
      const cevap = await girisYap(email.trim(), password);

      if (cevap.user.role !== BEKLENEN_ROL[role]) {
        setError(
          role === 'akademisyen'
            ? 'Bu hesap bir akademisyen hesabı değil. Temsilci Girişi sekmesini deneyin.'
            : 'Bu hesap bir sınıf temsilcisi hesabı değil. Akademisyen Girişi sekmesini deneyin.'
        );
        setLoading(false);
        return;
      }

      oturumKaydet(cevap.token, cevap.user);
      router.push(role === 'akademisyen' ? '/dashboard' : '/temsilci');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Giriş yapılamadı.');
      setLoading(false);
    }
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMsg('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
    setTimeout(() => {
      setIsForgotOpen(false);
      setForgotMsg('');
      setForgotEmail('');
    }, 2000);
  };

  const tabClass = (active: boolean) =>
    `flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
      active ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
    }`;

  const inputClass =
    'w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all bg-slate-50/50';

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 font-sans relative">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-slate-100">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Ders Veri Merkezi</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
            Kurumsal Giriş Paneli
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
          <button type="button" onClick={() => setRole('akademisyen')} className={tabClass(role === 'akademisyen')}>
            👨‍🏫 Akademisyen Girişi
          </button>
          <button type="button" onClick={() => setRole('temsilci')} className={tabClass(role === 'temsilci')}>
            ⭐ Temsilci Girişi
          </button>
        </div>

        <form onSubmit={handleLogin} noValidate className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {role === 'akademisyen' ? 'Akademisyen E-Posta (.edu.tr)' : 'Temsilci E-Posta (.edu.tr)'}
            </label>
            <input
              type="email"
              placeholder={role === 'akademisyen' ? 'akademisyen@ozal.edu.tr' : 'temsilci@ozal.edu.tr'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Şifre
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 active:scale-[0.99] transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? 'Giriş yapılıyor...'
              : role === 'akademisyen'
              ? 'Akademisyen Paneline Giriş'
              : 'Sınıf Temsilcisi Paneline Giriş'}
          </button>
        </form>

        <div className="flex justify-end mt-3">
          <button
            type="button"
            onClick={() => setIsForgotOpen(true)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Şifremi Unuttum?
          </button>
        </div>

        <div className="mt-6 text-center text-[11px] text-slate-400">
          Malatya Turgut Özal Üniversitesi • Staj Projesi
        </div>
      </div>

      {isForgotOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">Şifre Sıfırlama</h3>
              <button
                type="button"
                onClick={() => setIsForgotOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {forgotMsg ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold text-center">
                {forgotMsg}
              </div>
            ) : (
              <form onSubmit={handleForgot} className="space-y-4">
                <p className="text-xs text-slate-500">
                  Sisteme kayıtlı e-posta adresinizi girin, yenileme bağlantısı gönderilecektir.
                </p>
                <input
                  type="email"
                  required
                  placeholder="ornek@ozal.edu.tr"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Bağlantı Gönder
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}