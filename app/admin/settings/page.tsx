'use client';

import { useState } from 'react';
import { 
  CloudIcon, 
  KeyIcon, 
  CogIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface Settings {
  cloudinary: {
    cloudName: string;
    apiKey: string;
    uploadPresetCV: string;
    uploadPresetBlog: string;
  };
  replicate: {
    apiToken: string;
  };
  google: {
    clientId: string;
    clientSecret: string;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    cloudinary: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
      apiKey: '',
      uploadPresetCV: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_CV || '',
      uploadPresetBlog: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_BLOG || ''
    },
    replicate: {
      apiToken: ''
    },
    google: {
      clientId: '',
      clientSecret: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        throw new Error('Ayarlar güncellenirken bir hata oluştu');
      }

      setSuccess('Ayarlar başarıyla güncellendi');
    } catch (error) {
      console.error('Ayarlar güncellenirken hata:', error);
      setError('Ayarlar güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (section: keyof Settings, key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Sistem Ayarları</h1>
        <p className="mt-1 text-sm text-gray-500">
          API anahtarları ve sistem yapılandırması
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Cloudinary Ayarları */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <CloudIcon className="h-6 w-6 text-gray-400 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Cloudinary Ayarları</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="cloudName" className="block text-sm font-medium text-gray-700">
                  Cloud Name
                </label>
                <input
                  type="text"
                  id="cloudName"
                  value={settings.cloudinary.cloudName}
                  onChange={(e) => handleChange('cloudinary', 'cloudName', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                  API Key
                </label>
                <input
                  type="password"
                  id="apiKey"
                  value={settings.cloudinary.apiKey}
                  onChange={(e) => handleChange('cloudinary', 'apiKey', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="uploadPresetCV" className="block text-sm font-medium text-gray-700">
                  CV Upload Preset
                </label>
                <input
                  type="text"
                  id="uploadPresetCV"
                  value={settings.cloudinary.uploadPresetCV}
                  onChange={(e) => handleChange('cloudinary', 'uploadPresetCV', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="uploadPresetBlog" className="block text-sm font-medium text-gray-700">
                  Blog Upload Preset
                </label>
                <input
                  type="text"
                  id="uploadPresetBlog"
                  value={settings.cloudinary.uploadPresetBlog}
                  onChange={(e) => handleChange('cloudinary', 'uploadPresetBlog', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Replicate Ayarları */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <CogIcon className="h-6 w-6 text-gray-400 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Replicate Ayarları</h2>
            </div>
            <div>
              <label htmlFor="replicateToken" className="block text-sm font-medium text-gray-700">
                API Token
              </label>
              <input
                type="password"
                id="replicateToken"
                value={settings.replicate.apiToken}
                onChange={(e) => handleChange('replicate', 'apiToken', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Google OAuth Ayarları */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <KeyIcon className="h-6 w-6 text-gray-400 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Google OAuth Ayarları</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="googleClientId" className="block text-sm font-medium text-gray-700">
                  Client ID
                </label>
                <input
                  type="text"
                  id="googleClientId"
                  value={settings.google.clientId}
                  onChange={(e) => handleChange('google', 'clientId', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="googleClientSecret" className="block text-sm font-medium text-gray-700">
                  Client Secret
                </label>
                <input
                  type="password"
                  id="googleClientSecret"
                  value={settings.google.clientSecret}
                  onChange={(e) => handleChange('google', 'clientSecret', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bildirimler */}
        {(success || error) && (
          <div className={`p-4 rounded-md ${
            success ? 'bg-green-50' : 'bg-red-50'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {success ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-400" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-red-400" />
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {success || error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Kaydet Butonu */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
} 