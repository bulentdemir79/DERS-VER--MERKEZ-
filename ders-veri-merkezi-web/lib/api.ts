export const API_URL = 'http://localhost:4000';

export interface Kullanici {
  id: number;
  name: string;
  email: string;
  role: string; // ACADEMICIAN, REPRESENTATIVE, ADMIN, STUDENT
}

export interface GirisCevabi {
  message: string;
  token: string;
  user: Kullanici;
}

export function tokenAl(): string | null {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
}

export function kullaniciAl(): Kullanici | null {
  try {
    const raw = localStorage.getItem('kullanici');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function oturumKaydet(token: string, user: Kullanici) {
  try {
    localStorage.setItem('token', token);
    localStorage.setItem('kullanici', JSON.stringify(user));
  } catch {}
}

export function oturumSil() {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('kullanici');
  } catch {}
}

export async function girisYap(email: string, password: string): Promise<GirisCevabi> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error('Sunucuya ulaşılamıyor. Backend çalışıyor mu?');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Giriş yapılamadı.');
  return data as GirisCevabi;
}