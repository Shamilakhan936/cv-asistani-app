import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import Replicate from 'replicate';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import { Gender, MaleClothing, FemaleClothing, Pose, Background } from '../../../types/photo';
export const dynamic = 'force-dynamic';
// Cloudinary yapılandırması
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Replicate API yapılandırması
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || 'r8_AwndJQAZxxs3E18VdOxerRA9TXgOsg94KTLGW',
});

// Model sabitleri - temel versiyon
const MODEL_VERSION = "2a2afbff09996b53247b0714577d4ff82d2c9da8e8b00c5499b5b34510bb8b5e";
const MODEL_NAME = "tgohblio/instant-id-albedobase-xl";

// Profesyonel şablon fotoğrafları
const TEMPLATE_PHOTOS = {
  male: [
    '/templates/male-1.jpg',
    '/templates/male-2.jpg',
  ],
  female: [
    '/templates/female-1.jpg',
    '/templates/female-2.jpg',
  ]
};

interface PromptTemplate {
  template: string;
}

interface GenderTemplates {
  [key: string]: PromptTemplate;
}

interface PromptTemplates {
  male: GenderTemplates;
  female: GenderTemplates;
}

const PROMPT_TEMPLATES: PromptTemplates = {
  male: {
    suit: {
      template: "img professional business portrait photo of a businessman wearing a perfectly tailored {mainColor} suit with crisp {shirtColor} dress shirt, {pose}, {background}, professional business portrait, high-end corporate photography, 8k uhd, high quality",
    },
    'blazer-full': {
      template: "img professional business portrait photo of a businessman wearing a sophisticated {mainColor} blazer with crisp {shirtColor} dress shirt and elegant {tieColor} silk tie, {pose}, {background}, professional business portrait, high-end corporate photography, 8k uhd, high quality",
    },
    'blazer-casual': {
      template: "img professional business portrait photo of a businessman wearing a refined {mainColor} blazer with crisp {shirtColor} dress shirt, no tie, {pose}, {background}, professional business portrait, high-end corporate photography, 8k uhd, high quality",
    },
    'shirt-tie': {
      template: "img professional business portrait photo of a businessman wearing a crisp {shirtColor} dress shirt with elegant {tieColor} silk tie, {pose}, {background}, professional business portrait, high-end corporate photography, 8k uhd, high quality",
    },
    'shirt-casual': {
      template: "img professional business portrait photo of a businessman wearing a crisp {shirtColor} dress shirt, perfectly pressed, {pose}, {background}, professional business portrait, high-end corporate photography, 8k uhd, high quality",
    }
  },
  female: {
    'blazer-suit': {
      template: "img professional business portrait photo of a businesswoman wearing a tailored {mainColor} pantsuit with perfect fit, {pose}, {background}, professional business portrait, high-end corporate photography, 8k uhd, high quality",
    },
    'blazer-blouse': {
      template: "img professional business portrait photo of a businesswoman wearing a sophisticated {mainColor} blazer with elegant {shirtColor} silk blouse, {pose}, {background}, professional business portrait, high-end corporate photography, 8k uhd, high quality",
    },
    'dress': {
      template: "img professional business portrait photo of a businesswoman wearing an elegant {mainColor} sheath dress with perfect tailoring, {pose}, {background}, professional business portrait, high-end corporate photography, 8k uhd, high quality",
    },
    'blouse-pro': {
      template: "img professional business portrait photo of a businesswoman wearing a refined {shirtColor} silk blouse with elegant drape, {pose}, {background}, professional business portrait, high-end corporate photography, 8k uhd, high quality",
    },
    'blouse-casual': {
      template: "img professional business portrait photo of a businesswoman wearing a sophisticated {shirtColor} blouse with professional cut, {pose}, {background}, professional business portrait, high-end corporate photography, 8k uhd, high quality",
    }
  }
};

