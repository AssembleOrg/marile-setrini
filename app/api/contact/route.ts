import { NextResponse } from 'next/server'
import { z } from 'zod/v4'
import { sendEmail, createContactEmailHtml } from '@/src/infrastructure/email/email-service'
import prisma from '@/src/infrastructure/db/prisma'

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  phone: z.string().optional(),
  message: z.string().min(10),
  propertyId: z.string().uuid().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = contactSchema.parse(body)

    // Save to database
    await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        message: data.message,
        propertyId: data.propertyId || null,
      },
    })

    // Send email notification
    const adminEmail = process.env.ADMIN_EMAIL || 'marile@example.com'
    
    await sendEmail({
      to: adminEmail,
      subject: `Nuevo mensaje de contacto - ${data.name}`,
      html: createContactEmailHtml({
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
      }),
      text: `Nuevo mensaje de ${data.name} (${data.email}): ${data.message}`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error al procesar el mensaje' },
      { status: 500 }
    )
  }
}
