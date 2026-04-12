/**
 * Shared R2 upload helper used by multiple tools (compressor, merger, converter).
 * Requests a presigned PUT URL from the serverless function, uploads the file,
 * and returns the presigned metadata including a backend URL field when present.
 */
export async function uploadToR2(file, tool = 'pdf-compressor') {
  const res = await fetch('/r2-presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: file.name, contentType: file.type || 'application/pdf', tool }),
  })

  if (!res.ok) {
    throw new Error(`Failed to get presigned URL: ${res.status} ${res.statusText}`)
  }

  const body = await res.json()
  const { presignedUrl, key } = body

  const response = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type || 'application/pdf' },
  })

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
  }

  // Preserve backward-compatible named backend keys depending on the tool
  const result = { presignedUrl, key }
  if (tool === 'pdf-compressor' && body.pdfCompressorBackendUrl) {
    result.pdfCompressorBackendUrl = body.pdfCompressorBackendUrl
  }
  if (tool === 'pdf-merger' && body.pdfMergerBackendUrl) {
    result.pdfMergerBackendUrl = body.pdfMergerBackendUrl
  }
  if (tool === 'pdf-converter' && body.pdfConverterBackendUrl) {
    result.pdfConverterBackendUrl = body.pdfConverterBackendUrl
  }
  if (tool === 'pdf-splitter' && body.pdfSplitterBackendUrl) {
    result.pdfSplitterBackendUrl = body.pdfSplitterBackendUrl
  }
  // also include any generic backendUrl if server provides it
  if (body.backendUrl) {
    result.backendUrl = body.backendUrl
  }

  return result
}
