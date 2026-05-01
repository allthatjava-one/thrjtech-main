import type { MetaFunction, LinksFunction } from 'react-router'
import toolCss from '../../src/tools/screen-recorder/ScreenRecorder.css?url'
import ScreenRecorderPage from '../../src/tools/screen-recorder'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: toolCss },
]

export const meta: MetaFunction = () => [
  { title: 'Quick Screen Recorder — THRJ' },
  { name: 'description', content: 'Record your screen instantly in the browser. 100% client-side and private.' },
]

export default ScreenRecorderPage
