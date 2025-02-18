'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';
import Image from 'next/image';

interface PhotoUploaderProps {
  onUpload: (url: string) => void;
  currentPhotoUrl?: string;
}

export default function PhotoUploader({ onUpload, currentPhotoUrl }: PhotoUploaderProps) {
  const [error, setError] = useState<string>('');

  return (
    <div className="w-full space-y-4">
      {currentPhotoUrl && (
        <div className="relative w-32 h-32 mx-auto">
          <Image
            src={currentPhotoUrl}
            alt="CV Fotoğrafı"
            fill
            className="rounded-full object-cover"
          />
        </div>
      )}
      
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_CV}
        options={{
          maxFiles: 1,
          resourceType: "image",
          clientAllowedFormats: ["png", "jpeg", "jpg"],
          maxFileSize: 2000000, // 2MB
          sources: ["local", "camera"],
          folder: "cv-photos",
          styles: {
            palette: {
              window: "#FFFFFF",
              windowBorder: "#90A0B3",
              tabIcon: "#0078FF",
              menuIcons: "#5A616A",
              textDark: "#000000",
              textLight: "#FFFFFF",
              link: "#0078FF",
              action: "#FF620C",
              inactiveTabIcon: "#0E2F5A",
              error: "#F44235",
              inProgress: "#0078FF",
              complete: "#20B832",
              sourceBg: "#E4EBF1"
            }
          }
        }}
        onSuccess={(result: any) => {
          setError('');
          const baseUrl = result.info.secure_url;
          const optimizedUrl = baseUrl.replace('/upload/', '/upload/c_fill,g_face,h_1000,w_1000,q_auto:best/');
          onUpload(optimizedUrl);
        }}
        onError={(error: any) => {
          setError('Fotoğraf yüklenirken bir hata oluştu.');
          console.error('Upload error:', error);
        }}
      >
        {({ open }) => (
          <div className="text-center">
            <button
              type="button"
              onClick={() => open()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {currentPhotoUrl ? 'Fotoğrafı Değiştir' : 'Fotoğraf Yükle'}
            </button>
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>
        )}
      </CldUploadWidget>
    </div>
  );
} 