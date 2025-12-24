import { Hero } from '@/src/presentation/components/home/hero'
import { MapSection } from '@/src/presentation/components/home/map-section'
import { AboutSection } from '@/src/presentation/components/home/about-section'
import { ContactSection } from '@/src/presentation/components/home/contact-section'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Inmobiliaria en Florencio Varela | Marile Setrini',
  description: 'Venta y alquiler de casas, departamentos y terrenos en Florencio Varela. Tu inmobiliaria de confianza con atención personalizada.',
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <MapSection />
      <AboutSection />
      <ContactSection />
    </>
  )
}
