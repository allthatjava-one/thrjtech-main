import type { ActionFunctionArgs } from 'react-router'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

/**
 * Replaces the /r2-presign handler from worker.js.
 * POST /r2-presign → generates a pre-signed R2 upload URL.
 */
export async function action({ request, context }: ActionFunctionArgs) {
  try {
    const env = (context as any).cloudflare?.env ?? {}
    const {
      R2_ENDPOINT_URL,
      R2_ACCESS_KEY_ID,
      R2_SECRET_ACCESS_KEY,
      R2_PDF_BUCKET_NAME,
      PDF_COMPRESSOR_BACKEND_URL,
      PDF_MERGER_BACKEND_URL,
      PDF_CONVERTER_BACKEND_URL,
      PDF_SPLITTER_BACKEND_URL,
    } = env

    // Only R2 settings are required to mint a presigned upload URL.
    // Tool backend URLs are optional and returned when configured.
    if (!R2_ENDPOINT_URL || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_PDF_BUCKET_NAME) {
      throw new Error('Missing required R2 environment variables')
    }

    const { filename, contentType } = await request.json() as { filename: string; contentType: string }
    if (!filename || !contentType) {
      throw new Error('Missing filename or contentType in request body')
    }

    const key = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`

    const s3 = new S3Client({
      region: 'auto',
      endpoint: R2_ENDPOINT_URL,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    })

    const presignedUrl = await getSignedUrl(
      s3,
      new PutObjectCommand({ Bucket: R2_PDF_BUCKET_NAME, Key: key, ContentType: contentType }),
      { expiresIn: 300 },
    )

    return Response.json({
      presignedUrl,
      key,
      pdfCompressorBackendUrl: PDF_COMPRESSOR_BACKEND_URL || '',
      pdfMergerBackendUrl: PDF_MERGER_BACKEND_URL || '',
      pdfConverterBackendUrl: PDF_CONVERTER_BACKEND_URL || '',
      pdfSplitterBackendUrl: PDF_SPLITTER_BACKEND_URL || '',
    })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Internal error' }, { status: 500 })
  }
}
