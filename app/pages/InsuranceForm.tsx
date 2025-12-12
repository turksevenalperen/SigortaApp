import { useState, useEffect } from 'react';
import Select from 'react-select';
import { ChevronRight, Check, Loader2, ArrowLeft, Shield } from 'lucide-react';
import PriceResults from '../components/PriceResults';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://flask-excel-production.up.railway.app/api';

interface Vehicle {
  id: number;
  marka: string;
  model: string;
  yil: string;
  sigortalar: Record<string, number>;
}

interface SelectOption {
  value: string;
  label: string;
}

interface InsuranceFormProps {
  onBack: () => void;
}

export default function InsuranceForm({ onBack }: InsuranceFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    tcKimlik: '',
    tcFull: '',
    ad: '',
    soyad: '',
    telefon: '',
    ruhsatSeri: '',
    ruhsatNo: '',
    plakaIl: '',
    plakaSeri: '',
    plakaNo: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [brands, setBrands] = useState<SelectOption[]>([]);
  const [models, setModels] = useState<SelectOption[]>([]);
  const [years, setYears] = useState<SelectOption[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<SelectOption | null>(null);
  const [selectedModel, setSelectedModel] = useState<SelectOption | null>(null);
  const [selectedYear, setSelectedYear] = useState<SelectOption | null>(null);

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [showPrices, setShowPrices] = useState(false);

  const customStyles = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: (provided: any, state: any) => ({
      ...provided,
      padding: '4px',
      borderColor: state.isFocused ? '#3b82f6' : '#cbd5e1',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.3)' : 'none',
      '&:hover': { borderColor: '#3b82f6' }
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    menu: (provided: any) => ({ ...provided, zIndex: 9999 }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#dbeafe' : 'white',
      color: state.isSelected ? 'white' : '#1e293b'
    })
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.tcKimlik || formData.tcKimlik.length !== 11) {
      newErrors.tcKimlik = 'TC Kimlik No 11 haneli olmalıdır';
    } else if (!/^\d{11}$/.test(formData.tcKimlik)) {
      newErrors.tcKimlik = 'TC Kimlik No sadece rakamlardan oluşmalıdır';
    }

    if (!formData.tcFull || formData.tcFull.length !== 8) {
      newErrors.tcFull = 'TC Seri No 8 karakter olmalıdır (örn: A49L2955)';
    } else if (!/^[A-Z0-9]{8}$/.test(formData.tcFull)) {
      newErrors.tcFull = 'TC Seri No harfler ve rakamlardan oluşmalıdır';
    }

    if (!formData.ad || formData.ad.trim() === '') {
      newErrors.ad = 'Ad gereklidir';
    }

    if (!formData.soyad || formData.soyad.trim() === '') {
      newErrors.soyad = 'Soyad gereklidir';
    }

    if (!formData.telefon || formData.telefon.length !== 10) {
      newErrors.telefon = 'Telefon 10 haneli olmalıdır';
    } else if (!/^5\d{9}$/.test(formData.telefon)) {
      newErrors.telefon = 'Telefon 5XXXXXXXXX formatında olmalıdır';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.ruhsatSeri || formData.ruhsatSeri.length !== 2) {
      newErrors.ruhsatSeri = 'Ruhsat Seri 2 harf olmalıdır (örn: HU)';
    } else if (!/^[A-Z]{2}$/.test(formData.ruhsatSeri)) {
      newErrors.ruhsatSeri = 'Ruhsat Seri sadece harflerden oluşmalıdır';
    }

    if (!formData.ruhsatNo || formData.ruhsatNo.length !== 6) {
      newErrors.ruhsatNo = 'Ruhsat No 6 rakam olmalıdır (örn: 779350)';
    } else if (!/^\d{6}$/.test(formData.ruhsatNo)) {
      newErrors.ruhsatNo = 'Ruhsat No sadece rakamlardan oluşmalıdır';
    }

    if (!formData.plakaIl || formData.plakaIl.length !== 2) {
      newErrors.plakaIl = 'Plaka İl Kodu 2 rakam olmalıdır (01-81)';
    } else if (!/^\d{2}$/.test(formData.plakaIl) || Number(formData.plakaIl) < 1 || Number(formData.plakaIl) > 81) {
      newErrors.plakaIl = 'Plaka İl Kodu 01-81 arasında olmalıdır';
    }

    if (!formData.plakaSeri || formData.plakaSeri.length < 1 || formData.plakaSeri.length > 4) {
      newErrors.plakaSeri = 'Plaka Seri 1-4 harf olmalıdır (örn: A, AB, ABC, ABCD)';
    } else if (!/^[A-Z]{1,4}$/.test(formData.plakaSeri)) {
      newErrors.plakaSeri = 'Plaka Seri sadece harflerden oluşmalıdır';
    }

    if (!formData.plakaNo || formData.plakaNo.length < 1 || formData.plakaNo.length > 4) {
      newErrors.plakaNo = 'Plaka No 1-4 rakam olmalıdır (örn: 1, 12, 123, 1234)';
    } else if (!/^\d{1,4}$/.test(formData.plakaNo)) {
      newErrors.plakaNo = 'Plaka No sadece rakamlardan oluşmalıdır';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleStep1Next = async () => {
    if (!validateStep1()) return;

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setCurrentStep(2);
  };

  const handleStep2Next = async () => {
    if (!validateStep2()) return;

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setCurrentStep(3);
  };

  useEffect(() => {
    if (currentStep === 3) {
      const fetchBrands = async () => {
        try {
          const res = await fetch(`${API_BASE}/brands`);
          const data = await res.json();
          setBrands(data.map((b: string) => ({ value: b, label: b })));
        } catch (err) {
          console.error(err);
        }
      };
      fetchBrands();
    }
  }, [currentStep]);

  useEffect(() => {
    if (!selectedBrand) {
      setModels([]);
      setSelectedModel(null);
      setYears([]);
      setSelectedYear(null);
      setVehicle(null);
      setShowPrices(false);
      return;
    }

    const fetchModels = async () => {
      try {
        const res = await fetch(`${API_BASE}/models/${encodeURIComponent(selectedBrand.value)}`);
        const data = await res.json();
        setModels(data.map((m: string) => ({ value: m, label: m })));
        setSelectedModel(null);
        setYears([]);
        setSelectedYear(null);
        setVehicle(null);
        setShowPrices(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchModels();
  }, [selectedBrand]);

  useEffect(() => {
    if (!selectedBrand || !selectedModel) {
      setYears([]);
      setSelectedYear(null);
      setVehicle(null);
      setShowPrices(false);
      return;
    }

    const fetchYears = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/years/${encodeURIComponent(selectedBrand.value)}/${encodeURIComponent(selectedModel.value)}`
        );
        const data = await res.json();
        setYears(data.map((y: string) => ({ value: y, label: y })));
        setSelectedYear(null);
        setVehicle(null);
        setShowPrices(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchYears();
  }, [selectedBrand, selectedModel]);

  const handlePriceQuery = async () => {
    if (!selectedBrand || !selectedModel || !selectedYear) return;

    setLoading(true);
    setShowPrices(false);

    try {
      const res = await fetch(
        `${API_BASE}/vehicle/${encodeURIComponent(selectedBrand.value)}/${encodeURIComponent(selectedModel.value)}/${encodeURIComponent(selectedYear.value)}`
      );
      const data = await res.json();

      await new Promise(resolve => setTimeout(resolve, 2000));

      if (data.success) {
        setVehicle(data.data);
        setCurrentStep(4);
        setShowPrices(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewQuery = () => {
    setShowPrices(false);
    setCurrentStep(3);
    setSelectedBrand(null);
    setSelectedModel(null);
    setSelectedYear(null);
    setVehicle(null);
  };

  if (showPrices && vehicle) {
    return (
      <PriceResults
        vehicle={vehicle}
        onNewQuery={handleNewQuery}
        onBackToHome={onBack}
      />
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Ana Sayfaya Dön
          </button>
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Sigorta Fiyatları</h1>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  currentStep >= step ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-300 text-slate-600'
                }`}>
                  {currentStep > step ? <Check className="w-5 h-5" /> : step}
                </div>
                {step < 4 && (
                  <div className={`flex-1 h-1 mx-2 transition-all ${
                    currentStep > step ? 'bg-blue-600' : 'bg-slate-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-600 px-2">
            <span className={currentStep === 1 ? 'font-semibold text-blue-600' : ''}>Kimlik Bilgileri</span>
            <span className={currentStep === 2 ? 'font-semibold text-blue-600' : ''}>Ruhsat Bilgileri</span>
            <span className={currentStep === 3 ? 'font-semibold text-blue-600' : ''}>Araç Bilgileri</span>
            <span className={currentStep === 4 ? 'font-semibold text-blue-600' : ''}>Fiyat Sonuçları</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Kimlik Bilgileri</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">TC Kimlik No *</label>
                  <input
                    type="text"
                    maxLength={11}
                    value={formData.tcKimlik}
                    onChange={(e) => handleInputChange('tcKimlik', e.target.value.replace(/\D/g, ''))}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 ${
                      errors.tcKimlik ? 'border-red-500 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="12345678901"
                  />
                  {errors.tcKimlik && <p className="text-red-600 text-sm mt-1 flex items-center">⚠️ {errors.tcKimlik}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">TC Seri No (Kimlikte) *</label>
                  <input
                    type="text"
                    maxLength={8}
                    value={formData.tcFull}
                    onChange={(e) => handleInputChange('tcFull', e.target.value.toUpperCase())}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 ${
                      errors.tcFull ? 'border-red-500 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="A48L2855"
                  />
                  {errors.tcFull && <p className="text-red-600 text-sm mt-1 flex items-center">⚠️ {errors.tcFull}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Ad *</label>
                    <input
                      type="text"
                      value={formData.ad}
                      onChange={(e) => handleInputChange('ad', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.ad ? 'border-red-500 bg-red-50' : 'border-slate-300'
                      }`}
                      placeholder="Ahmet"
                    />
                    {errors.ad && <p className="text-red-600 text-sm mt-1">⚠️ {errors.ad}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Soyad *</label>
                    <input
                      type="text"
                      value={formData.soyad}
                      onChange={(e) => handleInputChange('soyad', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.soyad ? 'border-red-500 bg-red-50' : 'border-slate-300'
                      }`}
                      placeholder="Yılmaz"
                    />
                    {errors.soyad && <p className="text-red-600 text-sm mt-1">⚠️ {errors.soyad}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Telefon *</label>
                  <div className="flex items-center">
                    <span className="text-slate-600 font-semibold mr-2">+90</span>
                    <input
                      type="text"
                      maxLength={10}
                      value={formData.telefon}
                      onChange={(e) => handleInputChange('telefon', e.target.value.replace(/\D/g, ''))}
                      className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 ${
                        errors.telefon ? 'border-red-500 bg-red-50' : 'border-slate-300'
                      }`}
                      placeholder="5530202873"
                    />
                  </div>
                  {errors.telefon && <p className="text-red-600 text-sm mt-1">⚠️ {errors.telefon}</p>}
                </div>
              </div>

              <button
                onClick={handleStep1Next}
                disabled={loading}
                className="w-full mt-6 bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-[1.02] disabled:bg-slate-400 disabled:transform-none flex items-center justify-center shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    TC Kimlik Sorgulanıyor...
                  </>
                ) : (
                  <>
                    Devam Et <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Ruhsat Bilgileri</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Ruhsat Seri *</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={formData.ruhsatSeri}
                    onChange={(e) => handleInputChange('ruhsatSeri', e.target.value.toUpperCase())}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.ruhsatSeri ? 'border-red-500 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="SU"
                  />
                  {errors.ruhsatSeri && <p className="text-red-600 text-sm mt-1">⚠️ {errors.ruhsatSeri}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Ruhsat No *</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={formData.ruhsatNo}
                    onChange={(e) => handleInputChange('ruhsatNo', e.target.value.replace(/\D/g, ''))}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.ruhsatNo ? 'border-red-500 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="689350"
                  />
                  {errors.ruhsatNo && <p className="text-red-600 text-sm mt-1">⚠️ {errors.ruhsatNo}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Plaka *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={2}
                      value={formData.plakaIl}
                      onChange={(e) => handleInputChange('plakaIl', e.target.value.replace(/\D/g, ''))}
                      className={`w-12 sm:w-16 px-2 sm:px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-center font-semibold text-slate-900 ${
                        errors.plakaIl ? 'border-red-500 bg-red-50' : 'border-slate-300'
                      }`}
                      placeholder="01"
                    />
                    <input
                      type="text"
                      maxLength={4}
                      value={formData.plakaSeri}
                      onChange={(e) => handleInputChange('plakaSeri', e.target.value.toUpperCase())}
                      className={`flex-1 px-2 sm:px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-center font-semibold text-slate-900 ${
                        errors.plakaSeri ? 'border-red-500 bg-red-50' : 'border-slate-300'
                      }`}
                      placeholder="A"
                    />
                    <input
                      type="text"
                      maxLength={4}
                      value={formData.plakaNo}
                      onChange={(e) => handleInputChange('plakaNo', e.target.value.replace(/\D/g, ''))}
                      className={`w-16 sm:w-20 px-2 sm:px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-center font-semibold text-slate-900 ${
                        errors.plakaNo ? 'border-red-500 bg-red-50' : 'border-slate-300'
                      }`}
                      placeholder="1234"
                    />
                  </div>
                  {(errors.plakaIl || errors.plakaSeri || errors.plakaNo) && (
                    <p className="text-red-600 text-sm mt-1">⚠️ Plaka bilgileri hatalı</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 bg-slate-200 text-slate-700 py-4 rounded-lg font-semibold hover:bg-slate-300 transition-all"
                >
                  Geri
                </button>
                <button
                  onClick={handleStep2Next}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-[1.02] disabled:bg-slate-400 disabled:transform-none flex items-center justify-center shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Ruhsat Sorgulanıyor...
                    </>
                  ) : (
                    <>
                      Devam Et <ChevronRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Araç Bilgileri</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Marka * <span className="text-xs text-slate-500 font-normal">(Yazmaya başlayın)</span>
                  </label>
                  <Select
                    options={brands}
                    value={selectedBrand}
                    onChange={setSelectedBrand}
                    placeholder="Marka seçin veya arayın..."
                    isClearable
                    isSearchable
                    styles={customStyles}
                    noOptionsMessage={() => "Marka bulunamadı"}
                    instanceId="brand-select"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Model * <span className="text-xs text-slate-500 font-normal">(Yazmaya başlayın)</span>
                  </label>
                  <Select
                    options={models}
                    value={selectedModel}
                    onChange={setSelectedModel}
                    placeholder="Model seçin veya arayın..."
                    isClearable
                    isSearchable
                    isDisabled={!selectedBrand}
                    styles={customStyles}
                    noOptionsMessage={() => "Model bulunamadı"}
                    instanceId="model-select"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Yıl * <span className="text-xs text-slate-500 font-normal">(Yazmaya başlayın)</span>
                  </label>
                  <Select
                    options={years}
                    value={selectedYear}
                    onChange={setSelectedYear}
                    placeholder="Yıl seçin veya arayın..."
                    isClearable
                    isSearchable
                    isDisabled={!selectedModel}
                    styles={customStyles}
                    noOptionsMessage={() => "Yıl bulunamadı"}
                    instanceId="year-select"
                  />
                </div>
              </div>

              {selectedBrand && selectedModel && selectedYear && (
                <button
                  onClick={handlePriceQuery}
                  disabled={loading}
                  className="w-full mt-6 bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-[1.02] disabled:bg-slate-400 disabled:transform-none flex items-center justify-center shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Fiyatlar Sorgulanıyor...
                    </>
                  ) : (
                    'Fiyat Sorgula'
                  )}
                </button>
              )}

              <button
                onClick={() => setCurrentStep(2)}
                className="w-full mt-4 bg-slate-200 text-slate-700 py-4 rounded-lg font-semibold hover:bg-slate-300 transition-all"
              >
                Geri
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-500">
            Bilgileriniz güvenli bir şekilde saklanır ve üçüncü kişilerle paylaşılmaz
          </p>
        </div>
      </div>
    </div>
  );
}
