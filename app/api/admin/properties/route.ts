import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/src/infrastructure/db/prisma'
import { supabase } from '@/src/infrastructure/auth/supabase'

async function checkAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader?.startsWith('Bearer ')) {
    // Try to get session from cookies
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return null
    }

    // Check if user is admin
    const admin = await prisma.adminUser.findUnique({
      where: { userId: session.user.id },
    })

    return admin ? session.user : null
  }

  return null
}

export async function GET(request: NextRequest) {
  try {
    const user = await checkAdmin(request)
    
    // For listing, we'll allow the request but only return published if not admin
    const where = user ? {} : { published: true }
    
    const properties = await prisma.property.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    const formatted = properties.map((p: { price: unknown; areaM2: unknown | null; [key: string]: unknown }) => ({
      ...p,
      price: Number(p.price),
      areaM2: p.areaM2 ? Number(p.areaM2) : null,
    }))

    return NextResponse.json({ data: formatted })
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json({ error: 'Error al obtener propiedades' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const property = await prisma.property.create({
      data: {
        slug: body.slug,
        title: body.title,
        description: body.description || null,
        transactionType: body.transactionType,
        propertyType: body.propertyType || null,
        price: body.price,
        currency: body.currency,
        address: body.address || null,
        localidadId: body.localidadId || null,
        localidadNombre: body.localidadNombre || null,
        bedrooms: body.bedrooms || null,
        bathrooms: body.bathrooms || null,
        areaM2: body.areaM2 || null,
        images: body.images || [],
        published: body.published || false,
        featured: body.featured || false,
      },
    })

    return NextResponse.json({
      ...property,
      price: Number(property.price),
      areaM2: property.areaM2 ? Number(property.areaM2) : null,
    })
  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json({ error: 'Error al crear propiedad' }, { status: 500 })
  }
}
