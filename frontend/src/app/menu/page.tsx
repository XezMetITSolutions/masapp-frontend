1:09:01 AM: "build.command" failed                                        
1:09:01 AM: ────────────────────────────────────────────────────────────────
1:09:01 AM: ​
1:09:01 AM:   Error message
1:09:01 AM:   Command failed with exit code 1: npm run build (https://ntl.fyi/exit-code-1)
1:09:01 AM: ​
1:09:01 AM:   Error location
1:09:01 AM:   In build.command from netlify.toml:
1:09:01 AM:   npm run build
1:09:01 AM: ​
1:09:01 AM:   Resolved config
1:09:01 AM:   build:
1:09:01 AM:     base: /opt/build/repo/frontend
1:09:01 AM:     command: npm run build
1:09:01 AM:     commandOrigin: config
1:09:01 AM:     environment:
1:09:01 AM:       - NEXT_PUBLIC_API_URL
1:09:01 AM:       - NEXT_PUBLIC_FRONTEND_URL
1:09:01 AM:       - NODE_VERSION
1:09:01 AM:       - API_BASE_URL
1:09:01 AM:     publish: /opt/build/repo/frontend/out
1:09:01 AM:     publishOrigin: config
1:09:01 AM:   functionsDirectory: /opt/build/repo/frontend/netlify/functions
1:09:01 AM:   redirects:
1:09:01 AM:     - from: /api/subdomains/validate/*
      status: 200
      to: /.netlify/functions/subdomain-validate
    - force: true
      from: https://*.guzellestir.com/*
      headers:
        X-Subdomain: :subdomain
      status: 200
      to: https://guzellestir.com/:splat
    - from: /*
      status: 200
      to: /index.html
  redirectsOrigin: config
1:09:01 AM: Build failed due to a user error: Build script returned non-zero exit code: 2
1:09:01 AM: Failing build: Failed to build site
1:09:02 AM: Finished processing build request in 41.774s
Deploying
Skipped