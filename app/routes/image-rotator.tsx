import type { MetaFunction, LinksFunction } from 'react-router'
import toolCss from '../../src/tools/image-rotator/ImageRotator.css?url'
import ImageRotatorPage from '../../src/tools/image-rotator'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: toolCss },
]

export const meta: MetaFunction = () => [
  { title: 'Image Rotator — THRJ' },
  { name: 'description', content: 'Rotate images 90°, 180°, or 270° online — free, fast, and private.' },
]

export default ImageRotatorPage
