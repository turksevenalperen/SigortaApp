/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from 'react';
import { Shield, CheckCircle, ChevronDown, TrendingUp, DollarSign, Headphones } from 'lucide-react';

interface HomePageProps {
  onStart: () => void;
}

const API_URL = "https://flask-excel-production.up.railway.app";

export default function HomePage({ onStart }: HomePageProps) {
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'campaigns' | 'cancel'>('home');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    plate: ''
  });
  const [plateInputs, setPlateInputs] = useState({
    city: '',
    letters: '',
    numbers: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    plate: ''
  });

  // Backend'den logo yükle
  useEffect(() => {
    fetch(`${API_URL}/api/logo`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.logo_url) {
          setLogoImage(`${data.logo_url}?t=${Date.now()}`);
        }
      })
      .finally(() => setIsAppLoaded(true));
  }, []);

  const validateName = (name: string) => {
    if (!name.trim()) { return 'Ad soyad gereklidir'; }
    if (/\d/.test(name)) { return 'Ad soyad rakam içeremez'; }
    return '';
  };

  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/\s/g, '');
    if (!cleaned) { return 'Telefon numarası gereklidir'; }
    if (!cleaned.startsWith('5')) { return 'Telefon numarası 5 ile başlamalıdır'; }
    if (!/^\d+$/.test(cleaned)) { return 'Telefon numarası sadece rakam içermelidir'; }
    if (cleaned.length !== 10) { return 'Telefon numarası 10 haneli olmalıdır'; }
    return '';
  };

  const validatePlate = () => {
    if (!plateInputs.city || !plateInputs.letters || !plateInputs.numbers) {
      return 'Tüm plaka alanları doldurulmalıdır';
    }
    const cityNum = parseInt(plateInputs.city);
    if (cityNum < 1 || cityNum > 81) { return 'Plaka kodu 01-81 arası olmalıdır'; }
    if (!/^[A-Z]+$/.test(plateInputs.letters)) {
      return 'Plaka harfleri sadece büyük harf içermelidir';
    }
    if (!/^\d+$/.test(plateInputs.numbers)) {
      return 'Plaka numarası sadece rakam içermelidir';
    }
    if (plateInputs.numbers.length > 5) {
      return 'Plaka numarası maksimum 5 haneli olabilir';
    }
    return '';
  };

  const handleNameChange = (value: string) => {
    setFormData({...formData, name: value});
    setErrors({...errors, name: validateName(value)});
  };

  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      setFormData({...formData, phone: cleaned});
      setErrors({...errors, phone: validatePhone(cleaned)});
    }
  };

  const handlePlateCityChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 2) {
      setPlateInputs({...plateInputs, city: cleaned});
      setErrors({...errors, plate: ''});
    }
  };

  const handlePlateLettersChange = (value: string) => {
    const upper = value.toUpperCase().replace(/[^A-Z]/g, '');
    if (upper.length <= 3) {
      setPlateInputs({...plateInputs, letters: upper});
      setErrors({...errors, plate: ''});
    }
  };

  const handlePlateNumbersChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 5) {
      setPlateInputs({...plateInputs, numbers: cleaned});
      setErrors({...errors, plate: ''});
    }
  };

  const handleFormSubmit = async () => {
    const nameError = validateName(formData.name);
    const phoneError = validatePhone(formData.phone);
    const plateError = validatePlate();

    if (nameError || phoneError || plateError) {
      setErrors({
        name: nameError,
        phone: phoneError,
        plate: plateError
      });
      return;
    }

    const fullPlate = `${plateInputs.city} ${plateInputs.letters} ${plateInputs.numbers}`;

    try {
      const response = await fetch(`${API_URL}/api/cancel-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          plate: fullPlate
        })
      });
      const result = await response.json();
      if (result.success) {
        setFormSubmitted(true);
        setTimeout(() => {
          setFormSubmitted(false);
          setFormData({ name: '', phone: '', plate: '' });
          setPlateInputs({ city: '', letters: '', numbers: '' });
          setErrors({ name: '', phone: '', plate: '' });
        }, 3000);
      } else {
        alert('❌ Bir hata oluştu: ' + result.message);
      }
    } catch (error) {
      console.error('Form gönderme hatası:', error);
      alert('❌ Bağlantı hatası!');
    }
  };

  const handleProductClick = (product: string) => {
    if (product !== 'kasko') {
      onStart();
      setProductMenuOpen(false);
    }
  };

  // -------- YÜKLENİYOR EKRANI ---------
  if (!isAppLoaded) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-linear-to-br from-blue-50 via-white to-slate-50">
<div className="animate-spin rounded-full h-16 w-16 border-t-4 border-t-blue-600 border-b-4 border-b-blue-300 mb-5"></div>
        <div className="text-xl text-blue-800 font-bold">Yükleniyor...</div>
      </div>
    );
  }

  // -------- ANA SAYFA (HEPSİ YAKINDAKİ GİBİ DEVAM) ---------
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-slate-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              {logoImage ? (
                <img src={logoImage} alt="Logo" className="w-14 h-14 rounded-full object-cover" />
              ) : (
                <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              )}
              <span className="text-2xl font-bold text-slate-900">SigortaApp</span>
            </div>

            <div className="flex items-center space-x-8">
              <div className="relative">
                <button
                  onClick={() => setProductMenuOpen(!productMenuOpen)}
                  className="flex items-center space-x-1 text-slate-700 hover:text-blue-600 font-medium transition-colors"
                >
                  <span>Ürünlerimiz</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${productMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {productMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 py-2 min-w-[200px]">
                    <div className="px-4 py-2 font-semibold text-slate-900 border-b border-slate-200">
                      Aracım
                    </div>
                    <button
                      onClick={() => handleProductClick('trafik')}
                      className="w-full text-left px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      Trafik Sigortası
                    </button>
                    <button
                      onClick={() => handleProductClick('2el-trafik')}
                      className="w-full text-left px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      2. El Trafik Sigortası
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-slate-400"
                      aria-disabled="true"
                    >
                      Kasko (Yakında)
                    </button>
                    <button
                      onClick={() => handleProductClick('noter')}
                      className="w-full text-left px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      Noter Satış Sigortası
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setCurrentView('campaigns')}
                className="text-slate-700 hover:text-blue-600 font-medium transition-colors"
              >
                Kampanyalar
              </button>

              <button
                onClick={() => setCurrentView('cancel')}
                className="text-slate-700 hover:text-blue-600 font-medium transition-colors"
              >
                Poliçe İptal İşlemleri
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Home View */}
      {currentView === 'home' && (
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-16 pt-8">
            <h1 className="text-5xl font-bold text-slate-900 mb-4">
              Araç Sigortası Karşılaştırma
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
                    <TrendingUp className="w-8 h-8 text-green-600" />
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
                    <DollarSign className="w-8 h-8 text-orange-600" />
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

          <div className="max-w-6xl mx-auto mb-16">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3 text-center">
                  Doğru Ürün
                </h3>
                <p className="text-slate-600 text-center">
                  Yenilenen yapay zekâmızla, onlarca sigorta teklifi arasından ucuzunu, sana uygununu ve kapsamlısını buluyoruz. Net teminatlar ve net fiyatlarla kararın hep net olsun.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
                <div className="flex items-center justify-center mb-4">
                  <DollarSign className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3 text-center">
                  İyi Fiyat
                </h3>
                <p className="text-slate-600 text-center">
                  Önceliğimiz her zaman sensin. Çalıştığımız tüm şirketlerde bütçeni düşünerek "en iyi fiyat garantisi" sunuyoruz.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
                <div className="flex items-center justify-center mb-4">
                  <Headphones className="w-12 h-12 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3 text-center">
                  7/24 Hizmet
                </h3>
                <p className="text-slate-600 text-center">
                  25 yıllık tecrübemiz ve uzman sigorta danışmanlarımızla 7/24 her ihtiyacında yanındayız. Üstelik hasar anında saniyeler içinde bize ulaşabilirsin.
                </p>
              </div>
            </div>
          </div>

          <footer className="text-center mt-16 pb-8">
            <p className="text-slate-500 text-sm">
              © 2025 SigortaApp - Tüm hakları saklıdır
            </p>
          </footer>
        </div>
      )}

      {/* Campaigns View */}
      {currentView === 'campaigns' && (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold text-slate-900 mb-8 text-center">Kampanyalar</h1>
            
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
              <div className="grid md:grid-cols-2">
                <div className="bg-linear-to-br from-blue-500 to-blue-700 p-8 flex items-center justify-center">
                  <div className="w-full h-full flex items-center justify-center min-h-[300px]">
                    <img src="/p0g845ypfvsxn2y2.png" alt="Kampanya" className="w-full h-full object-cover rounded-lg" />
                  </div>
                </div>
                <div className="p-8">
                  <div className="bg-linear-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg inline-block mb-6">
                    <span className="text-3xl font-bold">%30 İNDİRİM</span>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">
                    5. Yıla Özel Kampanya
                  </h2>
                  <p className="text-slate-600 text-lg mb-6">
                    5. yıla özel havale ve EFT ödeme işlemlerinizde <span className="font-bold text-blue-600">%30 indirim</span> fırsatından yararlanın!
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-1" />
                      <span className="text-slate-600">Tüm sigorta türlerinde geçerli</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-1" />
                      <span className="text-slate-600">Havale ve EFT ödemelerine özel</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-1" />
                      <span className="text-slate-600">Kampanya süresi boyunca sınırsız kullanım</span>
                    </div>
                  </div>
                  <button
                    onClick={onStart}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all w-full"
                  >
                    Hemen Fiyat Öğren
                  </button>
                </div>
              </div>
            </div>
            <div className="text-center mt-8">
              <button
                onClick={() => setCurrentView('home')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Ana Sayfaya Dön
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Policy View */}
      {currentView === 'cancel' && (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-slate-900 mb-8 text-center">Poliçe İptal İşlemleri</h1>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              {!formSubmitted ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                        errors.name ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="Adınız ve soyadınız"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                        errors.phone ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="5555555555"
                      maxLength={10}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      Araç Plakası
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={plateInputs.city}
                        onChange={(e) => handlePlateCityChange(e.target.value)}
                        className={`w-20 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-center ${
                          errors.plate ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="34"
                        maxLength={2}
                      />
                      <input
                        type="text"
                        value={plateInputs.letters}
                        onChange={(e) => handlePlateLettersChange(e.target.value)}
                        className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-center uppercase ${
                          errors.plate ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="ABC"
                        maxLength={3}
                      />
                      <input
                        type="text"
                        value={plateInputs.numbers}
                        onChange={(e) => handlePlateNumbersChange(e.target.value)}
                        className={`w-28 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-center ${
                          errors.plate ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="12345"
                        maxLength={5}
                      />
                    </div>
                    {errors.plate && (
                      <p className="text-red-500 text-sm mt-1">{errors.plate}</p>
                    )}
                  </div>
                  <button
                    onClick={handleFormSubmit}
                    className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Gönder
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="flex justify-center mb-4">
                    <CheckCircle className="w-20 h-20 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Teşekkürler!</h2>
                  <p className="text-slate-600 text-lg">
                    İşleminiz kayda alınmıştır. Size telefonla dönüş yapacağız.
                  </p>
                </div>
              )}
            </div>
            <div className="text-center mt-8">
              <button
                onClick={() => {
                  setCurrentView('home');
                  setFormSubmitted(false);
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Ana Sayfaya Dön
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}