import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { OrganizationSchema, WebsiteSchema } from './structured-data'

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Export Platform - B2B платформа для экспорта',
  description: 'Платформа для экспортеров и бизнеса. Найдите надежных партнеров для экспорта товаров и услуг.',
  keywords: 'экспорт, b2b, бизнес, экспортеры, импортеры, торговля, международная торговля',
  robots: {
    index: true,
    follow: true,
  },
  applicationName: 'Export Platform',
  creator: 'Export Platform Team',
  publisher: 'Export Platform',
  authors: [{ name: 'Export Platform Team' }],
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://export-platform.vercel.app',
    title: 'Export Platform - B2B платформа для экспорта',
    description: 'Платформа для экспортеров и бизнеса. Найдите надежных партнеров для экспорта товаров и услуг.',
    siteName: 'Export Platform',
    images: [
      {
        url: 'https://export-platform.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Export Platform',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Export Platform - B2B платформа для экспорта',
    description: 'Платформа для экспортеров и бизнеса. Найдите надежных партнеров для экспорта товаров и услуг.',
    images: ['https://export-platform.vercel.app/og-image.png'],
  },
  other: {
    'yandex-verification': 'export-platform-verification',
    'google-site-verification': 'export-platform-verification',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={inter.variable}>
      <head>
        <link rel="canonical" href="https://export-platform.vercel.app" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <OrganizationSchema />
        <WebsiteSchema />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
} 