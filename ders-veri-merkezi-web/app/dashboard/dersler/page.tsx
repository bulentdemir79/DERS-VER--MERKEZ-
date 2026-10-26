'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { useDersler } from '@/lib/ders';

export default function DerslerPage() {
  const { dersler, ekle, sil } = useDersler();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [semester, setSemester] = useState('Güz');
  const [mesaj, setMesaj] = useState<{ tip: 'ok' | 'hata'; metin: string } | null>(null);
  const [mesgul, setMesgul] = useState(false);

  const bildir = (tip: 'ok' | 'hata', metin: string) => {
    setMesaj({ tip, metin });
    setTimeout(() => setMesaj(null), 5000);
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim() || !name.trim()) {
      bildir('hata', 'Lütfen ders kodunu ve adını girin.');
      return;
    }

    setMesgul(true);
    try {
      await ekle({
        id: 0,
        code: code.trim().toUpperCase(),
        name: name.trim(),
        department: 'Yazılım Mühendisliği',
        semester,
        studentCount: 0,
        weeksCount: 14,
      });
      setCode('');
      setName('');
      bildir('ok', 'Ders eklendi. Duyuru ve doküman formlarında artık seçilebilir.');
    } catch (err) {
      bildir('hata', err instanceof Error ? err.message : 'Ders eklenemedi.');
    } finally {
      setMesgul(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await sil(id);
    } catch (err) {
      bildir('hata', err instanceof Error ? err.message : 'Ders silinemedi.');
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Ders & Müfredat Yönetimi</h1>
        <p className="text-sm text-slate-500 mb-6">Yürüttüğünüz dersleri tanımlayın ve içeriğini düzenleyin.</p>

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

        {/* Yeni Ders Ekleme Formu */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Yeni Ders Tanımla</h2>

          <form onSubmit={handleAddCourse} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Ders Kodu</label>
              <input
                type="text"
                placeholder="Örn: YBS302"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Ders Adı</label>
              <input
                type="text"
                placeholder="Örn: Veritabanı Mimarisi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Dönem</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white"
              >
                <option>Güz</option>
                <option>Bahar</option>
                <option>Yaz</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={mesgul}
              className="rounded-lg bg-blue-600 py-2.5 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {mesgul ? 'Ekleniyor...' : 'Ders Ekle'}
            </button>
          </form>
        </div>

        {/* Ders Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dersler.length === 0 && (
            <div className="md:col-span-2 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
              Henüz tanımlı bir ders yok. Yukarıdan ilk dersi ekleyin.
            </div>
          )}

          {dersler.map((course) => (
            <div key={course.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded mb-2">
                    {course.code}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">{course.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{course.department}</p>
                </div>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="text-xs text-rose-600 font-semibold hover:underline"
                >
                  Sil
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 mt-4 text-xs text-slate-600">
                <div>
                  <span className="block font-semibold text-slate-400">Kayıtlı Öğrenci</span>
                  <span className="text-base font-bold text-slate-800">{course.studentCount}</span>
                </div>
                <div>
                  <span className="block font-semibold text-slate-400">Müfredat Süresi</span>
                  <span className="text-base font-bold text-slate-800">{course.weeksCount} Hafta</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}