import { Hero } from '@/src/presentation/components/home/hero'
import { MapSection } from '@/src/presentation/components/home/map-section'
import { AboutSection } from '@/src/presentation/components/home/about-section'
import { ContactSection } from '@/src/presentation/components/home/contact-section'

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
