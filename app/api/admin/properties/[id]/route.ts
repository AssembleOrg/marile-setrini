import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/src/infrastructure/db/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const property = await prisma.property.findUnique({
      where: { id },
    })

    if (!property) {
      return NextResponse.json({ error: 'Propiedad no encontrada' }, { status: 404 })
    }

    return NextResponse.json({
      ...property,
      price: Number(property.price),
      areaM2: property.areaM2 ? Number(property.areaM2) : null,
    })
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json({ error: 'Error al obtener propiedad' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const property = await prisma.property.update({
      where: { id },
      data: {
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
    console.error('Error updating property:', error)
    return NextResponse.json({ error: 'Error al actualizar propiedad' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.property.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json({ error: 'Error al eliminar propiedad' }, { status: 500 })
  }
}
