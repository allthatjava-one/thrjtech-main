import type { MetaFunction, LinksFunction } from 'react-router'
import toolCss from '../../src/tools/image-converter/ImageConverter.css?url'
import ImageConverterPage from '../../src/tools/image-converter'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: toolCss },
]

export const meta: MetaFunction = () => [
  { title: 'Image Converter — THRJ' },
  { name: 'description', content: 'Convert images between JPG, PNG, WebP, and more formats instantly in your browser.' },
]

export default ImageConverterPage
