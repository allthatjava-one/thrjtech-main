import type { PlatformProxy } from 'wrangler'

type Cloudflare = Omit<PlatformProxy<Env>, 'dispose'>

declare module 'react-router' {
  interface AppLoadContext {
    cloudflare: Cloudflare
  }
}

type GetLoadContext = (args: {
  request: Request
  context: { cloudflare: Cloudflare }
}) => AppLoadContext

export const getLoadContext: GetLoadContext = ({ context }) => {
  return { cloudflare: context.cloudflare }
}
