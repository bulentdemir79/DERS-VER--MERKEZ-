import { useCallback, useEffect, useState } from 'react';
import { API_URL, tokenAl } from '@/lib/api';

export interface Course {
  id: number;
  code: string;
  name: string;
  department: string;
  semester: string;
  studentCount: number;
  weeksCount: number;
}

const OLAY = 'dvm-ders-degisti';

// Duyuru ve doküman formlarında görünen yazı: "YBS302 - Veritabanı Mimarisi"
export const dersEtiketi = (c: Course) => `${c.code} - ${c.name}`;

interface SunucuDersi {
  id: number;
  course_code: string;
  course_name: string;
}

// Backend sadece kod ve ad tutuyor, diğer alanlar şimdilik sabit.
const cevir = (c: SunucuDersi): Course => ({
  id: c.id,
  code: c.course_code,
  name: c.course_name,
  department: 'Yazılım Mühendisliği',
  semester: 'Güz',
  studentCount: 0,
  weeksCount: 14,
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
  if (!res.ok) {
    const detay = String(data.details ?? '');
    if (detay.includes('Unique')) throw new Error('Bu ders kodu zaten kayıtlı.');
    throw new Error(data.error || 'İşlem yapılamadı.');
  }
  return data;
}

// Sayfalar bu dosyayı kullanır, sunucu adresleri sadece burada.
export function useDersler() {
  const [dersler, setDersler] = useState<Course[]>([]);

  const yukle = useCallback(async () => {
    try {
      const veri: SunucuDersi[] = await istek('/courses');
      setDersler(veri.map(cevir));
    } catch {
      setDersler([]);
    }
  }, []);

  useEffect(() => {
    yukle();
    window.addEventListener(OLAY, yukle);
    return () => window.removeEventListener(OLAY, yukle);
  }, [yukle]);

  const ekle = useCallback(async (yeni: Course) => {
    await istek('/courses', {
      method: 'POST',
      body: JSON.stringify({ code: yeni.code, name: yeni.name }),
    });
    window.dispatchEvent(new Event(OLAY));
  }, []);

  const sil = useCallback(async (id: number) => {
    await istek(`/courses/${id}`, { method: 'DELETE' });
    window.dispatchEvent(new Event(OLAY));
  }, []);

  return { dersler, ekle, sil };
}