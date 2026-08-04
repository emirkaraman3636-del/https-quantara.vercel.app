import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vortex AI - Enterprise Sales Analytics Dashboard',
  description: 'Enterprise-grade AI Sales Analytics Platform. Upload Excel (.xlsx) or CSV files for instant dynamic business insights, size breakdown, product ranking, and revenue velocity trends.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
