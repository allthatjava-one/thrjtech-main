import { createRequestHandler } from '@react-router/cloudflare'
import * as build from './build/server/index.js'

/**
 * React Router SSR handler.
 * Cloudflare Workers Assets automatically serves static files from
 * build/client/ (configured in wrangler.toml [assets]) BEFORE this
 * Worker runs, so any request that reaches here is a route or API call.
 */
const requestHandler = createRequestHandler(build)

export default {
  async fetch(request, env, ctx) {
    return requestHandler(request, { cloudflare: { env, ctx } })
  },
}