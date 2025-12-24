import type { Metadata } from 'next'
import { Providers } from '@/src/presentation/providers'
import { Navbar } from '@/src/presentation/components/layout/navbar'
import { Footer } from '@/src/presentation/components/layout/footer'
import { jakarta, playfair } from '@/src/presentation/providers/fonts'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Marile Setrini Inmobiliaria | Propiedades en Venta y Alquiler',
    template: '%s | Marile Setrini Inmobiliaria',
  },
  description:
    'Encontrá tu próximo hogar con Marile Setrini Inmobiliaria. Propiedades en venta y alquiler: casas, departamentos, terrenos y más. Atención personalizada y años de experiencia.',
  keywords: [
    'inmobiliaria',
    'propiedades',
    'venta',
    'alquiler',
    'casas',
    'departamentos',
    'terrenos',
    'Buenos Aires',
    'Argentina',
    'Marile Setrini',
  ],
  authors: [{ name: 'Marile Setrini Inmobiliaria' }],
  creator: 'Marile Setrini Inmobiliaria',
  publisher: 'Marile Setrini Inmobiliaria',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: '/',
    siteName: 'Marile Setrini Inmobiliaria',
    title: 'Marile Setrini Inmobiliaria | Propiedades en Venta y Alquiler',
    description:
      'Encontrá tu próximo hogar con Marile Setrini Inmobiliaria. Propiedades en venta y alquiler.',
    images: [
      {
        url: '/Logo 600x600px circulo amarillo2.png',
        width: 600,
        height: 600,
        alt: 'Marile Setrini Inmobiliaria',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marile Setrini Inmobiliaria',
    description: 'Propiedades en venta y alquiler',
    images: ['/Logo 600x600px circulo amarillo2.png'],
  },
  icons: {
    icon: '/Logo 600x600px circulo amarillo2.png',
    apple: '/Logo 600x600px circulo amarillo2.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={`${jakarta.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://nyc3.digitaloceanspaces.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'RealEstateAgent',
              name: 'Marile Setrini Inmobiliaria',
              description: 'Inmobiliaria con años de experiencia en venta y alquiler de propiedades.',
              url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
              logo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/Logo 600x600px circulo amarillo2.png`,
              telephone: '011 4287-0216',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Florencio Varela',
                addressRegion: 'Buenos Aires',
                addressCountry: 'AR',
              },
              image: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/Logo 600x600px circulo amarillo2.png`,
              priceRange: '$$',
              sameAs: [
                'https://www.facebook.com/inmobiliaria.marile/',
                'https://www.instagram.com/marile_setrini_inmobiliaria',
              ],
            }),
          }}
        />
      </head>
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
