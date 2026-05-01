import type { MetaFunction } from 'react-router'
import PrivacyPolicyPage from '../../src/components/about/PrivacyPolicyPage'

export const meta: MetaFunction = () => [
  { title: 'Privacy Policy — THRJ' },
  { name: 'description', content: 'THRJ Tech privacy policy — your data stays in your browser.' },
]

export default PrivacyPolicyPage
