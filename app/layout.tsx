import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Fotonic - Sewa Kamera & Jasa Foto Wisuda',
  description: 'Portal resmi pemesanan sewa kamera Nikon Z50 Mark II dan booking jasa foto wisuda, seminar, serta sidang Fotonic Creative Studio.',
  keywords: ['sewa kamera jogja', 'rental nikon z50', 'foto wisuda ugm', 'booking fotografer sidang', 'fotonic photography'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="bg-[#0b0f19] text-slate-100 min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
