# Bhukkad Junction

Next.js (Pages Router) app for the menu, cart, checkout, and order flow.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Images & animations (CDN vs `public/`)

`/images/…` and `/animation/…` resolve to **`{NEXT_PUBLIC_PRODUCTION_SITE_ORIGIN}/assets/images/…`** and **`…/assets/animations/…`** by default (override base with `NEXT_PUBLIC_IMAGE_ASSETS_BASE`).

To use **`public/images`** (and local animation files) during **`next dev`** / localhost, set **`NEXT_PUBLIC_USE_LOCAL_PUBLIC_IMAGES=1`**.

## Site JSON (`common.json` / `menu.json`) and DevTools Network

Menu and copy JSON are loaded in **`pages/_app` → `getInitialProps`** (server on first paint, sometimes again on client navigations). Valid payloads are passed as **`__initialCommon`** and **`__initialMenu`** in `pageProps`, serialized into the HTML as part of **`__NEXT_DATA__`**.

So on a **full page load** you often **will not** see separate `fetch` / XHR rows for `site-common`, `site-menu`, or `/static/*.json`, because the browser did not request those URLs itself—the data arrived with the **document**.

**How to inspect the JSON**

1. **Network** → click the **first** row for your page (type **document** / the HTML URL) → **Response** (or **Preview**) → search for `__initialCommon` or `__initialMenu`.
2. Or **View Page Source** (⌥⌘U / Ctrl+U) and search for `__NEXT_DATA__`.

**When you *will* see JSON in Network**

- **Client-side** route changes: `getInitialProps` can run in the browser and `loadInitialSiteJson` may call `/api/site-common`, `/api/site-menu`, or `/static/*.json`—filter by **Fetch/XHR** or search `site-menu`, `common`, `static`.
- If SSR returned **null** for one payload, the matching **provider** falls back to a client `fetch`, which then shows in Network.

## Scripts

- `npm run dev` — development server  
- `npm run build` — production build  
- `npm run lint` — ESLint  
