import { NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { s3Client } from '@/src/infrastructure/storage/s3'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        
        // Convert to WebP using sharp
        const webpBuffer = await sharp(buffer)
            .webp({ quality: 80 })
            .toBuffer()

        // Generate unique filename with .webp extension
        const uniqueId = crypto.randomUUID()
        const originalName = file.name.split('.')[0].replace(/[^a-zA-Z0-9]/g, '-')
        const key = `properties/${uniqueId}-${originalName}.webp`
        
        const command = new PutObjectCommand({
            Bucket: process.env.DO_SPACES_BUCKET,
            Key: key,
            Body: webpBuffer, // Upload converted buffer
            ContentType: 'image/webp',
            ACL: 'public-read',
        })
        
        await s3Client.send(command)
        
        // Construct public URL
        const endpoint = process.env.DO_SPACES_ENDPOINT || ''
        let publicUrl = ''
        if (process.env.NEXT_PUBLIC_DO_SPACES_CDN_URL) {
            publicUrl = `${process.env.NEXT_PUBLIC_DO_SPACES_CDN_URL}/${key}`
        } else {
            const cleanEndpoint = endpoint.replace('https://', '').replace('http://', '')
            // Use path style construction mostly safe for DO
            publicUrl = `https://${cleanEndpoint}/${process.env.DO_SPACES_BUCKET}/${key}`
        }

        return NextResponse.json({ publicUrl, key })
    } catch (error) {
        console.error('Error uploading file:', error)
        return NextResponse.json({ error: 'Error uploading file' }, { status: 500 })
    }
}
