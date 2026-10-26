'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { kullaniciAl, tokenAl } from '@/lib/api';

export default function OturumKorumasi({
  rol,
  children,
}: {
  rol: 'ACADEMICIAN' | 'REPRESENTATIVE';
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [izinli, setIzinli] = useState(false);

  useEffect(() => {
    const kullanici = kullaniciAl();

    // Giriş yapılmamışsa giriş ekranına
    if (!tokenAl() || !kullanici) {
      router.replace('/');
      return;
    }

    // Yanlış rolle gelindiyse kendi paneline
    if (kullanici.role !== rol) {
      router.replace(
        kullanici.role === 'REPRESENTATIVE'
          ? '/temsilci'
          : kullanici.role === 'ACADEMICIAN'
          ? '/dashboard'
          : '/'
      );
      return;
    }

    setIzinli(true);
  }, [rol, router]);

  if (!izinli) return <div className="min-h-screen bg-slate-900" />;

  return <>{children}</>;
}