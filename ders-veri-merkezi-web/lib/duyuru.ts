import { useCallback, useEffect, useState } from 'react';

export interface Announcement {
  id: number;
  title: string;
  course: string;
  content: string;
  date: string;
  isImportant: boolean;
}

const KEY = 'dvm_duyurular';
const OLAY = 'dvm-duyuru-degisti';

const VARSAYILAN: Announcement[] = [
  {
    id: 1,
    title: 'Vize Sınavı Konuları Ve Uygulama Projesi Hakkında',
    course: 'YBS302 - Veritabanı Mimarisi',
    content:
      'Vize sınavında SQL Stored Procedure ve View konuları ağırlıklı olacaktır. Uygulama projenizi haftaya Salı gününe kadar teslim etmeniz gerekmektedir.',
    date: '2026-08-25',
    isImportant: true,
  },
  {
    id: 2,
    title: 'Ders Saati Değişikliği',
    course: 'YBM201 - Veri Yapıları',
    content: 'Cuma günkü Veri Yapıları lab dersi saat 14:00 yerine 15:30 olarak güncellenmiştir.',
    date: '2026-08-28',
    isImportant: false,
  },
];

function oku(): Announcement[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : VARSAYILAN;
  } catch {
    return VARSAYILAN;
  }
}

function yaz(liste: Announcement[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(liste));
  } catch {}
  window.dispatchEvent(new Event(OLAY));
}

// Backend hazır olunca SADECE bu dosyanın içi değişecek, sayfalara dokunulmayacak.
export function useDuyurular() {
  const [duyurular, setDuyurular] = useState<Announcement[]>([]);

  useEffect(() => {
    const yukle = () => setDuyurular(oku());
    yukle();
    window.addEventListener('storage', yukle);
    window.addEventListener(OLAY, yukle);
    return () => {
      window.removeEventListener('storage', yukle);
      window.removeEventListener(OLAY, yukle);
    };
  }, []);

  const ekle = useCallback((yeni: Announcement) => yaz([yeni, ...oku()]), []);
  const sil = useCallback((id: number) => yaz(oku().filter((d) => d.id !== id)), []);

  return { duyurular, ekle, sil };
}