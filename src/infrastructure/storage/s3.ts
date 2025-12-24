import { S3Client } from '@aws-sdk/client-s3'

const bucket = process.env.DO_SPACES_BUCKET || ''
let endpoint = process.env.DO_SPACES_ENDPOINT || ''
const region = process.env.DO_SPACES_REGION || 'nyc3' // Default to nyc3 if not set

// Fix common misconfiguration where user includes bucket in endpoint
if (bucket && endpoint.includes(`${bucket}.`)) {
    endpoint = endpoint.replace(`${bucket}.`, '')
}

export const s3Client = new S3Client({
    endpoint,
    region,
    credentials: {
        accessKeyId: process.env.DO_SPACES_KEY!,
        secretAccessKey: process.env.DO_SPACES_SECRET!,
    },
    forcePathStyle: true, // Use path style to avoid SSL certificate issues
})