// Arka plan tanımlamaları güncellendi
const BACKGROUND_DESCRIPTIONS: Record<string, string> = {
  // Studio Backgrounds - Sharp and Clear
  'studio-white': 'on pure white studio background with professional studio lighting setup',
  'studio-light-gray': 'on pure light gray studio background with professional studio lighting setup',
  'studio-dark-gray': 'on pure dark gray studio background with professional studio lighting setup',
  'studio-navy': 'on pure navy blue studio background with professional studio lighting setup',
  'studio-brown': 'on pure brown studio background with professional studio lighting setup',
  'studio-beige': 'on pure beige studio background with professional studio lighting setup',
  
  // Professional Environments - With Bokeh Effect
  'office-modern': 'in a sleek minimalist office space with blurred modern furniture and large windows in the background creating a soft bokeh effect',
  'office-executive': 'in a luxurious executive office with blurred wooden desk elegant leather chairs and city skyline view through floor-to-ceiling windows in the background creating a premium bokeh effect',
  'meeting-room': 'in an upscale conference room with blurred long table ergonomic chairs and digital displays in the background creating a professional bokeh effect',
  'library': 'in a sophisticated library space with blurred floor-to-ceiling wooden bookshelves leather armchairs and warm ambient lighting in the background creating an elegant bokeh effect',
  'garden-pro': 'in a meticulously landscaped garden with blurred manicured hedges stone pathways and architectural elements in the background creating a natural bokeh effect'
};

interface ReplicateError {
  message: string;
  status?: number;
}

function isReplicateError(error: unknown): error is ReplicateError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as ReplicateError).message === 'string'
  );
}

async function uploadToCloudinary(buffer: Buffer): Promise<string> {
  try {
    const uploadResult = await cloudinary.uploader.upload(
      `data:image/png;base64,${buffer.toString('base64')}`,
        {
          folder: 'cv-photos',
          resource_type: 'image',
          format: 'png',
        quality: 'auto:best',
          fetch_format: 'auto',
        flags: 'preserve_transparency'
      }
    );
    return uploadResult.secure_url;
  } catch (error) {
    console.error('Cloudinary yükleme hatası:', error);
    throw error;
  }
}

async function waitForPrediction(prediction: any): Promise<any> {
  let result = prediction;
  
  // En fazla 60 saniye bekle
  const maxAttempts = 30;
  const delayMs = 2000;
  let attempts = 0;

  while (attempts < maxAttempts) {
    if (result.status === 'succeeded') {
      return result.output;
    }

    if (result.status === 'failed') {
      throw new Error('İşlem başarısız oldu: ' + (result.error || 'Bilinmeyen hata'));
    }

    if (result.status === 'canceled') {
      throw new Error('İşlem iptal edildi');
    }

    console.log(`İşlem durumu kontrol ediliyor... (${attempts + 1}/${maxAttempts})`);
    await new Promise(resolve => setTimeout(resolve, delayMs));
    result = await replicate.predictions.get(result.id);
    attempts++;
  }

  throw new Error('İşlem zaman aşımına uğradı');
}

// Poz tanımlamaları için tip tanımlaması
type PoseDescriptions = {
  [K in Gender]: {
    [P in Pose]: string;
  };
};

// Kıyafet şablonları için tip tanımlaması
interface ClothingTemplate {
  template: string;
}

interface MaleClothingTemplates {
  'classic-suit': ClothingTemplate;
  'smart-casual-suit': ClothingTemplate;
  'formal-shirt': ClothingTemplate;
  'smart-casual-shirt': ClothingTemplate;
  'sweater-shirt': ClothingTemplate;
  'casual-sweater': ClothingTemplate;
}

interface FemaleClothingTemplates {
  'classic-suit': ClothingTemplate;
  'smart-casual-blazer': ClothingTemplate;
  'classic-dress': ClothingTemplate;
  'smart-casual-dress': ClothingTemplate;
  'classic-blouse': ClothingTemplate;
  'smart-casual-blouse': ClothingTemplate;
  'smart-casual-sweater': ClothingTemplate;
}

interface ClothingTemplates {
  male: MaleClothingTemplates;
  female: FemaleClothingTemplates;
}

