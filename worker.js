import { createPagesFunctionHandler } from '@react-router/cloudflare'
import * as build from './build/server/index.js'

/**
 * React Router SSR handler for Cloudflare Pages (_worker.js advanced mode).
 *
 * createPagesFunctionHandler expects a context object { request, env, waitUntil,
 * passThroughOnException } — NOT positional (request, env, ctx) args.
 * In Pages advanced mode all requests (including static assets) pass through
 * this worker; the handler tries env.ASSETS first, then falls through to SSR.
 */
const handler = createPagesFunctionHandler({ build })

export default {
  async fetch(request, env, ctx) {
    return handler({
      request,
      env,
      waitUntil: ctx.waitUntil.bind(ctx),
      passThroughOnException: ctx.passThroughOnException.bind(ctx),
    })
  },
}