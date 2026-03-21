import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export default defineConfig(({ mode }) => {
  // Load ALL .env vars (empty prefix = include non-VITE_ vars) for server-side use only
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'local-r2-presign',
        configureServer(server) {
          server.middlewares.use('/r2-presign', (req, res, next) => {
            if (req.method !== 'POST') return next()
            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', async () => {
              try {
                const { filename, contentType, tool } = JSON.parse(body)
                const key = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`
                const bucketName = tool === 'pdf-merger'
                  ? env.R2_PDF_MERGER_BUCKET_NAME
                  : env.R2_PDF_COMPRESSOR_BUCKET_NAME
                const s3 = new S3Client({
                  region: 'auto',
                  endpoint: env.R2_ENDPOINT_URL,
                  credentials: {
                    accessKeyId: env.R2_ACCESS_KEY_ID,
                    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
                  },
                })
                const presignedUrl = await getSignedUrl(
                  s3,
                  new PutObjectCommand({ Bucket: bucketName, Key: key, ContentType: contentType }),
                  { expiresIn: 300 },
                )
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({
                  presignedUrl,
                  key,
                  pdfCompressorBackendUrl: env.PDF_COMPRESSOR_BACKEND_URL || '',
                  pdfMergerBackendUrl: env.PDF_MERGER_BACKEND_URL || '',
                }))
              } catch (err) {
                res.statusCode = 500
                res.end(JSON.stringify({ error: err.message }))
              }
            })
          })
        },
      },
    ],
    build: {
      outDir: 'dist',
    },
  }
})
