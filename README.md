# SigortaApp 🚗

Modern araç sigorta fiyat karşılaştırma platformu. React (Next.js) frontend ve Flask backend ile geliştirilmiştir.

## 🌟 Özellikler

- ⚡ **Hızlı Karşılaştırma**: 3 adımda tüm sigorta fiyatlarını görün
- 🏢 **Kapsamlı**: Türkiye'deki tüm sigorta şirketleri
- 💰 **Tasarruf**: En uygun fiyatı anında bulun
- 📱 **Responsive**: Mobil ve masaüstü uyumlu
- 🔒 **Güvenli**: SSL koruması ve veri güvenliği

## 🛠️ Teknolojiler

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Select** - Dropdown components

### Backend
- **Flask** - Python web framework
- **PostgreSQL** - Database
- **SQLAlchemy** - ORM
- **Flask-CORS** - Cross-origin support
- **Pandas** - Data processing

## 🚀 Kurulum

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
pip install -r requirements.txt
python app.py
```

## 📖 API Endpoints

- `GET /api/brands` - Marka listesi
- `GET /api/models/{brand}` - Model listesi
- `GET /api/years/{brand}/{model}` - Yıl listesi
- `GET /api/vehicle/{brand}/{model}/{year}` - Araç fiyatları

## 🌐 Demo

Frontend: [Vercel Deployment](https://sigorta-app.vercel.app)
Backend: [Railway API](https://flask-excel-production.up.railway.app)

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
