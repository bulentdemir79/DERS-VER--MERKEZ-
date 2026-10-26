import { useCallback, useEffect, useState } from 'react';
import { API_URL, tokenAl } from '@/lib/api';

export interface DocumentItem {
  id: number;
  name: string;
  course: string;
  size: string;
  date: string;
}

const OLAY = 'dvm-dokuman-degisti';

interface SunucuDokuman {
  id: number;
  title: string;
  file_url: string;
  file_type: string;
  created_at?: string;
  file_size?: string | null;
  course?: { id: number; course_code: string; course_name: string } | null;
}

interface SunucuDersi {
  id: number;
  course_code: string;
  course_name: string;
}

// Backend'de tarih ve boyut alanı henüz yok. Eklenince otomatik görünecek.
const cevir = (d: SunucuDokuman): DocumentItem => ({
  id: d.id,
  name: d.title,
  course: d.course ? `${d.course.course_code} - ${d.course.course_name}` : '—',
  size: d.file_size || '—',
  date: d.created_at ? d.created_at.slice(0, 10) : '—',
});

async function istek(yol: string, secenekler: RequestInit = {}) {
  const token = tokenAl();
  let res: Response;
  try {
    res = await fetch(`${API_URL}${yol}`, {
      ...secenekler,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(secenekler.headers ?? {}),
      },
    });
  } catch {
    throw new Error('Sunucuya ulaşılamıyor. Backend çalışıyor mu?');
  }

  const data = await res.json().catch(() => ({}));

  if (res.status === 401 || res.status === 403) {
    throw new Error('Oturum geçersiz. Lütfen çıkış yapıp tekrar giriş yapın.');
  }
  if (!res.ok) throw new Error(data.error || 'İşlem yapılamadı.');
  return data;
}

// Sayfalar bu dosyayı kullanır, sunucu adresleri sadece burada.
// Not: Şimdilik dosyanın kendisi değil, sadece kaydı (adı, dersi) saklanır.
export function useDokumanlar() {
  const [dokumanlar, setDokumanlar] = useState<DocumentItem[]>([]);

  const yukle = useCallback(async () => {
    try {
      const veri: SunucuDokuman[] = await istek('/documents');
      setDokumanlar(veri.map(cevir).reverse());
    } catch {
      setDokumanlar([]);
    }
  }, []);

  useEffect(() => {
    yukle();
    window.addEventListener(OLAY, yukle);
    return () => window.removeEventListener(OLAY, yukle);
  }, [yukle]);

  const ekle = useCallback(async (yeni: DocumentItem) => {
    const dersler: SunucuDersi[] = await istek('/courses');
    const ders = dersler.find((c) => `${c.course_code} - ${c.course_name}` === yeni.course);
    if (!ders) throw new Error('Seçilen ders bulunamadı. Sayfayı yenileyip tekrar deneyin.');

    const uzanti = yeni.name.split('.').pop()?.toLowerCase();
    const tur = uzanti === 'doc' || uzanti === 'docx' ? 'DOCX' : 'PDF';

    await istek('/documents', {
      method: 'POST',
      body: JSON.stringify({
        title: yeni.name,
        file_url: `dosya-yuklenecek/${yeni.name}`,
        file_type: tur,
        course_id: ders.id,
      }),
    });
    window.dispatchEvent(new Event(OLAY));
  }, []);

  const sil = useCallback(async (id: number) => {
    await istek(`/documents/${id}`, { method: 'DELETE' });
    window.dispatchEvent(new Event(OLAY));
  }, []);

  return { dokumanlar, ekle, sil };
}