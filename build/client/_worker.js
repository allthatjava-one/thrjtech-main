import { createRequestHandler } from '@react-router/cloudflare'
import * as build from '../server/index.js'

/**
 * React Router SSR handler.
 * Cloudflare Workers Assets automatically serves static files from
 * build/client/ (configured in wrangler.toml [assets]) BEFORE this
 * Worker runs, so any request that reaches here is a route or API call.
 *
 * createRequestHandler returns a (request, env, ctx) => Response handler —
 * the three native Cloudflare Worker fetch arguments must be passed separately.
 * getLoadContext maps them into context.cloudflare so loaders can access env.
 */
const requestHandler = createRequestHandler(build, ({ context }) => ({
  cloudflare: context.cloudflare,
}))

export default {
  async fetch(request, env, ctx) {
    return requestHandler(request, env, ctx)
  },
}