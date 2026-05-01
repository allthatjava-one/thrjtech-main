import type { MetaFunction, LinksFunction } from 'react-router'
import toolCss from '../../src/tools/image-collage/ImageCollage.css?url'
import ImageCollagePage from '../../src/tools/image-collage'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: toolCss },
]

export const meta: MetaFunction = () => [
  { title: 'Image Collage Maker — THRJ' },
  { name: 'description', content: 'Create beautiful image collages online with an intuitive, free collage maker.' },
]

export default ImageCollagePage
