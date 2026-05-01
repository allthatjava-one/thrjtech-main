import type { MetaFunction, LinksFunction } from 'react-router'
import toolCss from '../../src/tools/image-meme-generator/MemeGenerator.css?url'
import ImageMemeGeneratorPage from '../../src/tools/image-meme-generator'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: toolCss },
]

export const meta: MetaFunction = () => [
  { title: 'Meme Generator — THRJ' },
  { name: 'description', content: 'Create and download custom memes using the free in-browser meme generator.' },
]

export default ImageMemeGeneratorPage
