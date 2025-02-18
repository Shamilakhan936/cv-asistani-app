'use client';

import { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  PhotoIcon, 
  DocumentIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

interface DailyStats {
  date: string;
  users: number;
  photos: number;
  cvs: number;
}

interface Stats {
  daily: DailyStats[];
  totals: {
    users: {
      total: number;
      activeUsers: number;
      inactiveUsers: number;
      adminUsers: number;
      weeklyGrowth: number;
    };
    photos: {
      total: number;
      pending: number;
      completed: number;
      failed: number;
      weeklyGrowth: number;
    };
    cvs: {
      total: number;
      weeklyGrowth: number;
    };
  };
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error('İstatistikler getirilemedi:', error);
      setError('İstatistikler yüklenirken bir hata oluştu');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Yükleniyor...</div>
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

  if (!stats) return null;

  const cards = [
    {
      title: 'Kullanıcılar',
      icon: UsersIcon,
      stats: [
        { label: 'Toplam', value: stats.totals.users.total, color: 'text-blue-600' },
        { label: 'Aktif', value: stats.totals.users.activeUsers, color: 'text-green-600' },
        { label: 'Devre Dışı', value: stats.totals.users.inactiveUsers, color: 'text-red-600' },
        { label: 'Admin', value: stats.totals.users.adminUsers, color: 'text-purple-600' }
      ],
      growth: stats.totals.users.weeklyGrowth
    },
    {
      title: 'Fotoğraflar',
      icon: PhotoIcon,
      stats: [
        { label: 'Toplam', value: stats.totals.photos.total, color: 'text-blue-600' },
        { label: 'Bekleyen', value: stats.totals.photos.pending, color: 'text-yellow-600' },
        { label: 'Tamamlanan', value: stats.totals.photos.completed, color: 'text-green-600' },
        { label: 'Başarısız', value: stats.totals.photos.failed, color: 'text-red-600' }
      ],
      growth: stats.totals.photos.weeklyGrowth
    },
    {
      title: 'CV\'ler',
      icon: DocumentIcon,
      stats: [
        { label: 'Toplam CV', value: stats.totals.cvs.total, color: 'text-blue-600' }
      ],
      growth: stats.totals.cvs.weeklyGrowth
    }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">İstatistikler</h1>
        <p className="mt-1 text-sm text-gray-500">
          Son 7 günün detaylı istatistikleri
        </p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <card.icon className="h-6 w-6 text-gray-400 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">{card.title}</h3>
                </div>
                <div className="flex items-center">
                  {card.growth > 0 ? (
                    <ArrowTrendingUpIcon className="h-5 w-5 text-green-500 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-5 w-5 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    card.growth > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.abs(card.growth)}%
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                {card.stats.map((stat, statIndex) => (
                  <div key={statIndex} className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{stat.label}</span>
                    <span className={`text-lg font-semibold ${stat.color}`}>
                      {stat.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Günlük İstatistikler */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Günlük İstatistikler</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yeni Kullanıcı
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yeni Fotoğraf
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yeni CV
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.daily.map((day, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(day.date).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {day.users}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {day.photos}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {day.cvs}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 