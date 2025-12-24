export interface EmailPayload {
  to: string
  subject: string
  html: string
  text?: string
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

interface EmailProvider {
  send(payload: EmailPayload): Promise<EmailResult>
}

// Resend provider
async function sendWithResend(payload: EmailPayload): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM || 'noreply@marilesetrini.com'
  
  if (!apiKey) {
    return { success: false, error: 'RESEND_API_KEY not configured' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      return { success: false, error }
    }

    const data = await response.json()
    return { success: true, messageId: data.id }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

// SMTP provider (placeholder - would need nodemailer in production)
async function sendWithSMTP(payload: EmailPayload): Promise<EmailResult> {
  console.log('SMTP email would be sent:', payload)
  return { 
    success: false, 
    error: 'SMTP not implemented. Install nodemailer for SMTP support.' 
  }
}

// Provider factory
function getProvider(): EmailProvider {
  const provider = process.env.EMAIL_PROVIDER || 'resend'
  
  switch (provider) {
    case 'resend':
      return { send: sendWithResend }
    case 'smtp':
      return { send: sendWithSMTP }
    default:
      return { send: sendWithResend }
  }
}

export async function sendEmail(payload: EmailPayload): Promise<EmailResult> {
  const provider = getProvider()
  return provider.send(payload)
}

// Contact form email template
export function createContactEmailHtml(data: {
  name: string
  email: string
  phone?: string
  message: string
  propertyTitle?: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a2e; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #666; }
        .value { margin-top: 5px; }
        .footer { padding: 15px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Nuevo Mensaje de Contacto</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Nombre:</div>
            <div class="value">${data.name}</div>
          </div>
          <div class="field">
            <div class="label">Email:</div>
            <div class="value">${data.email}</div>
          </div>
          ${data.phone ? `
          <div class="field">
            <div class="label">Teléfono:</div>
            <div class="value">${data.phone}</div>
          </div>
          ` : ''}
          ${data.propertyTitle ? `
          <div class="field">
            <div class="label">Propiedad de Interés:</div>
            <div class="value">${data.propertyTitle}</div>
          </div>
          ` : ''}
          <div class="field">
            <div class="label">Mensaje:</div>
            <div class="value">${data.message}</div>
          </div>
        </div>
        <div class="footer">
          Marile Setrini Inmobiliaria
        </div>
      </div>
    </body>
    </html>
  `
}
