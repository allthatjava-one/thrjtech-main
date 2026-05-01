import type { MetaFunction, LinksFunction } from 'react-router'
import toolCss from '../../src/tools/image-watermarker/Watermarker.css?url'
import WatermarkerPage from '../../src/tools/image-watermarker/WatermarkerPage'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: toolCss },
]

export const meta: MetaFunction = () => [
  { title: 'Image Watermarker — THRJ' },
  { name: 'description', content: 'Add text or image watermarks to photos quickly in your browser — no uploads required.' },
]

export default WatermarkerPage