// Önceden hazırlanmış kombinasyonlar için tip tanımlaması
interface PreDefinedPromptData {
  clothing: MaleClothing | FemaleClothing;
  colors: {
    main?: keyof typeof COLOR_PALETTES.suit;
    shirt?: keyof typeof COLOR_PALETTES.shirt;
    tie?: keyof typeof COLOR_PALETTES.tie;
  };
  pose: Pose;
  background: Background;
  prompt: string;
}

type PreDefinedPrompts = {
  [K in Gender]: {
    [key: string]: PreDefinedPromptData;
  };
};

// Poz tanımlamaları güncellendi
const POSE_DESCRIPTIONS: PoseDescriptions = {
  male: {
    'professional': 'standing straight facing camera with hands clasped in front professional business pose projecting authority and confidence',
    'casual': 'relaxed standing pose with hands in pockets natural smile showing approachability and authenticity',
    'editorial': 'dynamic fashion magazine pose at 45-degree angle with confident expression showing style and presence'
  },
  female: {
    'professional': 'standing straight facing camera with hands clasped in front professional business pose projecting authority and confidence',
    'casual': 'relaxed standing pose with hands in pockets natural smile showing approachability and authenticity',
    'editorial': 'dynamic fashion magazine pose at 45-degree angle with confident expression showing style and presence'
  }
};

// Önceden hazırlanmış kombinasyonlar
const PREDEFINED_PROMPTS: PreDefinedPrompts = {
  male: {
    'suit-navy-white-professional-studio': {
      clothing: 'classic-suit',
      colors: {
        main: 'navy',
        shirt: 'white'
      },
      pose: 'professional',
      background: 'studio-white',
      prompt: "img professional business portrait photo of a businessman wearing a perfectly tailored navy-blue suit with white dress shirt, standing straight facing camera with hands clasped in front professional business pose, on pure white studio background with professional lighting, professional business portrait, high-end corporate photography, 8k uhd, high quality"
    },
    'suit-gray-lightblue-editorial-office': {
      clothing: 'classic-suit',
      colors: {
        main: 'charcoal',
        shirt: 'light-blue'
      },
      pose: 'editorial',
      background: 'office-modern',
      prompt: "img professional business portrait photo of a businessman wearing a perfectly tailored charcoal suit with light-blue dress shirt, dynamic fashion magazine pose at 45-degree angle, in modern office setting with blurred contemporary background, professional business portrait, high-end corporate photography, 8k uhd, high quality"
    },
    'blazer-navy-white-casual-executive': {
      clothing: 'smart-casual-suit',
      colors: {
        main: 'navy',
        shirt: 'white',
        tie: 'burgundy'
      },
      pose: 'casual',
      background: 'office-executive',
      prompt: "img professional business portrait photo of a businessman wearing a sophisticated navy-blue blazer with white shirt and burgundy tie, relaxed standing pose with natural smile, in executive office with blurred elegant background, professional business portrait, high-end corporate photography, 8k uhd, high quality"
    }
  },
  female: {
    'blazer-suit-navy-professional-studio': {
      clothing: 'classic-suit',
      colors: {
        main: 'navy'
      },
      pose: 'professional',
      background: 'studio-white',
      prompt: "img professional business portrait photo of a businesswoman wearing a tailored navy-blue pantsuit, standing straight facing camera with hands clasped in front professional business pose, on pure white studio background with professional lighting, professional business portrait, high-end corporate photography, 8k uhd, high quality"
    },
    'blazer-black-white-editorial-office': {
      clothing: 'smart-casual-blazer',
      colors: {
        main: 'black',
        shirt: 'white'
      },
      pose: 'editorial',
      background: 'office-modern',
      prompt: "img professional business portrait photo of a businesswoman wearing a sophisticated black blazer with white blouse, dynamic fashion magazine pose at 45-degree angle, in modern office setting with blurred contemporary background, professional business portrait, high-end corporate photography, 8k uhd, high quality"
    },
    'dress-burgundy-casual-executive': {
      clothing: 'classic-dress',
      colors: {
        main: 'burgundy'
      },
      pose: 'casual',
      background: 'office-executive',
      prompt: "img professional business portrait photo of a businesswoman wearing an elegant burgundy sheath dress, relaxed standing pose with natural smile, in executive office with blurred elegant background, professional business portrait, high-end corporate photography, 8k uhd, high quality"
    }
  }
};

