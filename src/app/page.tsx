import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">CV Asistanı</span>
          </div>
          <div>
            <Link 
              href="/auth/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Giriş Yap
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Profesyonel CV'nizi</span>
            <span className="block text-blue-600">Yapay Zeka ile Oluşturun</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            CV hazırlama, fotoğraf düzenleme ve kariyer gelişiminiz için yapay zeka destekli asistanınız.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                href="/auth/register"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                Ücretsiz Başla
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-32 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">CV Fotoğrafı Hazırlama</div>
              <p className="mt-2 text-gray-500">Profesyonel CV fotoğrafınızı yapay zeka ile oluşturun veya mevcut fotoğrafınızı düzenleyin.</p>
            </div>
          </div>

          <div className="relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">CV Hazırlama</div>
              <p className="mt-2 text-gray-500">Modern şablonlar ve yapay zeka ile profesyonel CV'nizi dakikalar içinde oluşturun.</p>
            </div>
          </div>

          <div className="relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">İş İlanına Göre Optimizasyon</div>
              <p className="mt-2 text-gray-500">CV'nizi başvuracağınız pozisyona göre otomatik olarak optimize edin.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-24">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400 text-sm">
            © 2024 CV Asistanı. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>
  );
}
