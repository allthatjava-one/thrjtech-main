import type { MetaFunction, LinksFunction } from 'react-router'
import toolCss from '../../src/tools/text-regex/RegexTester.css?url'
import RegexTesterPage from '../../src/tools/text-regex/RegexTesterPage'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: toolCss },
]

export const meta: MetaFunction = () => [
  { title: 'Regex Tester — THRJ' },
  { name: 'description', content: 'Regex search and replace tool with live match highlighting — free, fast, in-browser.' },
]

export default RegexTesterPage
