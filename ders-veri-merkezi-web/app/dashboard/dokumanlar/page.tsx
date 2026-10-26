'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { useDokumanlar } from '@/lib/dokuman';
import { useDersler, dersEtiketi } from '@/lib/ders';

export default function DokumanlarPage() {
  const { dokumanlar, ekle, sil } = useDokumanlar();
  const { dersler } = useDersler();

  const [selectedCourse, setSelectedCourse] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [mesaj, setMesaj] = useState<{ tip: 'ok' | 'hata'; metin: string } | null>(null);
  const [mesgul, setMesgul] = useState(false);

  // Seçili ders silinmişse ya da hiç seçilmemişse ilk dersi kullan
  const etiketler = dersler.map(dersEtiketi);
  const seciliDers = etiketler.includes(selectedCourse) ? selectedCourse : etiketler[0] ?? '';

  const bildir = (tip: 'ok' | 'hata', metin: string) => {
    setMesaj({ tip, metin });
    setTimeout(() => setMesaj(null), 5000);
  };

  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!seciliDers) {
      bildir('hata', 'Önce "Derslerim & İçerik" sayfasından bir ders tanımlayın.');
      return;
    }
    if (!file) {
      bildir('hata', 'Lütfen önce bir dosya seçin.');
      return;
    }

    setMesgul(true);
    try {
      await ekle({
        id: 0,
        name: file.name,
        course: seciliDers,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        date: new Date().toISOString().split('T')[0],
      });
      setFile(null);
      form.reset();
      bildir('ok', 'Doküman kaydedildi. Sınıf temsilcileri artık görebilir.');
    } catch (err) {
      bildir('hata', err instanceof Error ? err.message : 'Doküman yüklenemedi.');
    } finally {
      setMesgul(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await sil(id);
    } catch (err) {
      bildir('hata', err instanceof Error ? err.message : 'Doküman silinemedi.');
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Doküman Yönetimi</h1>
        <p className="text-sm text-slate-500 mb-6">Ders materyallerini yükleyin ve yönetin.</p>

        {mesaj && (
          <div
            className={`mb-6 rounded-lg border px-4 py-2.5 text-sm font-medium ${
              mesaj.tip === 'ok'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}
          >
            {mesaj.metin}
          </div>
        )}

        {/* Dosya Yükleme Formu */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Yeni Doküman Yükle</h2>

          <form onSubmit={handleFileUpload} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">İlişkili Ders</label>
              <select
                value={seciliDers}
                onChange={(e) => setSelectedCourse(e.target.value)}
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

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Dosya Seç (PDF, DOCX)</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={mesgul}
              className="rounded-lg bg-blue-600 py-2.5 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {mesgul ? 'Yükleniyor...' : 'Dokümanı Yükle'}
            </button>
          </form>
        </div>

        {/* Yüklenen Dokümanlar Listesi */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 font-bold text-slate-800">
            Mevcut Dokümanlar ({dokumanlar.length})
          </div>
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-400">
              <tr>
                <th className="p-4">Dosya Adı</th>
                <th className="p-4">Ders</th>
                <th className="p-4">Boyut</th>
                <th className="p-4">Tarih</th>
                <th className="p-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dokumanlar.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Henüz yüklenmiş doküman yok.
                  </td>
                </tr>
              )}

              {dokumanlar.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-900">📄 {doc.name}</td>
                  <td className="p-4">{doc.course}</td>
                  <td className="p-4">{doc.size}</td>
                  <td className="p-4">{doc.date}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="text-xs text-rose-600 font-semibold hover:underline"
                    >
                      Kaldır
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}