import { ArrowLeft, CreditCard, Building2, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface PaymentPageProps {
  selectedCompany: string;
  selectedPrice: number;
  vehicleInfo: string;
  onBack: () => void;
  onBackToHome: () => void;
  onOrderComplete?: () => void;
}

export default function PaymentPage({ selectedCompany, selectedPrice, vehicleInfo, onBack, onBackToHome, onOrderComplete }: PaymentPageProps) {
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'card'>('transfer');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const bankAccounts = [
    {
      bank: 'Ziraat Bankası',
      iban: 'TR12 0001 0000 0000 0000 0000 01',
      accountName: 'Sigorta Aracı A.Ş.',
      branch: 'Merkez Şubesi'
    },
    {
      bank: 'Yapı Kredi Bankası',
      iban: 'TR34 0006 7000 0000 0000 0000 02',
      accountName: 'Sigorta Aracı A.Ş.',
      branch: 'Merkez Şubesi'
    }
  ];

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300 mb-4 px-3 py-2 rounded-lg border border-transparent hover:border-slate-200 hover:shadow-sm transform hover:scale-[1.02]"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Fiyat Karşılaştırmasına Dön
          </button>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Ödeme</h1>
          <p className="text-slate-600">Seçilen sigorta için ödeme işlemini tamamlayın</p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Sipariş Özeti</h2>
          
          <div className="space-y-3 border-b pb-4 mb-4">
            <div className="flex justify-between">
              <span className="text-slate-600">Araç:</span>
              <span className="font-semibold text-slate-900">{vehicleInfo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Sigorta Şirketi:</span>
              <span className="font-semibold text-slate-900">{selectedCompany}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Trafik Sigortası:</span>
              <span className="font-semibold text-slate-900">₺{selectedPrice.toLocaleString('tr-TR')}</span>
            </div>
          </div>

          <div className="flex justify-between text-lg font-bold">
            <span>Toplam:</span>
            <span className="text-blue-600">₺{selectedPrice.toLocaleString('tr-TR')}</span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Ödeme Yöntemi</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setPaymentMethod('transfer')}
              className={`p-4 border-2 rounded-lg transition-all flex items-center ${
                paymentMethod === 'transfer'
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <Building2 className={`w-6 h-6 mr-3 ${
                paymentMethod === 'transfer' ? 'text-blue-600' : 'text-slate-600'
              }`} />
              <div className="text-left">
                <p className={`font-semibold ${
                  paymentMethod === 'transfer' ? 'text-blue-900' : 'text-slate-900'
                }`}>Havale/EFT</p>
                <p className="text-sm text-slate-600">Banka hesabına transfer</p>
              </div>
            </button>

            <button
              onClick={() => setPaymentMethod('card')}
              className={`p-4 border-2 rounded-lg transition-all flex items-center ${
                paymentMethod === 'card'
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <CreditCard className={`w-6 h-6 mr-3 ${
                paymentMethod === 'card' ? 'text-blue-600' : 'text-slate-600'
              }`} />
              <div className="text-left">
                <p className={`font-semibold ${
                  paymentMethod === 'card' ? 'text-blue-900' : 'text-slate-900'
                }`}>Kredi Kartı</p>
                <p className="text-sm text-slate-600">Online ödeme</p>
              </div>
            </button>
          </div>

          {paymentMethod === 'transfer' && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Havale/EFT Talimatları</h3>
                <p className="text-green-800 text-sm">
                  Aşağıdaki banka hesaplarından birini seçerek ödemenizi gerçekleştirebilirsiniz. 
                  Açıklama kısmına araç plaka bilginizi yazmayı unutmayınız.
                </p>
              </div>

              {bankAccounts.map((account, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    {account.bank}
                  </h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">IBAN:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-900">{account.iban}</span>
                        <button
                          onClick={() => copyToClipboard(account.iban, `iban-${index}`)}
                          className="p-1 hover:bg-slate-100 rounded transition-colors"
                        >
                          {copiedField === `iban-${index}` ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-slate-600" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-600">Hesap Sahibi:</span>
                      <span className="font-semibold text-slate-900">{account.accountName}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-600">Şube:</span>
                      <span className="text-slate-900">{account.branch}</span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  <strong>Önemli:</strong> Havale/EFT açıklama kısmına araç plaka numaranızı yazmayı unutmayın. 
                  Ödeme onayı için dekont fotoğrafını WhatsApp üzerinden gönderebilirsiniz.
                </p>
              </div>

              <button
                onClick={onOrderComplete}
                className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-[1.02] shadow-lg text-lg"
              >
                Siparişi Bitir
              </button>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                Kredi Kartı ile Ödeme
              </h3>
              <p className="text-slate-500 mb-4">
                Bu özellik çok yakında kullanıma sunulacak!
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
                <p className="text-blue-800 text-sm">
                  Şu anda sadece havale/EFT ile ödeme kabul edilmektedir.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="flex-1 bg-slate-200 text-slate-700 py-4 rounded-lg font-semibold hover:bg-slate-300 transition-all"
          >
            Geri
          </button>
          <button
            onClick={onBackToHome}
            className="flex-1 bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-[1.02] shadow-lg"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    </div>
  );
}