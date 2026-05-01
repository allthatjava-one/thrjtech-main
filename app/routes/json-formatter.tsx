import type { MetaFunction, LinksFunction } from 'react-router'
import toolCss from '../../src/tools/text-json-formatter/JsonFormatter.css?url'
import JsonFormatterPage from '../../src/tools/text-json-formatter/JsonFormatterPage'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: toolCss },
]

export const meta: MetaFunction = () => [
  { title: 'JSON Formatter — THRJ' },
  { name: 'description', content: 'Format and beautify JSON online with an easy-to-use JSON formatter and validator.' },
]

export default JsonFormatterPage
