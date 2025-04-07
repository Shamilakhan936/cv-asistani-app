import type { Metadata } from "next";
import { Inter, Sora } from 'next/font/google';
import "./globals.css";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { trTR } from '@clerk/localizations';
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });
const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sora",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://cvasistani.com'),
  title: "CV Asistanı",
  description: "AI destekli CV oluşturma ve düzenleme platformu",
  keywords: ["CV hazırlama", "yapay zeka CV", "özgeçmiş oluşturma", "CV optimizasyonu", "iş başvurusu"],
  authors: [{ name: "CV Asistanı" }],
  openGraph: {
    title: "CV Asistanı - Yapay Zeka Destekli CV Hazırlama Platformu",
    description: "Yapay zeka teknolojisi ile profesyonel CV'nizi dakikalar içinde oluşturun ve optimize edin.",
    type: "website",
    locale: "tr_TR",
    siteName: "CV Asistanı",
  },
  twitter: {
    card: "summary_large_image",
    title: "CV Asistanı - Yapay Zeka Destekli CV Hazırlama",
    description: "Yapay zeka teknolojisi ile profesyonel CV'nizi dakikalar içinde oluşturun.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider localization={trTR}>
      <html lang="tr" className={`${inter.className} ${sora.variable} font-sora antialiased`}>
        <body className="font-sora antialiased">
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}