import type { MetaFunction, LinksFunction } from 'react-router'
import toolCss from '../../src/tools/pdf-merger/PdfMerger.css?url'
import PdfMergerPage from '../../src/tools/pdf-merger/PdfMergerPage'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: toolCss },
]

export const meta: MetaFunction = () => [
  { title: 'PDF Merger — THRJ' },
  { name: 'description', content: 'Merge multiple PDF files into one quickly and securely in your browser.' },
]

export default PdfMergerPage
