import { ClothingOption, SuitColor, ShirtColor, TieColor, SweaterColor, Background, Pose } from '../types/photo';

export const MALE_CLOTHING_OPTIONS: ClothingOption[] = [
  {
    id: 'classic-suit',
    name: 'Klasik Takım Elbise (Ceket, Gömlek ve Kravat)',
    requiresMainColor: true,
    requiresShirtColor: true,
    requiresTieColor: true,
    requiresSweaterColor: false
  },
  {
    id: 'smart-casual-suit',
    name: 'Smart Casual Takım (Kravatsız)',
    requiresMainColor: true,
    requiresShirtColor: true,
    requiresTieColor: false,
    requiresSweaterColor: false
  },
  {
    id: 'formal-shirt',
    name: 'Resmi Gömlek (Kravatlı)',
    requiresMainColor: false,
    requiresShirtColor: true,
    requiresTieColor: true,
    requiresSweaterColor: false
  },
  {
    id: 'smart-casual-shirt',
    name: 'Smart Casual Gömlek',
    requiresMainColor: false,
    requiresShirtColor: true,
    requiresTieColor: false,
    requiresSweaterColor: false
  },
  {
    id: 'sweater-shirt',
    name: 'Smart Casual Kazak ve Gömlek',
    requiresMainColor: false,
    requiresShirtColor: true,
    requiresTieColor: false,
    requiresSweaterColor: true
  },
  {
    id: 'casual-sweater',
    name: 'Smart Casual Kazak',
    requiresMainColor: false,
    requiresShirtColor: false,
    requiresTieColor: false,
    requiresSweaterColor: true
  }
];

export const FEMALE_CLOTHING_OPTIONS: ClothingOption[] = [
  {
    id: 'classic-suit',
    name: 'Klasik Takım (Ceket ve Gömlek)',
    requiresMainColor: true,
    requiresShirtColor: true,
    requiresTieColor: false,
    requiresSweaterColor: false
  },
  {
    id: 'smart-casual-blazer',
    name: 'Smart Casual Blazer (Blazer ve Bluz)',
    requiresMainColor: true,
    requiresShirtColor: true,
    requiresTieColor: false,
    requiresSweaterColor: false
  },
  {
    id: 'classic-dress',
    name: 'Klasik Elbise',
    requiresMainColor: true,
    requiresShirtColor: false,
    requiresTieColor: false,
    requiresSweaterColor: false
  },
  {
    id: 'smart-casual-dress',
    name: 'Smart Casual Elbise',
    requiresMainColor: true,
    requiresShirtColor: false,
    requiresTieColor: false,
    requiresSweaterColor: false
  },
  {
    id: 'classic-blouse',
    name: 'Klasik Bluz',
    requiresMainColor: false,
    requiresShirtColor: true,
    requiresTieColor: false,
    requiresSweaterColor: false
  },
  {
    id: 'smart-casual-blouse',
    name: 'Smart Casual Bluz',
    requiresMainColor: false,
    requiresShirtColor: true,
    requiresTieColor: false,
    requiresSweaterColor: false
  },
  {
    id: 'smart-casual-sweater',
    name: 'Smart Casual Kazak',
    requiresMainColor: false,
    requiresShirtColor: false,
    requiresTieColor: false,
    requiresSweaterColor: true
  }
];

export const SUIT_COLORS: { value: SuitColor; label: string }[] = [
  { value: 'black', label: 'Siyah' },
  { value: 'charcoal', label: 'Kömür Grisi' },
  { value: 'navy', label: 'Koyu Lacivert' },
  { value: 'medium-blue', label: 'Orta Mavi' },
  { value: 'smoke', label: 'Füme' },
  { value: 'light-beige', label: 'Açık Bej' },
  { value: 'brown', label: 'Kahverengi' },
  { value: 'olive', label: 'Zeytin Yeşili' }
];

