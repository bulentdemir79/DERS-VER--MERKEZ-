'use client';

import Sidebar from '@/components/Sidebar';
import { useTalepler } from '@/lib/talep';

export default function TaleplerPage() {
  const { talepler, okunduYap, sil } = useTalepler();

  const okunmamis = talepler.filter((t) => !t.okundu).length;

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-6">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Akademisyen Paneli</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Gelen Talepler</h1>
          <p className="text-sm text-slate-500">
            Sınıf temsilcilerinin size ilettiği talep ve mesajlar.
            {okunmamis > 0 && (
              <span className="ml-2 inline-block rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-700">
                {okunmamis} yeni
              </span>
            )}
          </p>
        </header>

        <div className="space-y-4">
          {talepler.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
              Henüz gelen bir talep yok.
            </div>
          )}

          {talepler.map((t) => (
            <div
              key={t.id}
              className={`p-5 rounded-xl border bg-white shadow-sm transition ${
                t.okundu ? 'border-slate-200' : 'border-blue-400 bg-blue-50/30'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {!t.okundu && (
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        YENİ
                      </span>
                    )}
                    <span className="text-xs font-semibold text-slate-500">Alıcı: {t.hoca}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{t.konu}</h3>
                </div>
                <span className="text-xs text-slate-400 whitespace-nowrap">{t.tarih}</span>
              </div>

              <p className="text-sm text-slate-600 mb-4">{t.mesaj}</p>

              <div className="flex justify-end gap-4 border-t border-slate-100 pt-3">
                {!t.okundu && (
                  <button
                    onClick={() => okunduYap(t.id)}
                    className="text-xs text-blue-600 font-semibold hover:underline"
                  >
                    Okundu İşaretle
                  </button>
                )}
                <button
                  onClick={() => sil(t.id)}
                  className="text-xs text-rose-600 font-semibold hover:underline"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}