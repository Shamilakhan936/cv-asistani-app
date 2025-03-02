'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ResetCVTemplatesPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleResetTemplates = async () => {
    if (!confirm('Tüm CV şablonlarını sıfırlamak istediğinizden emin misiniz?')) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/cv-templates/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-setup-secret': process.env.NEXT_PUBLIC_SETUP_SECRET || 'setup_secret_123'
        }
      });

      const data = await response.json();
      setResult(data);

      if (response.ok) {
        toast.success('Şablonlar başarıyla sıfırlandı ve yeniden eklendi');
      } else {
        toast.error(`Hata: ${data.error || 'Bilinmeyen bir hata oluştu'}`);
      }
    } catch (error) {
      console.error('Error resetting templates:', error);
      toast.error('Şablonları sıfırlarken bir hata oluştu');
      setResult({ error: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshTemplatesPage = () => {
    window.open('/cv/templates', '_blank');
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">CV Şablonlarını Sıfırla</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <p className="text-gray-700 mb-4">
          Bu işlem, mevcut tüm CV şablonlarını silecek ve yeni şablonları ekleyecektir.
          Bu işlem geri alınamaz.
        </p>
        
        <div className="flex space-x-4">
          <Button 
            onClick={handleResetTemplates} 
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {loading ? 'İşlem yapılıyor...' : 'Şablonları Sıfırla'}
          </Button>
          
          <Button 
            onClick={handleRefreshTemplatesPage}
            variant="outline"
          >
            Şablonlar Sayfasını Aç
          </Button>
        </div>
      </div>
      
      {result && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Sonuç:</h2>
          <pre className="bg-gray-800 text-white p-4 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 