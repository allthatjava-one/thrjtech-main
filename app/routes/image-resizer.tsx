import type { MetaFunction, LinksFunction } from 'react-router'
import toolCss from '../../src/tools/image-resizer/ImageResizer.css?url'
import ImageResizerPage from '../../src/tools/image-resizer'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: toolCss },
]

export const meta: MetaFunction = () => [
  { title: 'Image Resizer — THRJ' },
  { name: 'description', content: 'Resize images online for free with a privacy-friendly, in-browser image resizer.' },
]

export default ImageResizerPage
