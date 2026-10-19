# SAGU documentation site

Documentation website for [SAGU](https://github.com/VeCtORbytes/SaGuSDK), the open-source TypeScript AI agent SDK.

Next.js (App Router) + Fumadocs + Tailwind CSS, exported as a fully static site. Lives separately from the SDK and shares none of its dependencies; doc pages link to SDK source on GitHub.

## Run locally

```bash
git clone https://github.com/VeCtORbytes/SaGuDocs.git
cd SaGuDocs
npm install
npm run dev            # http://localhost:3000
```

## Checks

```bash
npm test               # demo-script self-check (node, no framework)
npm run lint
npm run types:check
npm run build          # static export → out/
npx serve out          # preview the export
```

## Layout

```text
SaGuDocs/
├── app/
│   ├── (home)/page.tsx        # landing page
│   ├── docs/                  # Fumadocs docs layout + page renderer
│   ├── api/search/route.ts    # static Orama search index
│   └── not-found.tsx
├── components/
│   ├── diagrams.tsx           # Architecture, runtime, provider, memory, handoff diagrams (server components)
│   ├── agent-demo.tsx         # simulated agent loop (client component)
│   ├── mdx.tsx                # MDX component map: <Source>, <SourceList>, diagrams, Tabs, Steps, TypeTable
│   └── search.tsx, provider.tsx
├── content/docs/              # all documentation pages (MDX) + meta.json sidebar order
└── lib/
    ├── shared.ts              # repo URL, source-link helper, base path
    ├── layout.shared.tsx      # navbar links and wordmark
    └── demo-script.ts         # scripted steps for the demo (+ .check.mts)
```

## Deploy

**GitHub Pages:** `.github/workflows/docs-site.yml` builds with `NEXT_PUBLIC_BASE_PATH=/SaGuDocs` and deploys `out/` on every push to `main`. Enable it with **Settings → Pages → Source → GitHub Actions**. The site is then served at https://vectorbytes.github.io/SaGuDocs/.

**Vercel / Netlify / Cloudflare Pages:** use the repository root, the build command to `npm run build`, and the output directory to `out`. No base path is needed on a root domain.

## Keeping docs in sync

See `content/docs/contributing/docs-sync.mdx` (published at `/docs/contributing/docs-sync`).
