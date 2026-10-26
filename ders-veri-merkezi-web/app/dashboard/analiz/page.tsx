'use client';

import Sidebar from '@/components/Sidebar';
import { useDuyurular } from '@/lib/duyuru';
import { useTalepler } from '@/lib/talep';
import { useDokumanlar } from '@/lib/dokuman';
import { useDersler } from '@/lib/ders';

export default function AnalizPage() {
  const { duyurular } = useDuyurular();
  const { talepler } = useTalepler();
  const { dokumanlar } = useDokumanlar();
  const { dersler } = useDersler();

  const onemliSayisi = duyurular.filter((d) => d.isImportant).length;
  const yeniTalep = talepler.filter((t) => !t.okundu).length;
  const sonTalepler = talepler.slice(0, 3);

  const toplamOgrenci = dersler.reduce((toplam, d) => toplam + d.studentCount, 0);

  const toplamMB = dokumanlar
    .reduce((toplam, d) => toplam + (parseFloat(d.size) || 0), 0)
    .toFixed(1);

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Kullanım Raporları & Analiz</h1>
        <p className="text-sm text-slate-500 mb-6">Sistem kullanım istatistikleri ve genel raporlar.</p>

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-blue-500">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Toplam Ders</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{dersler.length}</span>
              <span className="text-xs text-slate-400 font-semibold">{toplamOgrenci} kayıtlı öğrenci</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-indigo-500">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Yüklenen Doküman</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{dokumanlar.length}</span>
              <span className="text-xs text-slate-400 font-semibold">Toplam {toplamMB} MB</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-amber-500">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Aktif Duyuru</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{duyurular.length}</span>
              <span className="text-xs text-rose-600 font-semibold">{onemliSayisi} önemli</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Gelen Talep</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{talepler.length}</span>
              <span className="text-xs text-emerald-600 font-semibold">{yeniTalep} yeni</span>
            </div>
          </div>
        </div>

        {/* Detaylı Rapor Tabloları */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* En Çok İndirilenler (örnek veri) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 font-bold text-slate-800 bg-slate-50/50 flex items-center justify-between">
              <span>🔥 En Çok İndirilen Dokümanlar</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Örnek veri</span>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-700">Hafta-1_Veritabani_Giris.pdf</span>
                  <span className="font-bold text-blue-600">82 İndirme</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-700">Algoritmalar_Graf_Teorisi.pdf</span>
                  <span className="font-bold text-blue-600">54 İndirme</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Son Sistem Hareketleri */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 font-bold text-slate-800 bg-slate-50/50">
              ⏱ Son Sistem Hareketleri
            </div>
            <ul className="divide-y divide-slate-100 text-sm">
              {sonTalepler.length === 0 && !duyurular[0] && !dokumanlar[0] && (
                <li className="p-4 text-slate-400">Henüz bir hareket yok.</li>
              )}

              {sonTalepler.map((t) => (
                <li key={t.id} className="p-4 flex gap-3">
                  <span className="text-amber-500">●</span>
                  <p className="text-slate-600">
                    <span className="font-semibold text-slate-800">Sınıf Temsilcisi</span> “{t.konu}” konulu talep gönderdi.
                  </p>
                  <span className="text-xs text-slate-400 ml-auto whitespace-nowrap">{t.tarih}</span>
                </li>
              ))}

              {duyurular[0] && (
                <li className="p-4 flex gap-3">
                  <span className="text-emerald-500">●</span>
                  <p className="text-slate-600">
                    <span className="font-semibold text-slate-800">Akademisyen</span> “{duyurular[0].title}” duyurusunu yayınladı.
                  </p>
                  <span className="text-xs text-slate-400 ml-auto whitespace-nowrap">{duyurular[0].date}</span>
                </li>
              )}

              {dokumanlar[0] && (
                <li className="p-4 flex gap-3">
                  <span className="text-blue-500">●</span>
                  <p className="text-slate-600">
                    <span className="font-semibold text-slate-800">Akademisyen</span> “{dokumanlar[0].name}” dokümanını yükledi.
                  </p>
                  <span className="text-xs text-slate-400 ml-auto whitespace-nowrap">{dokumanlar[0].date}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}