# CV Asistanı - AI Powered Professional Photo Generator

Bu proje, kullanıcıların profesyonel CV fotoğrafları oluşturmasına yardımcı olan bir web uygulamasıdır. Yapay zeka teknolojilerini kullanarak, kullanıcıların yüklediği fotoğrafları profesyonel iş fotoğraflarına dönüştürür.

## Özellikler

- Kullanıcı kimlik doğrulama (NextAuth.js)
- Fotoğraf yükleme ve işleme
- AI destekli fotoğraf dönüşümü
- Özelleştirilebilir kıyafet, poz ve arka plan seçenekleri
- Yüksek kaliteli çıktı
- Cloudinary entegrasyonu ile optimize edilmiş görüntü depolama

## Teknolojiler

- Next.js 14
- TypeScript
- NextAuth.js
- Replicate AI API
- Cloudinary
- TailwindCSS

## Kurulum

1. Repoyu klonlayın:
```bash
git clone https://github.com/yourusername/cv-asistani.git
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Gerekli ortam değişkenlerini ayarlayın:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret

DATABASE_URL=your-database-url

REPLICATE_API_TOKEN=your-replicate-token

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

4. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

## Kullanım

1. Hesap oluşturun veya giriş yapın
2. Fotoğraf yükleyin
3. Kıyafet, poz ve arka plan seçeneklerini belirleyin
4. İşlemi başlatın ve profesyonel fotoğrafınızı oluşturun
5. Sonucu indirin

## Lisans

MIT

## İletişim

Proje sorularınız için issues bölümünü kullanabilirsiniz.
