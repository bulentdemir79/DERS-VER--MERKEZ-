'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { oturumSil } from '@/lib/api';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Ana Sayfa', href: '/dashboard', icon: '🏠' },
    { name: 'Derslerim & İçerik', href: '/dashboard/dersler', icon: '📚' },
    { name: 'Doküman Yönetimi', href: '/dashboard/dokumanlar', icon: '📂' },
    { name: 'Duyurular', href: '/dashboard/duyurular', icon: '📣' },
    { name: 'Gelen Talepler', href: '/dashboard/talepler', icon: '📩' },
    { name: 'Kullanım Raporları', href: '/dashboard/analiz', icon: '📊' },
  ];

  const handleLogout = () => {
    oturumSil();
    window.location.href = '/';
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col p-4 h-screen justify-between border-r border-slate-800">
      <div>
        <div className="px-2 mb-6">
          <h2 className="text-xl font-bold text-white">Akademisyen Paneli</h2>
          <p className="text-xs text-slate-400 mt-0.5">Ders Veri Merkezi</p>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive =
              item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
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
  );
}