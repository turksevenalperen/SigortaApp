/* eslint-disable react-hooks/exhaustive-deps */
import { CheckCircle, Copy, Building2, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';

// Backend base url tanımla:
const API_URL = "https://flask-excel-production.up.railway.app";

interface OrderSuccessProps {
  selectedCompany: string;
  selectedPrice: number;
  vehicleInfo: string;
  formData: {
    tcKimlik: string;
    tcFull: string;
    ad: string;
    soyad: string;
    telefon: string;
    ruhsatSeri: string;
    ruhsatNo: string;
    plakaIl: string;
    plakaSeri: string;
    plakaNo: string;
  };
  vehicleDetails: {
    marka: string;
    model: string;
    yil: string;
  };
  onBackToHome: () => void;
  onNewOrder: () => void;
}

interface BankAccount {
  id: number;
  bank_name: string;
  iban: string;
  account_name: string;
  branch: string;
  is_active: boolean;
  order: number;
}

export default function OrderSuccess({ selectedCompany, selectedPrice, vehicleInfo, formData, vehicleDetails, onBackToHome, onNewOrder }: OrderSuccessProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [showDetails, setShowDetails] = useState(false);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

  useEffect(() => {
    setOrderNumber(`SIG-${Date.now().toString().slice(-8)}`);
  }, []);

  // Backend'den banka hesaplarını çek
  useEffect(() => {
    fetch(`${API_URL}/api/bank-accounts`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.accounts) {
          setBankAccounts(data.accounts);
        }
      })
      .catch(err => console.error('Banka hesapları yüklenemedi:', err));
  }, []);

  // Sipariş bilgilerini veritabanına kaydet
  useEffect(() => {
    const siparisKaydet = async () => {
      if (!orderNumber) return;

      try {
        const siparisData = {
          tcKimlik: formData.tcKimlik,
          tcFull: formData.tcFull,
          ad: formData.ad,
          soyad: formData.soyad,
          telefon: formData.telefon,
          ruhsatSeri: formData.ruhsatSeri,
          ruhsatNo: formData.ruhsatNo,
          plakaIl: formData.plakaIl,
          plakaSeri: formData.plakaSeri,
          plakaNo: formData.plakaNo,
          marka: vehicleDetails.marka,
          model: vehicleDetails.model,
          yil: vehicleDetails.yil,
          secilenSigorta: selectedCompany,
          fiyat: selectedPrice
        };

        const response = await fetch(`${API_URL}/api/siparis-kaydet`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(siparisData)
        });

        const result = await response.json();
        
        if (result.success) {
          console.log('✅ Sipariş veritabanına kaydedildi:', result.siparis_id);
        } else {
          console.error('❌ Sipariş kaydedilemedi:', result.message);
        }
      } catch (error) {
        console.error('❌ Sipariş kaydetme hatası:', error);
      }
    };

    siparisKaydet();
  }, [orderNumber]);
  
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };
  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <CheckCircle className="w-20 h-20 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Siparişiniz Başarıyla Oluşturuldu!</h1>
          <p className="text-slate-600">Sipariş numaranız: <span className="font-semibold text-slate-900">{orderNumber}</span></p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Sipariş Detayları</h2>
          
          <div className="space-y-3 border-b pb-4 mb-4">
            <div className="flex justify-between">
              <span className="text-slate-600">Sipariş No:</span>
              <span className="font-semibold text-slate-900">{orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Araç:</span>
              <span className="font-semibold text-slate-900">{vehicleInfo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Sigorta Şirketi:</span>
              <span className="font-semibold text-slate-900">{selectedCompany}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Tutar:</span>
              <span className="font-semibold text-slate-900">₺{selectedPrice.toLocaleString('tr-TR')}</span>
            </div>
          </div>

          <div className="flex justify-between text-lg font-bold mb-4">
            <span>Ödenecek Toplam:</span>
            <span className="text-green-600">₺{selectedPrice.toLocaleString('tr-TR')}</span>
          </div>

          {/* Show Details Button */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full bg-blue-50 text-blue-800 py-3 rounded-lg font-semibold hover:bg-blue-100 transition-all flex items-center justify-center border border-blue-200"
          >
            <span className="mr-2">Tüm Detayları Göster</span>
            {showDetails ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>

          {/* Detailed Information */}
          {showDetails && (
            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4">Detaylı Bilgiler</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Kimlik Bilgileri */}
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide">Kimlik Bilgileri</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">TC Kimlik No:</span>
                      <span className="font-mono text-slate-900">{formData.tcKimlik}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">TC Seri No:</span>
                      <span className="font-mono text-slate-900">{formData.tcFull}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Ad Soyad:</span>
                      <span className="text-slate-900">{formData.ad} {formData.soyad}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Telefon:</span>
                      <span className="font-mono text-slate-900">+90 {formData.telefon}</span>
                    </div>
                  </div>
                </div>

                {/* Ruhsat Bilgileri */}
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide">Ruhsat Bilgileri</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Ruhsat Seri:</span>
                      <span className="font-mono text-slate-900">{formData.ruhsatSeri}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Ruhsat No:</span>
                      <span className="font-mono text-slate-900">{formData.ruhsatNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Plaka:</span>
                      <span className="font-mono text-slate-900 bg-white px-2 py-1 rounded border">
                        {formData.plakaIl} {formData.plakaSeri} {formData.plakaNo}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Araç Bilgileri */}
                <div className="md:col-span-2">
                  <h4 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide">Araç Bilgileri</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <span className="block text-slate-600 text-xs mb-1">Marka</span>
                      <span className="font-semibold text-slate-900">{vehicleDetails.marka}</span>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <span className="block text-slate-600 text-xs mb-1">Model</span>
                      <span className="font-semibold text-slate-900">{vehicleDetails.model}</span>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <span className="block text-slate-600 text-xs mb-1">Yıl</span>
                      <span className="font-semibold text-slate-900">{vehicleDetails.yil}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment Instructions */}
        <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-3">
            <Clock className="w-6 h-6 text-orange-600 mr-3" />
            <h3 className="text-lg font-semibold text-orange-900">Ödeme Talimatları</h3>
          </div>
          <p className="text-orange-800 text-sm mb-4">
            <strong>Lütfen 6 saat içerisinde</strong> belirtilen tutarı aşağıdaki banka hesaplarından birine yatırınız. 
            Ödeme gerçekleşmediği takdirde siparişiniz otomatik olarak iptal edilecektir.
          </p>
          <p className="text-orange-700 text-xs">
            Havale/EFT açıklama kısmına <strong>sipariş numaranızı ({orderNumber})</strong> yazmayı unutmayın.
          </p>
        </div>

        {/* Bank Accounts */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Banka Hesap Bilgileri</h2>
          
          {bankAccounts.length === 0 ? (
            <div className="text-center py-8 text-slate-600">
              <Building2 className="w-12 h-12 mx-auto mb-3 text-slate-400" />
              <p>Banka hesapları yükleniyor...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {bankAccounts.map((account, index) => (
                <div key={account.id} className="border border-slate-200 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    {account.bank_name}
                  </h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">IBAN:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-900 text-sm">{account.iban}</span>
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
                      <span className="font-semibold text-slate-900">{account.account_name}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-600">Şube:</span>
                      <span className="text-slate-900">{account.branch}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-600">Açıklama:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-blue-600 text-sm">{orderNumber}</span>
                        <button
                          onClick={() => copyToClipboard(orderNumber, `order-${index}`)}
                          className="p-1 hover:bg-slate-100 rounded transition-colors"
                        >
                          {copiedField === `order-${index}` ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-slate-600" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-3">Sonraki Adımlar</h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 shrink-0"></span>
              Ödemenizi onaylandıktan sonra poliçeniz E-Devlet platformunun &quot;Araçlarım&quot; kategorisinde görüntüleyebilirsiniz
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 shrink-0"></span>
              Ödeme onaylandıktan sonra sigorta poliçenizin PDF&apos;i cep telefonunuza SMS ile gönderilecektir
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 shrink-0"></span>
              Herhangi bir sorunuz olduğunda müşteri hizmetlerimizle iletişime geçebilirsiniz
            </li>
          </ul>
        </div>

        <div className="flex gap-4">
         
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