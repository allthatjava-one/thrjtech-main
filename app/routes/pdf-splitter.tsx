import type { MetaFunction, LinksFunction } from 'react-router'
import toolCss from '../../src/tools/pdf-splitter/PdfSplitter.css?url'
import PdfSplitterPage from '../../src/tools/pdf-splitter/PdfSplitterPage'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: toolCss },
]

export const meta: MetaFunction = () => [
  { title: 'PDF Splitter — THRJ' },
  { name: 'description', content: 'Split PDF files into page ranges or individual pages — free and private.' },
]

export default PdfSplitterPage
