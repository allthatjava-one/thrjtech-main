/**
 * Postbuild: copies worker.js → build/client/_worker.js with the import
 * path adjusted for the new location.
 *
 * When Cloudflare Pages Git integration deploys, it looks for _worker.js
 * inside the output directory (build/client) and bundles it with esbuild.
 * The Worker imports build/server/index.js; from build/client/_worker.js
 * the correct relative path is ../server/index.js.
 */
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const src = readFileSync(resolve(root, 'worker.js'), 'utf8')

// Adjust the server build import path to be relative from build/client/
const out = src.replace(
  "'./build/server/index.js'",
  "'../server/index.js'",
)

writeFileSync(resolve(root, 'build/client/_worker.js'), out)
console.log('✔ build/client/_worker.js written')
