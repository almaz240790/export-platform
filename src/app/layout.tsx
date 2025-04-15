import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { OrganizationSchema, WebsiteSchema } from './structured-data'
import { Providers } from './providers'

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Export Platform - B2B платформа для экспорта',
  description: 'Платформа для экспортеров и бизнеса. Найдите надежных партнеров для экспорта товаров и услуг.',
  keywords: 'экспорт, импорт, b2b, бизнес, международная торговля, экспортные товары, экспортные услуги',
  authors: [{ name: 'Export Platform Team' }],
  creator: 'Export Platform',
  publisher: 'Export Platform',
  openGraph: {
    title: 'Export Platform - B2B платформа для экспорта',
    description: 'Найдите надежных партнеров для экспорта товаров и услуг',
    url: 'https://export-platform.vercel.app',
    siteName: 'Export Platform',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Export Platform - B2B платформа для экспорта',
    description: 'Найдите надежных партнеров для экспорта товаров и услуг',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="canonical" href="https://export-platform.vercel.app" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <OrganizationSchema />
          <WebsiteSchema />
          {children}
        </Providers>
      </body>
    </html>
  )
} 