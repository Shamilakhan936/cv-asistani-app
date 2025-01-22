import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import Replicate from 'replicate';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary yapılandırması
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

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

const POSE_DESCRIPTIONS = {
  'classic': 'facing camera directly with straight posture, shoulders relaxed, natural smile, eyes focused on lens, head straight',
  'slight-angle': 'body turned slightly to the side while face towards camera, shoulders relaxed, warm smile, professional three-quarter view',
  'confident': 'standing tall with one foot slightly forward, hands relaxed at sides, confident smile, direct eye contact with camera, strong presence',
  'lean-in': 'leaning slightly forward, hands elegantly positioned or lightly clasped, natural engaging smile, eyes connected with lens, approachable yet professional',
  'casual-lean': 'gentle shoulder lean, body at slight angle with face towards camera, warm inviting smile, direct eye contact, relaxed yet professional presence'
};

const BACKGROUND_DESCRIPTIONS = {
  'studio-white': 'on pure white studio background with professional lighting',
  'studio-gray': 'on light gray studio background with professional lighting',
  'studio-navy': 'on navy blue studio background with professional lighting',
  'studio-beige': 'on beige studio background with professional lighting',
  'studio-charcoal': 'on charcoal studio background with professional lighting',
  'office-modern': 'in modern office setting with blurred contemporary background',
  'office-executive': 'in executive office with blurred elegant background',
  'garden': 'with blurred natural garden background',
  'urban': 'with blurred urban professional background'
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
    // Görüntüyü optimize et ve arka planı beyaz yap
    const optimizedBuffer = await sharp(buffer)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true,
        kernel: sharp.kernel.lanczos3 // Daha iyi yeniden boyutlandırma kalitesi
      })
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .png({
        quality: 100,
        compressionLevel: 9,
        palette: true // Daha iyi renk kalitesi
      })
      .toBuffer();

    // Cloudinary'ye yükle
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'cv-photos',
          resource_type: 'image',
          format: 'png',
          quality: 100,
          fetch_format: 'auto',
          flags: 'preserve_transparency',
          transformation: [
            { quality: 'auto:best' },
            { dpr: '2.0' }
          ],
          use_filename: true,
          unique_filename: true,
          overwrite: true,
          attachment: true, // İndirilebilir olarak işaretle
          filename_override: 'cv_photo.png' // İndirilen dosyanın adı
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(optimizedBuffer);
    });

    return (result as any).secure_url;
  } catch (error) {
    console.error('Görüntü yükleme hatası:', error);
    throw new Error('Görüntü yüklenirken bir hata oluştu');
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

interface UserFeatures {
  gender: 'male' | 'female';
  clothing: string;
  clothingColors: {
    main?: string;
    shirt?: string;
    tie?: string;
  };
  pose: 'classic' | 'slight-angle' | 'confident' | 'lean-in' | 'casual-lean';
  background: 'studio-white' | 'studio-gray' | 'studio-navy' | 'studio-beige' | 'studio-charcoal' | 
              'office-modern' | 'office-executive' | 'garden' | 'urban';
}

interface LLaMAResponse {
  response: string;
}

function generatePromptFromTemplate(features: UserFeatures): string {
  const genderTemplates = PROMPT_TEMPLATES[features.gender];
  const clothingTemplate = genderTemplates[features.clothing];
  const pose = POSE_DESCRIPTIONS[features.pose];
  const background = BACKGROUND_DESCRIPTIONS[features.background];

  if (!clothingTemplate) {
    throw new Error(`Geçersiz kıyafet tipi: ${features.clothing}`);
  }

  return clothingTemplate.template
    .replace('{mainColor}', features.clothingColors.main || '')
    .replace('{shirtColor}', features.clothingColors.shirt || '')
    .replace('{tieColor}', features.clothingColors.tie || '')
    .replace('{pose}', pose)
    .replace('{background}', background);
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
    // URL'den görüntüyü al
    const response = await fetch(imageUrl);
    const buffer = Buffer.from(await response.arrayBuffer());

    // Sharp ile optimize et
    const optimizedBuffer = await sharp(buffer)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true,
        kernel: sharp.kernel.lanczos3
      })
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .png({
        quality: 100,
        compressionLevel: 9,
        palette: true
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
          { dpr: '2.0' }
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

// Önceden hazırlanmış kombinasyonlar ve promptları
const PREDEFINED_PROMPTS = {
  male: {
    // Takım elbise kombinasyonları
    'suit-navy-white-classic-studio': {
      clothing: 'suit',
      colors: {
        main: 'navy-blue',
        shirt: 'white'
      },
      pose: 'classic',
      background: 'studio-white',
      prompt: "img professional business portrait photo of a businessman wearing a perfectly tailored navy-blue suit with white dress shirt, looking directly at camera with confident posture, head straight, on pure white studio background with professional lighting, professional business portrait, high-end corporate photography, 8k uhd, high quality"
    },
    'suit-gray-lightblue-angle-office': {
      clothing: 'suit',
      colors: {
        main: 'charcoal',
        shirt: 'light-blue'
      },
      pose: 'slight-angle',
      background: 'office-modern',
      prompt: "img professional business portrait photo of a businessman wearing a perfectly tailored charcoal suit with light-blue dress shirt, head turned slightly, professional three-quarter view, in modern office setting with blurred contemporary background, professional business portrait, high-end corporate photography, 8k uhd, high quality"
    },
    // Blazer kombinasyonları
    'blazer-navy-white-red-confident-executive': {
      clothing: 'blazer-full',
      colors: {
        main: 'navy-blue',
        shirt: 'white',
        tie: 'red'
      },
      pose: 'confident',
      background: 'office-executive',
      prompt: "img professional business portrait photo of a businessman wearing a sophisticated navy-blue blazer with white shirt and red tie, confident stance with strong presence, in executive office with blurred elegant background, professional business portrait, high-end corporate photography, 8k uhd, high quality"
    }
  },
  female: {
    // Blazer takım kombinasyonları
    'blazer-suit-navy-classic-studio': {
      clothing: 'blazer-suit',
      colors: {
        main: 'navy-blue'
      },
      pose: 'classic',
      background: 'studio-white',
      prompt: "img professional business portrait photo of a businesswoman wearing a tailored navy-blue pantsuit, looking directly at camera with confident posture, head straight, on pure white studio background with professional lighting, professional business portrait, high-end corporate photography, 8k uhd, high quality"
    },
    // Blazer + Bluz kombinasyonları
    'blazer-black-white-angle-office': {
      clothing: 'blazer-blouse',
      colors: {
        main: 'black',
        shirt: 'white'
      },
      pose: 'slight-angle',
      background: 'office-modern',
      prompt: "img professional business portrait photo of a businesswoman wearing a sophisticated black blazer with white blouse, head turned slightly, professional three-quarter view, in modern office setting with blurred contemporary background, professional business portrait, high-end corporate photography, 8k uhd, high quality"
    },
    // Elbise kombinasyonları
    'dress-burgundy-confident-executive': {
      clothing: 'dress',
      colors: {
        main: 'burgundy'
      },
      pose: 'confident',
      background: 'office-executive',
      prompt: "img professional business portrait photo of a businesswoman wearing an elegant burgundy sheath dress, confident stance with strong presence, in executive office with blurred elegant background, professional business portrait, high-end corporate photography, 8k uhd, high quality"
    }
  }
};

function getPreDefinedPrompt(features: UserFeatures): string {
  // Kombinasyon anahtarını oluştur
  const key = `${features.clothing}-${features.clothingColors.main}-${features.pose}-${features.background}`;
  
  // Kravat veya gömlek varsa ekle
  const keyWithColors = features.clothingColors.shirt ? 
    `${key}-${features.clothingColors.shirt}` : key;
  const finalKey = features.clothingColors.tie ? 
    `${keyWithColors}-${features.clothingColors.tie}` : keyWithColors;

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
        promptKey.includes(features.clothingColors.main || '') &&
        promptKey.includes(features.pose)) {
      return promptData.prompt;
    }
  }

  // Hiç eşleşme bulunamazsa template'i kullan
  return generatePromptFromTemplate(features);
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Oturum bulunamadı" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const featuresStr = formData.get("features") as string;

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
    }

    // Features validasyonu
    if (!featuresStr) {
      return NextResponse.json({ error: "Özellikler bulunamadı" }, { status: 400 });
    }

    let features: UserFeatures;
    try {
      features = JSON.parse(featuresStr);
      
      // Zorunlu alanların kontrolü
      if (!features.gender || !features.clothing || !features.pose || !features.background) {
        return NextResponse.json({ 
          error: "Eksik özellikler: gender, clothing, pose ve background zorunludur" 
        }, { status: 400 });
      }
      
      // clothingColors kontrolü
      if (!features.clothingColors || typeof features.clothingColors !== 'object') {
        features.clothingColors = {};
      }
    } catch (error) {
      console.error('Features parsing error:', error);
      return NextResponse.json({ error: "Özellikler geçersiz format" }, { status: 400 });
    }

    console.log('İşlenecek özellikler:', features);

    // Cloudinary'ye yükle
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadResult = await cloudinary.uploader.upload(
      `data:image/png;base64,${buffer.toString('base64')}`,
      {
        folder: 'cv-photos',
        resource_type: 'image'
      }
    );
    const imageUrl = uploadResult.secure_url;

    // LLaMA API çağrısını kaldır ve yerine template kullan
    console.log('Prompt oluşturuluyor...');
    const prompt = getPreDefinedPrompt(features);
    console.log('Oluşturulan prompt:', prompt);

    // PhotoMaker ile fotoğraf oluştur
    console.log('PhotoMaker işlemi başlatılıyor...');
    try {
      const photomakerResult = await replicate.run(
        "tencentarc/photomaker:ddfc2b08d209f9fa8c1eca692712918bd449f695dabb4a958da31802a9570fe4",
        {
          input: {
            prompt: prompt,
            num_inference_steps: 50,
            input_image: imageUrl,
            style_name: "Photographic (Default)",
            num_outputs: 1,
            guidance_scale: 7.5,
            negative_prompt: "ugly, disfigured, low quality, blurry, nsfw, multiple faces, bad proportions, poorly drawn face, deformed iris, deformed pupils, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck"
          }
        }
      );

      console.log('PhotoMaker ham yanıt:', photomakerResult);
      const processedImage = await processPhotoMakerResponse(photomakerResult);
      console.log('İşlenmiş PhotoMaker yanıtı:', processedImage.substring(0, 100) + '...');

      if (!processedImage) {
        throw new Error('PhotoMaker işlemi başarısız oldu: Görüntü oluşturulamadı');
      }

      // Face-swap işlemi
      console.log('Face-swap işlemi başlatılıyor...');
      const faceswapResult = await replicate.run(
        "codeplugtech/face-swap:278a81e7ebb22db98bcba54de985d22cc1abeead2754eb1f2af717247be69b34",
        {
          input: {
            swap_image: imageUrl,
            input_image: processedImage
          }
        }
      ) as unknown as string;

      if (!faceswapResult) {
        throw new Error('Face-swap işlemi başarısız oldu');
      }

      // Son işlenmiş fotoğrafı Cloudinary'ye yükle
      const processedImageUrl = await uploadImageUrlToCloudinary(faceswapResult);

      return NextResponse.json({
        processedImage: processedImageUrl,
        originalImage: imageUrl
      });
    } catch (error) {
      console.error('PhotoMaker işlemi hatası:', error);
      throw error;
    }
  } catch (error) {
    console.error('API hatası:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}