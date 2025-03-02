'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserIcon, PencilIcon } from '@heroicons/react/24/outline';

interface Photo {
  id: string;
  url: string;
  createdAt: string;
  metadata: any;
}

interface Operation {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  canCancel: boolean;
  notes: string | null;
  user: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
}

export default function AdminPhotosPage() {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingStatus, setEditingStatus] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchOperations();

    const interval = setInterval(() => {
      fetchOperations();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchOperations = async () => {
    try {
      setLoading(prevLoading => {
        if (operations.length === 0) return true;
        return false;
      });
      setError('');
      
      const res = await fetch('/api/admin/photos');
      if (!res.ok) {
        throw new Error('API yanıtı başarısız oldu');
      }

      const data = await res.json();
      setOperations(data.operations || []);
    } catch (error) {
      console.error('İşlem getirme hatası:', error);
      setError('İşlemler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (operationId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/photos/operations/${operationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error('Durum güncellenemedi');
      }

      setOperations(operations.map(op => 
        op.id === operationId ? { ...op, status: newStatus } : op
      ));
      setEditingStatus({ ...editingStatus, [operationId]: false });
    } catch (error) {
      console.error('Durum güncelleme hatası:', error);
      alert('Durum güncellenirken bir hata oluştu');
    }
  };

  const handleDelete = async (operationId: string) => {
    if (!confirm('Bu işlemi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/photos/operations/${operationId}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        throw new Error('İşlem silinemedi');
      }

      // İşlemi listeden kaldır
      setOperations(operations.filter(op => op.id !== operationId));
    } catch (error) {
      console.error('İşlem silme hatası:', error);
      alert('İşlem silinirken bir hata oluştu');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Tamamlandı';
      case 'PENDING':
        return 'Beklemede';
      case 'PROCESSING':
        return 'İşleniyor';
      case 'FAILED':
        return 'Başarısız';
      case 'CANCELLED':
        return 'İptal Edildi';
      default:
        return status;
    }
  };

  const canCancelOperation = (operation: Operation) => {
    if (!operation.canCancel) return false;
    const createdAt = new Date(operation.createdAt);
    const now = new Date();
    const diffInMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);
    return diffInMinutes <= 30;
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-600 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Fotoğraf İşlemleri</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kullanıcı
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarih
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Not
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">İşlemler</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {operations.map((operation) => (
              <tr key={operation.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {operation.user?.name || 'İsimsiz Kullanıcı'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {operation.user?.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(operation.createdAt).toLocaleString('tr-TR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingStatus[operation.id] ? (
                    <select
                      value={operation.status}
                      onChange={(e) => handleStatusChange(operation.id, e.target.value)}
                      className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="PENDING">Beklemede</option>
                      <option value="PROCESSING">İşleniyor</option>
                      <option value="COMPLETED">Tamamlandı</option>
                      <option value="FAILED">Başarısız</option>
                      <option value="CANCELLED">İptal Edildi</option>
                    </select>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(operation.status)}`}>
                        {getStatusText(operation.status)}
                      </span>
                      <button
                        onClick={() => setEditingStatus({ ...editingStatus, [operation.id]: true })}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {operation.notes || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-4">
                    <Link
                      href={`/admin/photos/users/${operation.user?.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Detayları Görüntüle
                    </Link>
                    <button
                      onClick={() => handleDelete(operation.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 