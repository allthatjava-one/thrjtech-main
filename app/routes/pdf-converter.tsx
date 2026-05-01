import type { MetaFunction, LinksFunction } from 'react-router'
import toolCss from '../../src/tools/pdf-converter/PdfConverter.css?url'
import PdfConverterPage from '../../src/tools/pdf-converter/PdfConverterPage'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: toolCss },
]

export const meta: MetaFunction = () => [
  { title: 'PDF Converter — THRJ' },
  { name: 'description', content: 'Convert PDF documents to image files — fast, free, and private.' },
]

export default PdfConverterPage
