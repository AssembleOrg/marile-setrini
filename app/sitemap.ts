import prisma from '@/src/infrastructure/db/prisma'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/propiedades`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  // Dynamic property pages
  try {
    const properties = await prisma.property.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    })

    const propertyPages: MetadataRoute.Sitemap = properties.map((property: { slug: string; updatedAt: Date }) => ({
      url: `${baseUrl}/propiedades/${property.slug}`,
      lastModified: property.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    return [...staticPages, ...propertyPages]
  } catch {
    return staticPages
  }
}
