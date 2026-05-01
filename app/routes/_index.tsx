import type { MetaFunction } from 'react-router'
import { HomePage } from '../../src/App'

export const meta: MetaFunction = () => [
  { title: 'THRJ — Free Online Tools' },
  { name: 'description', content: 'Free, fast, privacy-friendly online utilities (image, PDF, and JSON tools) that run in your browser.' },
  { name: 'robots', content: 'index, follow' },
]

export default HomePage
