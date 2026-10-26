import { useCallback, useEffect, useState } from 'react';

export interface Talep {
  id: number;
  hoca: string;
  konu: string;
  mesaj: string;
  tarih: string;
  okundu: boolean;
}

const KEY = 'dvm_talepler';
const OLAY = 'dvm-talep-degisti';

function oku(): Talep[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function yaz(liste: Talep[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(liste));
  } catch {}
  window.dispatchEvent(new Event(OLAY));
}

// Backend hazır olunca SADECE bu dosyanın içi değişecek, sayfalara dokunulmayacak.
export function useTalepler() {
  const [talepler, setTalepler] = useState<Talep[]>([]);

  useEffect(() => {
    const yukle = () => setTalepler(oku());
    yukle();
    window.addEventListener('storage', yukle);
    window.addEventListener(OLAY, yukle);
    return () => {
      window.removeEventListener('storage', yukle);
      window.removeEventListener(OLAY, yukle);
    };
  }, []);

  const gonder = useCallback(
    (yeni: { hoca: string; konu: string; mesaj: string }) =>
      yaz([
        {
          ...yeni,
          id: Date.now(),
          tarih: new Date().toLocaleString('tr-TR'),
          okundu: false,
        },
        ...oku(),
      ]),
    []
  );

  const okunduYap = useCallback(
    (id: number) => yaz(oku().map((t) => (t.id === id ? { ...t, okundu: true } : t))),
    []
  );

  const sil = useCallback((id: number) => yaz(oku().filter((t) => t.id !== id)), []);

  return { talepler, gonder, okunduYap, sil };
}