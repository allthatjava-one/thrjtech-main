/**
 * Requests a presigned PUT URL from the serverless function (functions/r2-presign.js),
 * then uploads the file directly to Cloudflare R2.
 * R2 credentials are kept server-side in context.env — never exposed to the browser.
 * @param {File} file - The PDF file to upload.
 * @returns {Promise<{presignedUrl: string, key: string}>}
 */
export async function uploadToR2(file) {
  // Cloudflare Pages maps /r2-presign to functions/r2-presign.js
  const res = await fetch('/r2-presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: file.name, contentType: file.type || 'application/pdf', tool: 'pdf-compressor' }),
  })

  if (!res.ok) {
    throw new Error(`Failed to get presigned URL: ${res.status} ${res.statusText}`)
  }

  const { presignedUrl, key, pdfCompressorBackendUrl } = await res.json()

  const response = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': 'application/pdf' },
  })

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
  }

  return { presignedUrl, key, pdfCompressorBackendUrl }
}