// Kıyafet şablonları
const CLOTHING_TEMPLATES: ClothingTemplates = {
  male: {
    'classic-suit': {
      template: "img ultra-realistic professional business portrait photo of a businessman wearing a perfectly tailored {mainColor} suit with crisp {shirtColor} shirt and elegant {tieColor} tie {pose} {background} with professional lighting high-end corporate photography 8k uhd ultra-high quality photorealistic",
    },
    'smart-casual-suit': {
      template: "img ultra-realistic professional business portrait photo of a businessman wearing a modern well-fitted {mainColor} suit with crisp {shirtColor} shirt no tie {pose} {background} with professional lighting high-end corporate photography 8k uhd ultra-high quality photorealistic",
    },
    'formal-shirt': {
      template: "img ultra-realistic professional business portrait photo of a businessman wearing an impeccably pressed {shirtColor} dress shirt with sophisticated {tieColor} tie {pose} {background} with professional lighting high-end corporate photography 8k uhd ultra-high quality photorealistic",
    },
    'smart-casual-shirt': {
      template: "img ultra-realistic professional business portrait photo of a businessman wearing a perfectly fitted {shirtColor} shirt no tie {pose} {background} with professional lighting high-end corporate photography 8k uhd ultra-high quality photorealistic",
    },
    'sweater-shirt': {
      template: "img ultra-realistic professional business portrait photo of a businessman wearing a refined {sweaterColor} sweater over a crisp {shirtColor} shirt {pose} {background} with professional lighting high-end corporate photography 8k uhd ultra-high quality photorealistic",
    },
    'casual-sweater': {
      template: "img ultra-realistic professional business portrait photo of a businessman wearing a sophisticated {sweaterColor} sweater {pose} {background} with professional lighting high-end corporate photography 8k uhd ultra-high quality photorealistic",
    }
  },
  female: {
    'classic-suit': {
      template: "img ultra-realistic professional business portrait photo of a businesswoman wearing an expertly tailored {mainColor} pantsuit with elegant {shirtColor} blouse {pose} {background} with professional lighting high-end corporate photography 8k uhd ultra-high quality photorealistic",
    },
    'smart-casual-blazer': {
      template: "img ultra-realistic professional business portrait photo of a businesswoman wearing a sophisticated {mainColor} blazer with refined {shirtColor} blouse {pose} {background} with professional lighting high-end corporate photography 8k uhd ultra-high quality photorealistic",
    },
    'classic-dress': {
      template: "img ultra-realistic professional business portrait photo of a businesswoman wearing an elegant {mainColor} sheath dress with perfect tailoring {pose} {background} with professional lighting high-end corporate photography 8k uhd ultra-high quality photorealistic",
    },
    'smart-casual-dress': {
      template: "img ultra-realistic professional business portrait photo of a businesswoman wearing a modern refined {mainColor} dress with professional cut {pose} {background} with professional lighting high-end corporate photography 8k uhd ultra-high quality photorealistic",
    },
    'classic-blouse': {
      template: "img ultra-realistic professional business portrait photo of a businesswoman wearing a luxurious {shirtColor} silk blouse with elegant drape {pose} {background} with professional lighting high-end corporate photography 8k uhd ultra-high quality photorealistic",
    },
    'smart-casual-blouse': {
      template: "img ultra-realistic professional business portrait photo of a businesswoman wearing a sophisticated {shirtColor} blouse with refined cut {pose} {background} with professional lighting high-end corporate photography 8k uhd ultra-high quality photorealistic",
    },
    'smart-casual-sweater': {
      template: "img ultra-realistic professional business portrait photo of a businesswoman wearing an elegant {sweaterColor} sweater with professional style {pose} {background} with professional lighting high-end corporate photography 8k uhd ultra-high quality photorealistic",
    }
  }
};

