'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

interface CV {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
}

export default function CVsPage() {
  const router = useRouter();
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/cvs');
        if (!response.ok) {
          throw new Error('CV\'ler yüklenirken bir hata oluştu');
        }
        const data = await response.json();
        setCvs(data.cvs || []);
      } catch (error) {
        console.error('Error fetching CVs:', error);
        toast.error('CV\'ler yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchCVs();
  }, []);

  const handleCreateCV = () => {
    router.push('/cv/templates');
  };

  const handleEditCV = (id: string) => {
    router.push(`/cv/edit/${id}`);
  };

  const handleViewCV = (id: string) => {
    router.push(`/cv/view/${id}`);
  };

  const handleDeleteCV = async (id: string) => {
    if (!confirm('Bu CV\'yi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/cvs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('CV silinirken bir hata oluştu');
      }

      setCvs(cvs.filter(cv => cv.id !== id));
      toast.success('CV başarıyla silindi');
    } catch (error) {
      console.error('Error deleting CV:', error);
      toast.error('CV silinirken bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">CV'lerim</h1>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">CV'lerim</h1>
        <Button onClick={handleCreateCV}>Yeni CV Oluştur</Button>
      </div>

      {cvs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Henüz CV oluşturmadınız</h2>
          <p className="text-gray-600 mb-6">
            Profesyonel bir CV oluşturmak için şablonlarımızı inceleyin ve size uygun olanı seçin.
          </p>
          <Button onClick={handleCreateCV}>CV Oluşturmaya Başla</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cvs.map((cv) => (
            <Card key={cv.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{cv.title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-gray-500">
                  Son güncelleme: {formatDistanceToNow(new Date(cv.updatedAt), { addSuffix: true, locale: tr })}
                </p>
                <div className="mt-2">
                  {cv.isPublished ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Yayında
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Taslak
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleViewCV(cv.id)}>
                    Görüntüle
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEditCV(cv.id)}>
                    Düzenle
                  </Button>
                </div>
                <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => handleDeleteCV(cv.id)}>
                  Sil
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 