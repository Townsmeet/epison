import type { H3Event } from 'h3'
import { readMultipartFormData, sendError, createError } from 'h3'
import { uploadFileToS3 } from '../../server/utils/s3'

// Max upload size (bytes) - 10MB
const MAX_SIZE = 10 * 1024 * 1024

const ALLOWED_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
])

export default defineEventHandler(async (event: H3Event) => {
  try {
    const form = await readMultipartFormData(event)
    if (!form || !form.length) {
      throw createError({ statusCode: 400, statusMessage: 'No form data provided' })
    }

    const filePart = form.find(p => p.type === 'file')
    if (!filePart || !filePart.filename || !filePart.data) {
      throw createError({ statusCode: 400, statusMessage: 'No file provided' })
    }

    const keyPart = form.find(p => p.type === 'field' && p.name === 'key')
    const folderPart = form.find(p => p.type === 'field' && p.name === 'folder')

    const contentType = filePart.type || 'application/octet-stream'

    if (filePart.data.length > MAX_SIZE) {
      throw createError({ statusCode: 413, statusMessage: 'File too large (max 10MB)' })
    }
    if (!ALLOWED_MIME.has(contentType)) {
      throw createError({ statusCode: 415, statusMessage: 'Unsupported file type' })
    }

    // Construct the full key with folder if provided
    const folderPrefix = (folderPart?.data?.toString('utf8') || '').replace(/^\/+|\/+$/g, '')
    const filename = keyPart?.data?.toString('utf8') || filePart.filename
    const key = [folderPrefix, filename].filter(Boolean).join('/')

    // Upload to S3 using the simplified utility
    const url = await uploadFileToS3(filePart.data, key, contentType)

    return {
      key,
      url,
      contentType,
      size: filePart.data.length,
      filename: filePart.filename,
    }
  } catch (err) {
    return sendError(event, err as Error)
  }
})