export const SHIRT_COLORS: { value: ShirtColor; label: string }[] = [
  { value: 'white', label: 'Beyaz' },
  { value: 'light-blue', label: 'Açık Mavi' },
  { value: 'sand', label: 'Kum Beji' },
  { value: 'light-gray', label: 'Açık Gri' },
  { value: 'ivory', label: 'Fildişi' },
  { value: 'lavender', label: 'Lavanta' },
  { value: 'dusty-pink', label: 'Toz Pembe' },
  { value: 'mint', label: 'Nane Yeşili' }
];

export const TIE_COLORS: { value: TieColor; label: string }[] = [
  { value: 'black', label: 'Siyah' },
  { value: 'navy', label: 'Lacivert' },
  { value: 'burgundy', label: 'Bordo' },
  { value: 'dark-green', label: 'Koyu Yeşil' },
  { value: 'steel-blue', label: 'Çelik Mavisi' },
  { value: 'charcoal', label: 'Kömür Gri' }
];

export const SWEATER_COLORS: { value: SweaterColor; label: string }[] = [
  { value: 'smoke', label: 'Füme' },
  { value: 'dark-green', label: 'Koyu Yeşil' },
  { value: 'camel', label: 'Kum Kahvesi' },
  { value: 'burgundy', label: 'Bordo' },
  { value: 'ash-gray', label: 'Kül Grisi' },
  { value: 'dark-blue', label: 'Koyu Mavi' },
  { value: 'cinnamon', label: 'Tarçın' }
];

export const POSE_DESCRIPTIONS = {
  professional: {
    name: 'Profesyonel',
    description: 'Profesyonel iş insanı pozu - Düz duruş, kameraya doğrudan bakış'
  },
  casual: {
    name: 'Günlük',
    description: 'Günlük poz - Rahat duruş, doğal gülümseme'
  },
  editorial: {
    name: 'Dergi',
    description: 'Dergi çekimi pozu - 45 derece açıyla dinamik duruş'
  }
};

export const MALE_POSES = [
  { id: 'professional', name: POSE_DESCRIPTIONS.professional.name, description: POSE_DESCRIPTIONS.professional.description },
  { id: 'casual', name: POSE_DESCRIPTIONS.casual.name, description: POSE_DESCRIPTIONS.casual.description },
  { id: 'editorial', name: POSE_DESCRIPTIONS.editorial.name, description: POSE_DESCRIPTIONS.editorial.description }
];

export const FEMALE_POSES = [
  { id: 'professional', name: POSE_DESCRIPTIONS.professional.name, description: POSE_DESCRIPTIONS.professional.description },
  { id: 'casual', name: POSE_DESCRIPTIONS.casual.name, description: POSE_DESCRIPTIONS.casual.description },
  { id: 'editorial', name: POSE_DESCRIPTIONS.editorial.name, description: POSE_DESCRIPTIONS.editorial.description }
];

export const BACKGROUNDS: { value: Background; label: string }[] = [
  // Stüdyo Arka Planları
  { value: 'studio-white', label: 'Stüdyo - Saf Beyaz' },
  { value: 'studio-light-gray', label: 'Stüdyo - Saf Açık Gri' },
  { value: 'studio-dark-gray', label: 'Stüdyo - Saf Koyu Gri' },
  { value: 'studio-navy', label: 'Stüdyo - Saf Lacivert' },
  { value: 'studio-brown', label: 'Stüdyo - Saf Kahverengi' },
  { value: 'studio-beige', label: 'Stüdyo - Saf Bej' },
  
  // Profesyonel Ortamlar
  { value: 'office-modern', label: 'Modern Ofis - Minimalist' },
  { value: 'office-executive', label: 'Yönetici Ofisi - Lüks' },
  { value: 'meeting-room', label: 'Toplantı Odası - Profesyonel' },
  { value: 'library', label: 'Kütüphane - Zarif' },
  { value: 'garden-pro', label: 'Bahçe - Profesyonel' }
]; 