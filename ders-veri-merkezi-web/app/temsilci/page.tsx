'use client';

import { useState } from 'react';
import { useDuyurular } from '@/lib/duyuru';
import { useTalepler } from '@/lib/talep';
import { useDokumanlar } from '@/lib/dokuman';
import { oturumSil } from '@/lib/api';
type Tab = 'home' | 'duyurular' | 'dokumanlar' | 'ilet';

const MENU: { id: Tab; label: string; icon: string }[] = [
  { id: 'home', label: 'Ana Sayfa', icon: '🏠' },
  { id: 'duyurular', label: 'Duyurular', icon: '📣' },
  { id: 'dokumanlar', label: 'Dokümanlar', icon: '📂' },
  { id: 'ilet', label: 'Akademisyene İlet', icon: '✉️' },
];

const BASLIK: Record<Tab, string> = {
  home: 'Genel Bakış',
  duyurular: 'Duyuru Panosu',
  dokumanlar: 'Ders Dokümanları',
  ilet: 'Talep & Mesaj Yönetimi',
};

export default function TemsilciDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const { duyurular } = useDuyurular();
  const { dokumanlar } = useDokumanlar();
  const { gonder } = useTalepler();

  const [mesajForm, setMesajForm] = useState({ hoca: '', konu: '', mesaj: '' });
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleLogout = () => {
   oturumSil();
    window.location.href = '/';
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    gonder({ hoca: mesajForm.hoca, konu: mesajForm.konu, mesaj: mesajForm.mesaj });
    setSentSuccess(true);
    setMesajForm({ hoca: '', konu: '', mesaj: '' });
    setTimeout(() => setSentSuccess(false), 4000);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 shadow-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30">
              ST
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">Temsilci Paneli</h2>
              <p className="text-xs text-slate-400">Ders Veri Merkezi</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {MENU.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveTab(m.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === m.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <span className="text-lg">{m.icon}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-slate-800/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <span>🚪</span>
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-xs">
          <h1 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">{BASLIK[activeTab]}</h1>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-medium text-slate-500">Sistem Aktif</span>
          </div>
        </header>

        <div className="p-8 max-w-5xl mx-auto">
          {/* TAB 1: ANA SAYFA */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-xl shadow-blue-500/10">
                <h2 className="text-2xl font-bold mb-2">Hoş Geldin, Temsilci 👋</h2>
                <p className="text-blue-100 text-sm max-w-xl leading-relaxed">
                  Sınıfının tüm akademik akışını buradan yönetebilir, hocaların paylaştığı duyuruları ve ders dokümanlarını takip edebilir, ortak talepleri anında iletebilirsin.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  onClick={() => setActiveTab('duyurular')}
                  className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-lg hover:border-blue-200 transition-all duration-200"
                >
                  <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-2xl mb-4 group-hover:scale-110 transition-transform">
                    📣
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">Duyurular</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Hocaların sınıfınız için paylaştığı en güncel bildirimleri görüntüleyin.
                  </p>
                  <p className="mt-3 text-xs font-semibold text-blue-600">{duyurular.length} duyuru</p>
                </div>

                <div
                  onClick={() => setActiveTab('dokumanlar')}
                  className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-lg hover:border-blue-200 transition-all duration-200"
                >
                  <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 text-2xl mb-4 group-hover:scale-110 transition-transform">
                    📂
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">Dokümanlar</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Akademisyenlerin yüklediği ders materyallerini ders bazında görüntüleyin.
                  </p>
                  <p className="mt-3 text-xs font-semibold text-amber-600">{dokumanlar.length} doküman</p>
                </div>

                <div
                  onClick={() => setActiveTab('ilet')}
                  className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-lg hover:border-blue-200 transition-all duration-200"
                >
                  <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-2xl mb-4 group-hover:scale-110 transition-transform">
                    ✉️
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">Akademisyene İlet</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Sınıfın ortak isteklerini ve sorularını ilgili akademisyene doğrudan ulaştırın.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DUYURULAR */}
          {activeTab === 'duyurular' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Duyuru Panosu</h2>
                <p className="text-sm text-slate-500">Akademisyenler tarafından sınıfınız için paylaşılan resmi bildirimler.</p>
              </div>

              <div className="grid gap-4">
                {duyurular.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                    Henüz paylaşılmış bir duyuru yok.
                  </div>
                )}

                {duyurular.map((d) => (
                  <div
                    key={d.id}
                    className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden"
                  >
                    <div
                      className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                        d.isImportant ? 'bg-amber-500' : 'bg-blue-600'
                      }`}
                    ></div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            d.isImportant
                              ? 'bg-amber-50 text-amber-700 border-amber-100'
                              : 'bg-blue-50 text-blue-700 border-blue-100'
                          }`}
                        >
                          {d.isImportant ? 'Önemli' : 'Duyuru'}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">📅 {d.date}</span>
                      </div>
                      <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                        📚 {d.course}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-lg mb-2">{d.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{d.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DOKÜMANLAR */}
          {activeTab === 'dokumanlar' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Ders Dokümanları</h2>
                <p className="text-sm text-slate-500">Akademisyenlerin sınıfınız için yüklediği ders materyalleri.</p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 font-bold text-slate-800">
                  Paylaşılan Dokümanlar ({dokumanlar.length})
                </div>

                {dokumanlar.length === 0 && (
                  <div className="p-8 text-center text-sm text-slate-500">Henüz paylaşılmış bir doküman yok.</div>
                )}

                <ul className="divide-y divide-slate-100">
                  {dokumanlar.map((doc) => (
                    <li key={doc.id} className="px-6 py-4 flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-xl">📄</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-sm truncate">{doc.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">📚 {doc.course}</p>
                      </div>
                      <div className="text-right text-xs text-slate-400">
                        <p className="font-medium text-slate-500">{doc.size}</p>
                        <p>{doc.date}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-xs text-slate-400">
                Dosya indirme, dosya depolama servisi bağlandığında etkinleşecektir.
              </p>
            </div>
          )}

          {/* TAB 4: AKADEMİSYENE İLET */}
          {activeTab === 'ilet' && (
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Akademisyene Mesaj Gönder</h2>
                <p className="text-sm text-slate-500">Sınıfınız adına ilgili ders hocasına talep veya soru iletin.</p>
              </div>

              {sentSuccess && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-3 shadow-xs">
                  <span className="text-xl">✅</span>
                  Mesajınız ilgili akademisyene başarıyla iletildi!
                </div>
              )}

              <form onSubmit={handleSendMessage} className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">İlgili Akademisyen</label>
                  <select
                    required
                    value={mesajForm.hoca}
                    onChange={(e) => setMesajForm({ ...mesajForm, hoca: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none bg-white transition-all"
                  >
                    <option value="">Seçim Yapın</option>
                    <option value="Dr. Ahmet Yılmaz">Dr. Ahmet Yılmaz (Yazılım Mühendisliği)</option>
                    <option value="Doç. Dr. Mehmet Demir">Doç. Dr. Mehmet Demir (Veritabanı)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Konu Başlığı</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Sınav tarihi değişikliği talebi"
                    value={mesajForm.konu}
                    onChange={(e) => setMesajForm({ ...mesajForm, konu: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Talep / Mesaj Detayı</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Sınıf adına iletmek istediğiniz açıklamayı buraya yazın..."
                    value={mesajForm.mesaj}
                    onChange={(e) => setMesajForm({ ...mesajForm, mesaj: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 active:scale-[0.99] transition-all"
                >
                  Akademisyene Gönder
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}