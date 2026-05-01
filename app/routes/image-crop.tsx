import type { MetaFunction, LinksFunction } from 'react-router'
import toolCss from '../../src/tools/image-crop/ImageCrop.css?url'
import ImageCropPage from '../../src/tools/image-crop'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: toolCss },
]

export const meta: MetaFunction = () => [
  { title: 'Image Crop — THRJ' },
  { name: 'description', content: 'Crop images online with an intuitive, client-side image cropping tool.' },
]

export default ImageCropPage
