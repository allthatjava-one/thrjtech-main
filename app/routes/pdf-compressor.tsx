import type { MetaFunction, LinksFunction } from 'react-router'
import toolCss from '../../src/tools/pdf-compressor/PdfCompressor.css?url'
import PdfCompressorPage from '../../src/tools/pdf-compressor/PdfCompressorPage'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: toolCss },
]

export const meta: MetaFunction = () => [
  { title: 'PDF Compressor — THRJ' },
  { name: 'description', content: 'Compress PDF files online for free with THRJ\'s fast, in-browser PDF compressor.' },
]

export default PdfCompressorPage
