# CV Asistanı - AI Powered Professional Photo Generator

Bu proje, kullanıcıların profesyonel CV fotoğrafları oluşturmasına yardımcı olan bir web uygulamasıdır. Yapay zeka teknolojilerini kullanarak, kullanıcıların yüklediği fotoğrafları profesyonel iş fotoğraflarına dönüştürür.

## 🚀 Özellikler

- **Kullanıcı Yönetimi**
  - Clerk ile güvenli kimlik doğrulama
  - Rol tabanlı yetkilendirme (Admin/User)
  - Sosyal medya ile giriş
  
- **Fotoğraf İşleme**
  - AI destekli fotoğraf dönüşümü
  - Özelleştirilebilir kıyafet, poz ve arka plan seçenekleri
  - Yüksek kaliteli çıktı
  - İşlem durumu takibi
  
- **Admin Paneli**
  - Kullanıcı yönetimi
  - Fotoğraf işlemlerini izleme
  - İstatistikler ve raporlama
  
- **Depolama ve Optimizasyon**
  - Cloudinary entegrasyonu
  - Optimize edilmiş görüntü depolama
  - Güvenli dosya yönetimi

## 🛠️ Teknolojiler

- **Frontend**
  - Next.js 14
  - TypeScript
  - TailwindCSS
  - Headless UI
  
- **Backend**
  - Supabase (PostgreSQL)
  - Prisma ORM
  - Clerk Authentication
  
- **AI ve Medya**
  - Replicate AI API
  - Cloudinary
  
- **Deployment**
  - Vercel
  - Supabase Cloud

## 📦 Kurulum

1. Repoyu klonlayın:
```bash
git clone https://github.com/fuzulibinek/cv-asistani.git
cd cv-asistani
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env.example` dosyasını `.env` olarak kopyalayın ve gerekli değişkenleri ayarlayın:
```bash
cp .env.example .env
```

4. Veritabanını hazırlayın:
```bash
npx prisma generate
npx prisma db push
```

5. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

## 🔑 Ortam Değişkenleri

Aşağıdaki ortam değişkenlerini `.env` dosyanızda ayarlamanız gerekmektedir:

```env
# Database (Supabase)
DATABASE_URL=
DIRECT_URL=

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Replicate AI
REPLICATE_API_TOKEN=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## 📚 API Endpoints

### 📸 Fotoğraf İşlemleri
- `POST /api/photos/create` - Yeni fotoğraf işlemi oluştur
- `GET /api/user/photos` - Kullanıcının fotoğraflarını getir
- `GET /api/user/photos/pending` - Bekleyen işlemleri getir
- `POST /api/photos/cancel/{photoId}` - İşlemi iptal et

### 👤 Kullanıcı İşlemleri
- `GET /api/user/cvs` - Kullanıcının CV'lerini getir
- `POST /api/webhook/clerk` - Clerk webhook handler

### 🔐 Admin İşlemleri
- `GET /api/admin/stats` - Genel istatistikler
- `GET /api/admin/users` - Tüm kullanıcıları listele
- `GET /api/admin/photos` - Tüm fotoğraf işlemlerini getir

## 🔒 Güvenlik

- Tüm API endpoint'leri Clerk authentication ile korunmaktadır
- Admin endpoint'leri rol bazlı yetkilendirme ile korunmaktadır
- Hassas bilgiler `.env` dosyasında saklanmaktadır
- Rate limiting uygulanmıştır

## 🤝 Katkıda Bulunma

1. Bu repoyu fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📫 İletişim

Proje sorularınız için [issues](https://github.com/fuzulibinek/cv-asistani/issues) bölümünü kullanabilirsiniz.
