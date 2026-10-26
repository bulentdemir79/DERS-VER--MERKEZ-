'use client';

import Link from 'next/link';
import { oturumSil } from '@/lib/api';

const menu = [
  { name: 'Ana Sayfa', href: '/dashboard', icon: '🏠' },
  { name: 'Derslerim & İçerik', href: '/dashboard/dersler', icon: '📚' },
  { name: 'Doküman Yönetimi', href: '/dashboard/dokumanlar', icon: '📂' },
  { name: 'Duyurular', href: '/dashboard/duyurular', icon: '📣' },
  { name: 'Gelen Talepler', href: '/dashboard/talepler', icon: '📩' },
  { name: 'Kullanım Raporları', href: '/dashboard/analiz', icon: '📊' },
];

const kartlar = [
  { baslik: 'Derslerim', aciklama: 'Verdiğin dersleri ve içeriklerini yönet.', href: '/dashboard/dersler', icon: '📚' },
  { baslik: 'Dokümanlar', aciklama: 'Ders materyallerini yükle ve düzenle.', href: '/dashboard/dokumanlar', icon: '📂' },
  { baslik: 'Duyurular', aciklama: 'Sınıfa duyuru yayınla.', href: '/dashboard/duyurular', icon: '📣' },
  { baslik: 'Gelen Talepler', aciklama: 'Sınıf temsilcilerinin mesajlarını oku.', href: '/dashboard/talepler', icon: '📩' },
  { baslik: 'Kullanım Raporları', aciklama: 'Materyallerin ne kadar görüntülendiğine bak.', href: '/dashboard/analiz', icon: '📊' },
];

export default function DashboardHome() {
  const handleLogout = () => {
    oturumSil();
    window.location.href = '/';
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans">
      <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col p-4 justify-between border-r border-slate-800">
        <div>
          <div className="px-2 mb-6">
            <h2 className="text-xl font-bold text-white">Akademisyen Paneli</h2>
            <p className="text-xs text-slate-400 mt-0.5">Ders Veri Merkezi</p>
          </div>
          <nav className="space-y-1">
            {menu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  item.href === '/dashboard'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
          >
            <span>🚪</span>
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-xl">
            <h1 className="text-2xl font-bold mb-2">Hoş Geldiniz 👋</h1>
            <p className="text-blue-100 text-sm max-w-xl leading-relaxed">
              Derslerinizi, dokümanlarınızı ve duyurularınızı buradan yönetebilir,
              sınıf temsilcilerinizle güvenli şekilde paylaşım yapabilirsiniz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {kartlar.map((k) => (
              <Link
                key={k.href}
                href={k.href}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all"
              >
                <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {k.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">{k.baslik}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{k.aciklama}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}