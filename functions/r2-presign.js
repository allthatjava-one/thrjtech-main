import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export async function onRequestPost(context) {
  try {
    // Read R2 credentials and runtime config from environment variables (never exposed to the browser)
    const {
      R2_ENDPOINT_URL,
      R2_ACCESS_KEY_ID,
      R2_SECRET_ACCESS_KEY,
      R2_PDF_BUCKET_NAME,
      PDF_COMPRESSOR_BACKEND_URL,
      PDF_MERGER_BACKEND_URL,
      PDF_CONVERTER_BACKEND_URL,
      PDF_SPLITTER_BACKEND_URL,
    } = context.env

    if (!R2_ENDPOINT_URL || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_PDF_BUCKET_NAME || !PDF_SPLITTER_BACKEND_URL) {
      throw new Error('Missing required R2 environment variables')
    }

    const { filename, contentType, tool } = await context.request.json()
    if (!filename || !contentType) {
      throw new Error('Missing filename or contentType in request body')
    }

    const key = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`
    const bucketName = R2_PDF_BUCKET_NAME

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
      new PutObjectCommand({ Bucket: bucketName, Key: key, ContentType: contentType }),
      { expiresIn: 300 },
    )

    // Return both backend URLs so each tool's r2Service can pick the one it needs
    return new Response(
      JSON.stringify({
        presignedUrl,
        key,
        pdfCompressorBackendUrl: PDF_COMPRESSOR_BACKEND_URL || '',
        pdfMergerBackendUrl: PDF_MERGER_BACKEND_URL || '',
        pdfConverterBackendUrl: PDF_CONVERTER_BACKEND_URL || '',
        pdfSplitterBackendUrl: PDF_SPLITTER_BACKEND_URL || '',
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || 'Internal error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
