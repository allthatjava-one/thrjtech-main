THRJ Tech main site

# Start in local
```
# For Local test
# npm run pages:dev

# serves dist/ + runs worker.js with API routes
> npm run build
> wrangler dev 

# For mobile testing
npm run dev -- --host
```

# Features
PDF Compressor: /src/tools/pdf-compressor
PDF Merger: /src/tools/pdf-merger
JSON Formatter: /src/tools/json-formatter

# Cloudflare config
* Build configurations:
```
Build command:npm run build
Deploy command:npx wrangler deploy
Version command:npx wrangler versions upload
Root directory:/
```

# Cloudflare Option - Rules
- Domains > Overview > Rules > Overview > Response Header Transform Rules
  - Added a new rule
  - Rule name: `Add X-Robots-Tag`
  - Expression: `(http.host eq "preview.thrjtech.com")`
  - Action: `Modify Response Header`
  - Header name: `X-Robots-Tag`
  - Value: `noindex, nofollow`