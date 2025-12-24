import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod/v4'
import prisma from '@/src/infrastructure/db/prisma'
import { TransactionType, PropertyType, Currency } from '@/src/domain/entities/property'

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
  operation: z.nativeEnum(TransactionType).optional(),
  types: z.string().optional(), // comma-separated
  currency: z.nativeEnum(Currency).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  localidadId: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  sort: z.enum(['price_asc', 'price_desc', 'createdAt_asc', 'createdAt_desc']).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams.entries())
    
    const query = querySchema.parse(params)
    const { page, limit, operation, types, currency, minPrice, maxPrice, localidadId, featured, sort } = query

    // Build where clause
    const where: Record<string, unknown> = {
      published: true,
    }

    if (operation) {
      where.transactionType = operation
    }

    if (types) {
      const typeArray = types.split(',').filter((t) =>
        Object.values(PropertyType).includes(t as PropertyType)
      ) as PropertyType[]
      if (typeArray.length > 0) {
        where.propertyType = { in: typeArray }
      }
    }

    if (currency) {
      where.currency = currency
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {}
      if (minPrice !== undefined) {
        (where.price as Record<string, number>).gte = minPrice
      }
      if (maxPrice !== undefined) {
        (where.price as Record<string, number>).lte = maxPrice
      }
    }

    if (localidadId) {
      where.localidadId = localidadId
    }

    if (featured !== undefined) {
      where.featured = featured
    }

    // Build orderBy
    let orderBy: Record<string, 'asc' | 'desc'> = { createdAt: 'desc' }
    
    if (sort) {
      const [field, direction] = sort.split('_') as [string, 'asc' | 'desc']
      orderBy = { [field]: direction }
    }

    // Execute queries
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.property.count({ where }),
    ])

    // Format response
    const formattedProperties = properties.map((p: { price: unknown; areaM2: unknown | null; [key: string]: unknown }) => ({
      ...p,
      price: Number(p.price),
      areaM2: p.areaM2 ? Number(p.areaM2) : null,
    }))

    return NextResponse.json({
      data: formattedProperties,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Properties API error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Parámetros inválidos', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error al obtener propiedades' },
      { status: 500 }
    )
  }
}