interface PortraitPrompts {
  male: {
    'suit': string;
    'blazer-full': string;
    'blazer-casual': string;
    'shirt-tie': string;
    'shirt-casual': string;
  };
  female: {
    'blazer-suit': string;
    'blazer-blouse': string;
    'dress': string;
    'blouse-pro': string;
    'blouse-casual': string;
  };
    }

const PORTRAIT_PROMPTS: PortraitPrompts = {
  male: {
    suit: "analog film photo of a businessman in a professional setting. faded film, desaturated, 35mm photo, grainy, vignette, vintage, Kodachrome, highly detailed, masterpiece, best quality, wearing a {mainColor} suit with {shirtColor} shirt, {pose}, {background}",
    'blazer-full': "analog film photo of a businessman in a professional setting. faded film, desaturated, 35mm photo, grainy, vignette, vintage, Kodachrome, highly detailed, masterpiece, best quality, wearing a {mainColor} blazer with {shirtColor} shirt and {tieColor} tie, {pose}, {background}",
    'blazer-casual': "analog film photo of a businessman in a professional setting. faded film, desaturated, 35mm photo, grainy, vignette, vintage, Kodachrome, highly detailed, masterpiece, best quality, wearing a {mainColor} blazer with {shirtColor} shirt, no tie, {pose}, {background}",
    'shirt-tie': "analog film photo of a businessman in a professional setting. faded film, desaturated, 35mm photo, grainy, vignette, vintage, Kodachrome, highly detailed, masterpiece, best quality, wearing a {shirtColor} shirt with {tieColor} tie, {pose}, {background}",
    'shirt-casual': "analog film photo of a businessman in a professional setting. faded film, desaturated, 35mm photo, grainy, vignette, vintage, Kodachrome, highly detailed, masterpiece, best quality, wearing a {shirtColor} shirt, {pose}, {background}"
  },
  female: {
    'blazer-suit': "analog film photo of a businesswoman in a professional setting. faded film, desaturated, 35mm photo, grainy, vignette, vintage, Kodachrome, highly detailed, masterpiece, best quality, wearing a {mainColor} pantsuit, {pose}, {background}",
    'blazer-blouse': "analog film photo of a businesswoman in a professional setting. faded film, desaturated, 35mm photo, grainy, vignette, vintage, Kodachrome, highly detailed, masterpiece, best quality, wearing a {mainColor} blazer with {shirtColor} silk blouse, {pose}, {background}",
    'dress': "analog film photo of a businesswoman in a professional setting. faded film, desaturated, 35mm photo, grainy, vignette, vintage, Kodachrome, highly detailed, masterpiece, best quality, wearing an elegant {mainColor} sheath dress, {pose}, {background}",
    'blouse-pro': "analog film photo of a businesswoman in a professional setting. faded film, desaturated, 35mm photo, grainy, vignette, vintage, Kodachrome, highly detailed, masterpiece, best quality, wearing a refined {shirtColor} silk blouse, {pose}, {background}",
    'blouse-casual': "analog film photo of a businesswoman in a professional setting. faded film, desaturated, 35mm photo, grainy, vignette, vintage, Kodachrome, highly detailed, masterpiece, best quality, wearing a sophisticated {shirtColor} blouse, {pose}, {background}"
    }
};

// Negatif prompt güncellendi
const NEGATIVE_PROMPT = "amateur quality, blurry, soft, wrong perspective, wrong angle, ugly, dowdy style, grainy";

