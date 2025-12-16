import { Shield, TrendingUp, TrendingDown, Home, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface Vehicle {
  id: number;
  marka: string;
  model: string;
  yil: string;
  sigortalar: Record<string, number>;
}

interface PriceResultsProps {
  vehicle: Vehicle;
  onNewQuery: () => void;
  onBackToHome: () => void;
  onGoToPayment?: (company: string, price: number) => void;
}

export default function PriceResults({ vehicle, onNewQuery, onBackToHome, onGoToPayment }: PriceResultsProps) {
  const [selectedInsurance, setSelectedInsurance] = useState<{company: string, price: number} | null>(null);
  
  const allCompanies = Object.entries(vehicle.sigortalar);

  const kaskoEntry = allCompanies.find(([company]) =>
    company.toLowerCase().includes('kasko') || company.toLowerCase().includes('bedeli')
  );

  const kaskoPrice = kaskoEntry ? kaskoEntry[1] : null;

  const insuranceCompanies = kaskoPrice
    ? allCompanies.filter(([, price]) => price !== kaskoPrice)
    : allCompanies;

  const prices = insuranceCompanies.map(([, price]) => price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  // ...existing code...

  const sortedCompanies = insuranceCompanies.sort(([, a], [, b]) => a - b);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-slate-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Fiyat Karşılaştırması</h1>
          <p className="text-slate-600">
            {vehicle.marka} {vehicle.model} ({vehicle.yil})
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-linear-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-green-100 text-sm font-medium">En Uygun Fiyat</p>
              <TrendingDown className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold">₺{minPrice.toLocaleString('tr-TR')}</p>
            <p className="text-green-100 text-xs mt-2">
              {sortedCompanies[0][0]}
            </p>
          </div>

          <div className="bg-linear-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-orange-100 text-sm font-medium">En Yüksek Fiyat</p>
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold">₺{maxPrice.toLocaleString('tr-TR')}</p>
            <p className="text-orange-100 text-xs mt-2">
              {sortedCompanies[sortedCompanies.length - 1][0]}
            </p>
          </div>
        </div>

        {/* Zorunlu Trafik Sigortası Bilgi Kutusu */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Zorunlu Trafik Sigortası Kapsamı</h3>
          <p className="text-blue-800 text-sm mb-4">
            Zorunlu Trafik Sigortası kapsamındaki Temel Koruma Teminatları tüm sigorta şirketlerinde aynıdır. 
            Yalnızca Ek Paket Teminatları farklılık gösterebilir.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-blue-900">Kişi Başı Ölüm/Sakatlık:</span>
                <span className="text-blue-800">2.700.000 TL</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-blue-900">Kaza Başı Ölüm/Sakatlık:</span>
                <span className="text-blue-800">27.000.000 TL</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-blue-900">Araç Başı Maddi Zarar:</span>
                <span className="text-blue-800">300.000 TL</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-blue-900">Kaza Başı Maddi Zarar:</span>
                <span className="text-blue-800">600.000 TL</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-blue-900">Yedek Parça:</span>
                <span className="text-blue-800">Orijinal Parça</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Sigorta Şirketlerini Karşılaştırın ve Seçin</h2>

          <div className="space-y-3">
            {sortedCompanies.map(([company, price], index) => {
              const isLowest = price === minPrice;
              const percentageDiff = ((price - minPrice) / minPrice) * 100;
              const isSelected = selectedInsurance?.company === company;

              return (
                <div
                  key={company}
                  onClick={() => setSelectedInsurance({company, price})}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all hover:shadow-md cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
                      : isLowest
                      ? 'bg-green-50 border-green-500 hover:border-green-600'
                      : 'bg-slate-50 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="insurance"
                        checked={isSelected}
                        onChange={() => setSelectedInsurance({company, price})}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      isSelected 
                        ? 'bg-blue-600 text-white'
                        : isLowest 
                        ? 'bg-green-600 text-white' 
                        : 'bg-slate-300 text-slate-700'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{company}</p>
                      {isLowest && (
                        <p className="text-xs text-green-600 font-medium">En Uygun Fiyat</p>
                      )}
                      {isSelected && (
                        <p className="text-xs text-blue-600 font-medium">Seçildi</p>
                      )}
                      {!isLowest && percentageDiff > 0 && !isSelected && (
                        <p className="text-xs text-slate-500">
                          +₺{(price - minPrice).toLocaleString('tr-TR')} ({percentageDiff.toFixed(1)}% daha pahalı)
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${
                      isSelected 
                        ? 'text-blue-600'
                        : isLowest 
                        ? 'text-green-600' 
                        : 'text-slate-900'
                    }`}>
                      ₺{price.toLocaleString('tr-TR')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {selectedInsurance && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-blue-900">Seçilen Sigorta:</p>
                  <p className="text-blue-800">{selectedInsurance.company}</p>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  ₺{selectedInsurance.price.toLocaleString('tr-TR')}
                </p>
              </div>
              <button
                onClick={() => onGoToPayment?.(selectedInsurance.company, selectedInsurance.price)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Sepete Git
              </button>
            </div>
          )}
        </div>

        {kaskoPrice && (
          <div className="bg-slate-100 rounded-2xl p-8 border border-slate-300 mb-8">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Araç Kasko Bedeli</h3>
            <p className="text-3xl font-bold text-slate-700">
              ₺{kaskoPrice.toLocaleString('tr-TR')}
            </p>
            <p className="text-sm text-slate-600 mt-2">
              Kasko bedeli sigorta fiyatları ile karşılaştırılmaz
            </p>
          </div>
        )}

          <div className="bg-linear-to-r from-blue-600 to-blue-800 rounded-2xl shadow-xl p-8 text-white mb-6">
          <h3 className="text-xl font-bold mb-3">Tasarruf Potansiyeli</h3>
          <p className="text-blue-100 mb-4">
            En uygun fiyatı seçerek <span className="text-2xl font-bold text-yellow-300">₺{(maxPrice - minPrice).toLocaleString('tr-TR')}</span> tasarruf edebilirsiniz!
          </p>
          <p className="text-sm text-blue-100">
            En pahalı sigorta ile en uygun sigorta arasındaki farktır.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onNewQuery}
            className="flex-1 bg-slate-200 text-slate-700 py-4 rounded-lg font-semibold hover:bg-slate-300 transition-all"
          >
            Yeni Sorgulama
          </button>
          <button
            onClick={onBackToHome}
            className="flex items-center justify-center px-6 py-4 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-700 transition-all"
          >
            <Home className="w-5 h-5 mr-2" />
            Ana Sayfa
          </button>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-slate-500">
            Fiyatlar anlık olarak güncellenmektedir. Güncel fiyatlar için tekrar sorgulama yapabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
}
