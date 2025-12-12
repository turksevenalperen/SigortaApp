/* eslint-disable react/no-unescaped-entities */
import { Shield, CheckCircle, TrendingDown, Clock } from 'lucide-react';

interface HomePageProps {
  onStart: () => void;
}

export default function HomePage({ onStart }: HomePageProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-slate-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-16 pt-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            SigortaApp
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Araç sigortası fiyatlarını anında karşılaştırın, en uygun teklifi bulun
          </p>
        </header>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">
              Neden SigortaApp?
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-blue-50">
                <div className="shrink-0">
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Tüm Sigorta Şirketleri</h3>
                  <p className="text-slate-600 text-sm">
                    Türkiye'deki tüm sigorta şirketlerinin fiyatlarını tek platformda
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-lg bg-green-50">
                <div className="shrink-0">
                  <TrendingDown className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">En Uygun Fiyat</h3>
                  <p className="text-slate-600 text-sm">
                    Anlık olarak en düşük fiyatı bulun, paradan tasarruf edin
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-lg bg-orange-50">
                <div className="shrink-0">
                  <Clock className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Hızlı Sonuç</h3>
                  <p className="text-slate-600 text-sm">
                    Sadece 3 adımda tüm fiyatları öğrenin
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-lg bg-slate-50">
                <div className="shrink-0">
                  <Shield className="w-8 h-8 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Güvenli</h3>
                  <p className="text-slate-600 text-sm">
                    Bilgileriniz SSL ile korunur ve üçüncü kişilerle paylaşılmaz
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={onStart}
                className="bg-blue-600 text-white px-12 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Fiyat Öğren
              </button>
              <p className="text-sm text-slate-500 mt-4">
                2 dakikada tamamlayın
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-linear-to-r from-blue-600 to-blue-800 rounded-2xl shadow-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4 text-center">Nasıl Çalışır?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-white text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl">
                  1
                </div>
                <h3 className="font-semibold mb-2">Kimlik Bilgileri</h3>
                <p className="text-blue-100 text-sm">
                  TC kimlik ve iletişim bilgilerinizi girin
                </p>
              </div>
              <div className="text-center">
                <div className="bg-white text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl">
                  2
                </div>
                <h3 className="font-semibold mb-2">Araç Bilgileri</h3>
                <p className="text-blue-100 text-sm">
                  Ruhsat ve araç bilgilerinizi ekleyin
                </p>
              </div>
              <div className="text-center">
                <div className="bg-white text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl">
                  3
                </div>
                <h3 className="font-semibold mb-2">Fiyatları Görün</h3>
                <p className="text-blue-100 text-sm">
                  Tüm sigorta şirketlerinin fiyatlarını karşılaştırın
                </p>
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center mt-16 pb-8">
          <p className="text-slate-500 text-sm">
            © 2025 SigortaApp - Tüm hakları saklıdır
          </p>
        </footer>
      </div>
    </div>
  );
}
