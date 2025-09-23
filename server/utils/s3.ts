import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

// Initialize S3 client with credentials and with proper follow redirect settings
const s3Client = new S3Client({
  region: process.env.NUXT_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NUXT_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NUXT_AWS_SECRET_ACCESS_KEY || '',
  },
  endpoint: process.env.NUXT_AWS_ENDPOINT_URL,
  forcePathStyle: true, // Required for some S3-compatible services
  followRegionRedirects: true, // Set to true to follow region redirects
})

// Bucket name for file storage
const BUCKET_NAME = process.env.NUXT_AWS_S3_BUCKET

// URL construction based on bucket settings
const getS3Url = (key: string) => {
  const region = process.env.NUXT_AWS_REGION
  return `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${key}`
}

/**
 * Upload a file to S3
 * @param fileBuffer - The file buffer to upload
 * @param fileName - The name to use for the file in S3
 * @param contentType - The content type of the file
 * @returns The URL of the uploaded file
 */
export async function uploadFileToS3(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  // Create a unique file name to prevent collisions
  const uniqueFileName = `${Date.now()}-${fileName}`

  // Log S3 configuration details (without secrets)
  console.log('S3 Upload Config:', {
    region: process.env.NUXT_AWS_REGION,
    bucket: BUCKET_NAME,
    // endpoint: process.env.NUXT_AWS_ENDPOINT_URL || 'default AWS endpoint',
    fileName: uniqueFileName,
    contentType,
  })

  try {
    // Upload the file to S3
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: uniqueFileName,
      Body: fileBuffer,
      ContentType: contentType,
    }

    const result = await s3Client.send(new PutObjectCommand(uploadParams))
    console.log('S3 upload successful:', result.$metadata)

    // Generate URL using the helper function
    const objectUrl = getS3Url(uniqueFileName)

    console.log('Generated S3 URL:', objectUrl)
    return objectUrl
  } catch (error: unknown) {
    const err = error as Error & { name: string; $metadata?: { httpStatusCode?: number } }
    console.error('Error uploading file to S3:', err)

    // More detailed error logging
    if (err.name === 'BucketNotFound') {
      console.error('The specified bucket does not exist')
    } else if (err.name === 'InvalidAccessKeyId') {
      console.error('The AWS access key ID is invalid')
    } else if (err.name === 'SignatureDoesNotMatch') {
      console.error('The request signature is invalid')
    } else if (err.name === 'PermanentRedirect' || err.$metadata?.httpStatusCode === 301) {
      console.error(
        `Bucket "${BUCKET_NAME}" exists but is in a different region. Updating to follow redirects.`
      )

      // Try to extract the correct region from the response
      const redirectRegion = err.message?.match(/endpoint-(\w+-\w+-\d+)/)?.[1]
      if (redirectRegion) {
        console.warn(`Consider updating your AWS_REGION to "${redirectRegion}" in .env file`)
      }
    } else if (err.message && err.message.includes('endpoint')) {
      console.error('Endpoint error. Check your AWS_ENDPOINT_URL in .env file')
    }

    throw new Error(`Failed to upload file to S3: ${err.message}`)
  }
}

/**
 * Extract the file extension from a file name
 * @param fileName - The file name
 * @returns The file extension
 */
export function getFileExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() || ''
}

/**
 * Get the content type for a file based on its extension
 * @param extension - The file extension
 * @returns The content type
 */
export function getContentType(extension: string): string {
  const contentTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  }

  return contentTypes[extension] || 'application/octet-stream'
}
