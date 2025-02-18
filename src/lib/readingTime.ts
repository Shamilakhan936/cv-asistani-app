const WORDS_PER_MINUTE = 200; // Ortalama okuma hızı

/**
 * Verilen metni analiz ederek tahmini okuma süresini hesaplar
 * @param text Okunma süresi hesaplanacak metin
 * @returns Dakika cinsinden okuma süresi
 */
export function calculateReadingTime(text: string): number {
  // Remove HTML tags and Markdown formatting
  const cleanText = text
    .replace(/(<([^>]+)>)/gi, '') // Remove HTML tags
    .replace(/[#*`_~\[\]]/g, '') // Remove Markdown formatting
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  const words = cleanText.split(' ').length;
  const minutes = Math.ceil(words / WORDS_PER_MINUTE);

  return Math.max(1, minutes); // Minimum 1 minute reading time
} 