// Renk paletleri
const COLOR_PALETTES = {
  suit: {
    'black': 'deep black',
    'charcoal': 'charcoal gray',
    'navy': 'navy blue',
    'medium-blue': 'medium blue',
    'smoke': 'smoke gray',
    'light-beige': 'light beige',
    'brown': 'rich brown',
    'olive': 'olive green',
    'burgundy': 'deep burgundy'
  } as const,
  shirt: {
    'white': 'pure white',
    'light-blue': 'light blue',
    'sand': 'sand beige',
    'light-gray': 'light gray',
    'ivory': 'ivory white',
    'lavender': 'soft lavender',
    'dusty-pink': 'dusty pink',
    'mint': 'mint green'
  } as const,
  tie: {
    'black': 'deep black',
    'navy': 'navy blue',
    'dark-green': 'dark green',
    'steel-blue': 'steel blue',
    'charcoal': 'charcoal gray',
    'burgundy': 'deep burgundy'
  } as const,
  sweater: {
    'smoke': 'smoke gray',
    'dark-green': 'dark forest green',
    'camel': 'warm camel',
    'navy': 'deep navy blue',
    'ash-gray': 'ash gray',
    'dark-blue': 'dark navy blue',
    'cinnamon': 'warm cinnamon',
    'burgundy': 'deep burgundy'
  } as const
} as const;

interface PortraitPrompts {
  male: {
    'suit': string;
    'blazer-full': string;
    'blazer-casual': string;
    'shirt-tie': string;
    'shirt-casual': string;
  };
  female: {
    'blazer-suit': string;
    'blazer-blouse': string;
    'dress': string;
    'blouse-pro': string;
    'blouse-casual': string;
  };
}

interface UserFeatures {
  gender: Gender;
  clothing: MaleClothing | FemaleClothing;
  colors: {
    main?: keyof typeof COLOR_PALETTES.suit;
    shirt?: keyof typeof COLOR_PALETTES.shirt;
    tie?: keyof typeof COLOR_PALETTES.tie;
    sweater?: keyof typeof COLOR_PALETTES.sweater;
  };
  pose: Pose;
  background: Background;
}

function generatePrompt(features: UserFeatures): string {
  // Get color descriptions
  const mainColor = features.colors.main ? COLOR_PALETTES.suit[features.colors.main] : '';
  const shirtColor = features.colors.shirt ? COLOR_PALETTES.shirt[features.colors.shirt] : '';
  const tieColor = features.colors.tie ? COLOR_PALETTES.tie[features.colors.tie] : '';
  const sweaterColor = features.colors.sweater ? COLOR_PALETTES.sweater[features.colors.sweater] : '';

  // Get pose description
  const pose = POSE_DESCRIPTIONS[features.gender][features.pose];
  
  // Get background description
  const background = BACKGROUND_DESCRIPTIONS[features.background];
  
  // Get clothing template
  const template = CLOTHING_TEMPLATES[features.gender][features.clothing as keyof (typeof CLOTHING_TEMPLATES)[typeof features.gender]].template;
  
  // Replace placeholders in template
  let prompt = template
    .replace('{mainColor}', mainColor)
    .replace('{shirtColor}', shirtColor)
    .replace('{tieColor}', tieColor)
    .replace('{sweaterColor}', sweaterColor)
    .replace('{pose}', pose)
    .replace('{background}', background);

  return prompt;
}

function getPreDefinedPrompt(features: UserFeatures): string {
  // Kombinasyon anahtarını oluştur
  const key = `${features.clothing}-${features.colors.main}-${features.pose}-${features.background}`;
  
  // Kravat veya gömlek varsa ekle
  const keyWithColors = features.colors.shirt ? 
    `${key}-${features.colors.shirt}` : key;
  const finalKey = features.colors.tie ? 
    `${keyWithColors}-${features.colors.tie}` : keyWithColors;

  // Önceden hazırlanmış promptu bul
  const genderPrompts = PREDEFINED_PROMPTS[features.gender];
  for (const [promptKey, promptData] of Object.entries(genderPrompts)) {
    if (promptKey.includes(finalKey)) {
      return promptData.prompt;
    }
  }

  // Eğer tam eşleşme bulunamazsa, en yakın eşleşmeyi bul
  for (const [promptKey, promptData] of Object.entries(genderPrompts)) {
    if (promptKey.includes(features.clothing) && 
        promptKey.includes(features.colors.main || '') &&
        promptKey.includes(features.pose)) {
      return promptData.prompt;
    }
  }

  // Hiç eşleşme bulunamazsa template'i kullan
  return generatePrompt(features);
}

