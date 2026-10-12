# Kookee starter for TanStack Start on Cloudflare

A TanStack Start site for the content of a [Kookee](https://kookee.dev) project: a blog, a
changelog, a help center with search, your pages, a read-only roadmap and, when you turn it on,
your status page, plus the Kookee site widget. It renders on Cloudflare Workers, and Workers Cache keeps every page and read at the edge.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/kookee-dot-dev/starter-tanstack-start)

**Live demo:** [kookee-site.denpo.workers.dev](https://kookee-site.denpo.workers.dev), with the content of Ledgerly, a made-up invoicing app.

Built with [TanStack Start](https://tanstack.com/start), React 19, the Cloudflare Vite plugin,
[`@kookee/sdk`](https://www.npmjs.com/package/@kookee/sdk) and
[`@kookee/react`](https://www.npmjs.com/package/@kookee/react). No Tailwind: one stylesheet,
`src/styles/site.css`.

## What you get

| Path | What it shows |
| --- | --- |
| `/` | The newest posts and changelog entries, and the help categories |
| `/blog`, `/blog?page=2`, `/blog/{slug}` | Blog posts, 12 per page; a post with its table of contents and reactions |
| `/changelog`, `/changelog?page=2`, `/changelog/{slug}` | Changelog entries; an entry with reactions |
| `/help`, `/help/{category}`, `/help/{category}/{slug}` | Help categories and search as you type; a category's articles; an article with its table of contents and the "Was this article helpful?" vote |
| `/roadmap` | The open feedback posts by column, read-only. `KOOKEE_ROADMAP=false` hides it |
| `/status`, `/status/incidents/{id}` | Your status page, as Kookee hosts it: incidents, maintenance, and each component's uptime over 90 days; an incident with its updates. Times show in the visitor's zone. Off until you set `KOOKEE_STATUS=true` |
| `/{slug}` | Your pages, such as `/about` or `/privacy` |
| `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/blog/rss.xml`, `/changelog/rss.xml` | Files for search engines, AI crawlers and feed readers |

The header carries a "What's new" badge with the latest changelog entries, and a link to your
hosted portal when the project has it switched on. The site widget appears once you save its
settings in the Kookee dashboard (**Site widget → Customize**) and the cached pages refresh:
within `KOOKEE_REVALIDATE_SECONDS`, or right after a deploy. Once it shows, it loads its tabs and
texts in the browser, so later changes to them show within about a minute.

Every post, changelog entry, help article and page has its title, description, canonical URL, Open
Graph tags and schema.org JSON-LD, taken from the entry and its SEO fields; the lists have a title
and a canonical URL.

## Quick start

1. In [Kookee](https://kookee.dev), create a project (or open one), go to **API keys** and press
   **Create Key**.
2. Get the code with **Use this template** on GitHub, or clone it, and run `npm install`.
3. Copy `.dev.vars.example` to `.dev.vars` and set `KOOKEE_API_KEY`.
4. Run `npm run dev` and open http://localhost:5173.

Without a key every page shows a short setup guide instead of content.

To deploy, press **Deploy to Cloudflare** above. It copies the repository to your GitHub account,
asks for `KOOKEE_API_KEY`, and sets up Workers Builds, which deploys every push to `main`. From
your own machine, `npx wrangler secret put KOOKEE_API_KEY` once, then `npm run deploy`.

If the Deploy button sends you to GitHub's settings for the Cloudflare app instead of back to the
form, the app is installed on your GitHub account but not linked to this Cloudflare account. In the
Cloudflare dashboard, use **Workers & Pages → Create → Import a repository**, paste
`https://github.com/kookee-dot-dev/starter-tanstack-start` under **Clone a public repository via
Git URL**, and add `KOOKEE_API_KEY` as a secret (under the Worker's **Settings → Variables and
Secrets** if the form does not ask for it).

## Configuration

`KOOKEE_API_KEY` is a secret: `.dev.vars` locally, **Settings → Variables and Secrets** on
Cloudflare. `KOOKEE_REVALIDATE_SECONDS`, `KOOKEE_ROADMAP` and `KOOKEE_STATUS` are plain variables in
`wrangler.jsonc`, which you can also override in the dashboard. `SITE_URL` is not set at all until
you add it there, as a plain variable.

| Name | Default | What it does |
| --- | --- | --- |
| `KOOKEE_API_KEY` | | Required. A standard API key of your project |
| `SITE_URL` | the address the request came in on | The site's address in canonical URLs, the sitemap, feeds and `llms.txt`. Set it when the site answers on more than one address, such as `*.workers.dev` and your domain |
| `KOOKEE_REVALIDATE_SECONDS` | `21600` (6 hours) | How long Workers Cache keeps a page |
| `KOOKEE_ROADMAP` | `true` | `false` hides `/roadmap` and its header link |
| `KOOKEE_STATUS` | `false` | `true` shows `/status` and a header link. Turn it on once the project has its status page set up |

After you change `wrangler.jsonc`, run `npm run cf-typegen` to update `worker-configuration.d.ts`.

## Allowed origins

The key is read on the Worker, and it is also sent to the browser for the parts that run there:
reactions, the helpful vote, help search and the site widget. In Kookee, open **Settings →
Project** and add your production domain, your `*.workers.dev` address if you use it, and
`http://localhost` to the **Allowed Origins** card; `http://localhost` covers every port, and an
origin with a port is not accepted. Once the list holds an address, browsers on other sites are
refused with `403 ORIGIN_NOT_ALLOWED`; while it is empty, any site can use the key. The list
belongs to the project, so it has to name every site that uses the project's keys from a browser,
such as a widget on your product's own site. The Worker's own reads send no `Origin` header and
are not affected. Only owners and admins can change the list.

## What the key can do

Anyone can copy the key from your pages. With it they can read your published content, add
reactions and helpful votes, search the help center, ask the AI assistant and send feedback
through the widget. It cannot read drafts or change content.

Allowed origins stop other sites' browsers, not scripts, which send no `Origin` header. If the key
is abused, create a new one, set it as the `KOOKEE_API_KEY` secret (which deploys a new version),
and then revoke the old one (**Revoke key** on the **API keys** page).

## How content stays fresh

Every page's Kookee reads run on the Worker, in GET server functions that the route loaders call,
so moving between pages also goes through the Worker and its cache; the sitemap, feeds and
`llms.txt` read in server routes. Help search, the widget, reactions and votes go from the browser
to the API. `src/start.ts` tells Workers Cache how long to keep each response:

- a page, a server function's answer or a feed: `KOOKEE_REVALIDATE_SECONDS`, then served stale for
  up to a day while Cloudflare fetches a fresh copy;
- a 404: five minutes, so a repeated request for a missing page reaches the API at most that
  often;
- anything else, errors included: not cached. A failed read answers 500, and the feeds and sitemap
  answer 503, so an error page never sits in the cache.

Publishing in Kookee does not clear the cache: a change shows within the window, or at once after
a deploy, since every Worker version starts with an empty cache. Lower `KOOKEE_REVALIDATE_SECONDS`
for fresher pages at the cost of more API requests.

The status page is the exception: the page is cached like the others, but the status itself is read
in the browser when it opens and again every minute while its tab is visible, so it is always
current. Those reads do not count against the monthly quota; they have a rate limit of their own,
ten times the project's per-minute limit.

Workers Cache works on `*.workers.dev` and on your own domain. With it on, Cloudflare bills
requests for static assets (scripts, styles, the icon) at the standard Workers request rate.

## API usage

Every request the Worker makes with its key counts against the monthly request quota of the
project owner's account, shared by all their projects:

- on each cache refresh: the project, the header's changelog entries and the footer's pages, plus
  what the page shows;
- in the browser: each help search, the widget's Help tab and article reader, and a reaction or
  helpful vote when clicked.

The widget's settings and its AI chat are not API requests; each chat answer uses the account's AI
answers. The Free plan has 100,000 requests a month and 50 AI answers, and a project takes at most
300 requests a minute, shared by the Worker and the browsers.

Reading a blog post, page or help article also counts a view in Kookee. Here that happens when the
page's cache entry is refreshed, not once per reader; a help article opened in the widget's
article reader counts a view each time. Help article views order the popular articles in the
widget and on the portal. Changelog entries count no views.

A random query string (`/blog?x=1`) makes a new cache entry, so the Worker renders that page again
with all its reads; the per-minute limit bounds what that can cost.

## Customizing

- **Look:** the tokens at the top of `src/styles/site.css`. The `.kookee-content` rule hands them
  to every Kookee component; dark mode follows the operating system.
- **URLs:** `src/lib/paths.ts`. `getPath` decides where each entry lives (links inside entry
  bodies, the sitemap and the feeds use
it), and `hrefs` gives the same paths to the lists, search and "What's new". Change both when you
change a route.
- **Pages:** the routes in `src/routes/`, and the reads in `src/lib/kookee.ts`. The components and
  their props are documented in the [`@kookee/react`
  README](https://www.npmjs.com/package/@kookee/react).
- **Languages:** the site reads your project's default language only, so every entry has one URL.
- **Not shown:** help articles without a category (they have no URL here), and a page whose slug
  is `blog`, `changelog`, `help`, `roadmap` or `status` (even with the status page off), which those
  routes would hide.

## Troubleshooting

| Error | What it means |
| --- | --- |
| `401 API_KEY_INVALID` | The key is wrong, or it was deleted. Copy it again from **API keys** |
| `403 ORIGIN_NOT_ALLOWED` | A browser request came from a domain missing from **Allowed Origins**. Add it, including `http://localhost` for development |
| `429 RATE_LIMIT_EXCEEDED` | More than the per-minute limit, shared by the Worker and the browsers |
| `429 MONTHLY_API_LIMIT_EXCEEDED` | The account used its monthly requests. Cached pages keep being served until they expire; the rest answer 500 |



More in the Kookee help center: [API keys and
security](https://kookee.dev/help/account-and-operations/api-keys-and-security) and [rate limits
and plans](https://kookee.dev/help/account-and-operations/rate-limits-plans-and-error-handling).

## License

MIT
