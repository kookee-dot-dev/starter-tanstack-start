// Not in wrangler.jsonc, so the Deploy to Cloudflare form does not ask for it: an optional variable
// you can add in the dashboard. See siteUrl() in src/lib/kookee.ts.
declare namespace Cloudflare {
  interface Env {
    SITE_URL?: string;
  }
}