// Replicate API yanıtlarını işle
async function processReplicateOutput(output: unknown): Promise<string> {
  console.log('API yanıtı:', output);
  
  // ReadableStream yanıtı kontrol et
  if (output instanceof ReadableStream) {
    const stream = output;
    const reader = stream.getReader();
    const chunks = [];
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
    
    // Tüm chunk'ları birleştir
    const concatenated = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
    let position = 0;
    
    for (const chunk of chunks) {
      concatenated.set(chunk, position);
      position += chunk.length;
    }
    
    // Binary veriyi base64'e çevir
    return `data:image/png;base64,${Buffer.from(concatenated).toString('base64')}`;
  }
  
  // String yanıtı kontrol et
  if (typeof output === 'string') {
    return output;
  } 
  
  // Dizi yanıtı kontrol et
  if (Array.isArray(output) && output.length > 0) {
    if (typeof output[0] === 'string') {
      return output[0];
    }
  }
  
  // SDXL modelinin yanıt formatı için kontrol
  if (output && typeof output === 'object' && 'images' in output) {
    const images = (output as { images: string[] }).images;
    if (Array.isArray(images) && images.length > 0) {
      return images[0];
    }
  }

  console.error('Geçersiz API yanıtı:', output);
  throw new Error('Geçersiz API yanıtı');
}

// Cloudinary'den gelen URL'i işle ve optimize et
async function processAndUploadImage(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(imageUrl);
    const buffer = Buffer.from(await response.arrayBuffer());

    // Sharp ile optimize et - daha keskin sonuçlar için
    const optimizedBuffer = await sharp(buffer)
      .resize(2400, 2400, { // Çözünürlük arttırıldı
        fit: 'inside',
        withoutEnlargement: true,
        kernel: sharp.kernel.lanczos3
      })
      .sharpen({ // Keskinlik arttırıldı
        sigma: 1.2,
        m1: 0.1,
        m2: 0.2,
        x1: 2,
        y2: 10,
        y3: 20
      })
      .png({
        quality: 100,
        compressionLevel: 9,
        palette: true,
        effort: 10 // Maksimum optimizasyon
      })
      .toBuffer();

    // Cloudinary'ye yükle
    const uploadResult = await cloudinary.uploader.upload(
      `data:image/png;base64,${optimizedBuffer.toString('base64')}`,
      {
        folder: 'cv-photos',
        resource_type: 'image',
        format: 'png',
        quality: 100,
        fetch_format: 'auto',
        flags: 'preserve_transparency',
        transformation: [
          { quality: 'auto:best' },
          { dpr: '3.0' }, // DPR arttırıldı
          { sharpen: 1000 }, // Keskinlik arttırıldı
          { unsharp_mask: { strength: 2000, radius: 2, threshold: 0.05 } } // Keskinlik maskesi eklendi
        ]
      }
    );

    return uploadResult.secure_url;
  } catch (error) {
    console.error('Görüntü işleme hatası:', error);
    throw error;
  }
}

// URL'den görüntüyü Cloudinary'ye yükle
async function uploadImageUrlToCloudinary(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(imageUrl);
    const buffer = Buffer.from(await response.arrayBuffer());
    const uploadResult = await cloudinary.uploader.upload(
      `data:image/png;base64,${buffer.toString('base64')}`,
      {
        folder: 'cv-photos',
        resource_type: 'image'
      }
    );
    return uploadResult.secure_url;
  } catch (error) {
    console.error('URL yükleme hatası:', error);
    throw error;
  }
}

// PhotoMaker ve face-swap işlemleri için tip tanımları
interface PhotoMakerResponse {
  images: string[];
}

interface FaceSwapResponse {
  image: string;
}

