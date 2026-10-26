'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { useDuyurular, type Announcement } from '@/lib/duyuru';
import { useDersler, dersEtiketi } from '@/lib/ders';

export default function DuyurularPage() {
  const { duyurular, ekle, sil } = useDuyurular();
  const { dersler } = useDersler();

  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [content, setContent] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [mesaj, setMesaj] = useState<{ tip: 'ok' | 'hata'; metin: string } | null>(null);

  // Seçili ders silinmişse ya da hiç seçilmemişse ilk dersi kullan
  const etiketler = dersler.map(dersEtiketi);
  const seciliDers = etiketler.includes(course) ? course : etiketler[0] ?? '';

  const bildir = (tip: 'ok' | 'hata', metin: string) => {
    setMesaj({ tip, metin });
    setTimeout(() => setMesaj(null), 4000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!seciliDers) {
      bildir('hata', 'Önce "Derslerim & İçerik" sayfasından bir ders tanımlayın.');
      return;
    }
    if (!title.trim() || !content.trim()) {
      bildir('hata', 'Lütfen başlık ve içerik alanlarını doldurun.');
      return;
    }

    const yeni: Announcement = {
      id: Date.now(),
      title: title.trim(),
      course: seciliDers,
      content: content.trim(),
      date: new Date().toISOString().split('T')[0],
      isImportant,
    };

    ekle(yeni);
    setTitle('');
    setContent('');
    setIsImportant(false);
    bildir('ok', 'Duyuru yayınlandı. Sınıf temsilcileri artık görebilir.');
  };

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-6">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Akademisyen Paneli</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Duyuru Yönetimi</h1>
          <p className="text-sm text-slate-500">Öğrencilere anlık bilgilendirme ve duyuru yayınlayın.</p>
        </header>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Yeni Duyuru Yayınla</h2>

          {mesaj && (
            <div
              className={`mb-4 rounded-lg border px-4 py-2.5 text-sm font-medium ${
                mesaj.tip === 'ok'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}
            >
              {mesaj.metin}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Duyuru Başlığı</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Örn: Vize Sınavı Tarihleri"
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">İlişkili Ders</label>
                <select
                  value={seciliDers}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white"
                >
                  {etiketler.length === 0 && <option value="">Önce bir ders tanımlayın</option>}
                  {etiketler.map((et) => (
                    <option key={et} value={et}>
                      {et}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Duyuru İçeriği</label>
              <textarea
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Duyuru detaylarını buraya yazın..."
                className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:outline-none focus:border-blue-500 resize-none"
              ></textarea>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 font-medium">
                <input
                  type="checkbox"
                  checked={isImportant}
                  onChange={(e) => setIsImportant(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                📌 Önemli Duyuru Olarak İşaretle
              </label>

              <button
                type="submit"
                className="rounded-lg bg-blue-600 py-2.5 px-6 text-sm font-semibold text-white transition hover:bg-blue-700 shadow-md shadow-blue-600/20"
              >
                Duyuruyu Paylaş
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800">Yayınlanan Duyurular ({duyurular.length})</h2>

          {duyurular.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              Henüz yayınlanmış bir duyuru yok.
            </div>
          )}

          {duyurular.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-xl border bg-white shadow-sm transition ${
                item.isImportant ? 'border-amber-400 bg-amber-50/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {item.isImportant && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        ÖNEMLİ
                      </span>
                    )}
                    <span className="text-xs font-semibold text-blue-600">{item.course}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                </div>
                <span className="text-xs text-slate-400 whitespace-nowrap">{item.date}</span>
              </div>
              <p className="text-sm text-slate-600 mb-4">{item.content}</p>
              <div className="flex justify-end border-t border-slate-100 pt-3">
                <button
                  onClick={() => sil(item.id)}
                  className="text-xs text-rose-600 font-semibold hover:underline"
                >
                  Duyuruyu Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}