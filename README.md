# Bhukkad Junction

Next.js (Pages Router) app for the menu, cart, checkout, and order flow.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy **`.env.example`** to **`.env.local`** when you need the flags documented there.

## Images & animations

`/images/…` resolves to **`{NEXT_PUBLIC_IMAGE_ASSETS_SUFFIX}/images/…`** (and **`…/animations/…`** for `/animation/…`). Set the suffix to your CDN base URL or path prefix (no extra production-site base is applied in code). Use **`NEXT_PUBLIC_…`** so the client can build URLs.

If the suffix is unset, images stay as same-origin **`/images/…`**.

To use **`public/images`** during local JSON dev mode, set **`NEXT_PUBLIC_USE_LOCAL_PUBLIC_IMAGES=1`**.

## Site JSON (`common.json` / `menu.json`)

- **`NEXT_PUBLIC_ENV_MODE=dev`** (or `development`): load copy/menu only from **`public/static/common.json`** and **`public/static/menu.json`**.
- **Otherwise:** try **`/api/site-common`**, **`/api/site-menu`**, then upstream; if those fail, fall back to the same **`/static/*.json`** files.

### DevTools Network

Copy and menu JSON are **not** loaded during SSR. After the first paint, **`CommonCopyProvider`** and **`MenuDataProvider`** fetch **`/static/*.json`** or API URLs in **`useEffect`**.

On **client-side** navigations, **`_app` → `getInitialProps`** may run in the browser and call **`loadInitialSiteJson`**, which can show **`site-common`**, **`site-menu`**, or **`/static/*.json`** in Network.

**`__NEXT_DATA__`**

- **`__initialCommon`** / **`__initialMenu`** are **`null`** on the HTML from SSR; populated only after a client **`getInitialProps`** run (e.g. in-app navigation).

## Scripts

- `npm run dev` — development server  
- `npm run build` — production build  
- `npm run lint` — ESLint  