// PhotoMaker yanıtını işle
async function processPhotoMakerResponse(response: any): Promise<string> {
  if (response instanceof ReadableStream || (Array.isArray(response) && response[0] instanceof ReadableStream)) {
    const stream = Array.isArray(response) ? response[0] : response;
    const reader = stream.getReader();
    const chunks = [];
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
    
    // Tüm chunk'ları birleştir
    const concatenated = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
    let position = 0;
    
    for (const chunk of chunks) {
      concatenated.set(chunk, position);
      position += chunk.length;
    }
    
    // Binary veriyi base64'e çevir
    return `data:image/png;base64,${Buffer.from(concatenated).toString('base64')}`;
  }
  
  if (Array.isArray(response) && response.length > 0) {
    return response[0];
  }

  throw new Error('Geçersiz PhotoMaker yanıtı');
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const mode = formData.get('mode') as string;
    const featuresStr = formData.get('features') as string;
    const features = featuresStr ? JSON.parse(featuresStr) as UserFeatures : null;

    console.log('API isteği alındı:', {
      mode,
      hasFile: !!file,
      hasFeatures: !!features,
      features: features
    });

    if (!file) {
      return NextResponse.json({ error: 'Fotoğraf yüklenmedi' }, { status: 400 });
    }

    if (!mode) {
      return NextResponse.json({ error: 'İşlem modu belirtilmedi' }, { status: 400 });
    }

    try {
      // Dosyayı buffer'a çevir
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      console.log('Buffer oluşturuldu, boyut:', buffer.length);

      // Önce Cloudinary'ye yükle
      console.log('Orijinal görüntü Cloudinary\'ye yükleniyor...');
      const uploadResult = await uploadToCloudinary(buffer);
      console.log('Orijinal görüntü Cloudinary\'ye yüklendi:', uploadResult);

      console.log('İşlem modu kontrolü:', mode);
      if (mode === 'remove-bg') {
        console.log('Arka plan kaldırma işlemi başlatılıyor...');
        const prediction = await replicate.predictions.create({
          version: "f74986db0355b58403ed20963af156525e2891ea3c2d499bfbfb2a28cd87c5d7",
          input: {
            image: uploadResult
          },
        });
        console.log('Replicate tahmin oluşturuldu (remove-bg):', prediction.id);

        const output = await waitForPrediction(prediction);
        console.log('Arka plan kaldırma tamamlandı');

        // İşlenen görüntüyü Cloudinary'ye yükle ve optimize et
        const processedImageUrl = await processAndUploadImage(output);
        return NextResponse.json({ processedImage: processedImageUrl });
      } else if (mode === 'ai-portrait') {
        console.log('AI portre modu seçildi');
        if (!features) {
          console.error('AI portre için özellikler eksik');
          return NextResponse.json({ error: 'Özellikler belirtilmedi' }, { status: 400 });
        }

        console.log('AI portre işlemi başlatılıyor...');
        const prompt = generatePrompt(features);
    console.log('Oluşturulan prompt:', prompt);

        // InstantID modeli ile tahmin oluştur
        const prediction = await replicate.run(
          `${MODEL_NAME}:${MODEL_VERSION}`,
        {
          input: {
              image: uploadResult,
            prompt: prompt,
              ip_adapter_scale: 0.9,
              num_inference_steps: 30,
              guidance_scale: 0,
              negative_prompt: NEGATIVE_PROMPT,
              seed: -1,
              width: 768,
              height: 1024,
            num_outputs: 1,
              safety_checker: true,
              controlnet_conditioning_scale: 0.7,
              adapter_image_scale: 1.0
            }
          }
        );

        console.log('InstantID işlemi tamamlandı:', prediction);

        if (!prediction || (Array.isArray(prediction) && !prediction[0])) {
          throw new Error('InstantID işlemi başarısız oldu: Çıktı alınamadı');
        }

        // İşlenen görüntüyü Cloudinary'ye yükle ve optimize et
        const result = Array.isArray(prediction) ? prediction[0] : prediction;
        const processedImageUrl = await processAndUploadImage(result);
        return NextResponse.json({ processedImage: processedImageUrl });
      } else {
        return NextResponse.json({ error: 'Geçersiz işlem modu' }, { status: 400 });
      }
    } catch (processError: unknown) {
      console.error('İşlem hatası:', processError);
      throw new Error(`Görüntü işleme hatası: ${processError instanceof Error ? processError.message : 'Bilinmeyen hata'}`);
    }
  } catch (error) {
    console.error('Ana hata:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}