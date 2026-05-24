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

`/images/…` and `/animation/…` resolve to **`/cdn/assets/images/…`** and **`/cdn/assets/animations/…`**, which use the same **`/cdn/:path*`** rewrite as other blob files (see **`shared/image-assets-root.ts`** and **`next.config.ts`**). The public blob URL shape is **`https://…vercel-storage.com/assets/images/…`**.

Edit **`VERCEL_BLOB_PUBLIC_ORIGIN`** / **`IMAGE_ASSETS_ROOT`** in **`shared/image-assets-root.ts`** if the bucket or path prefix changes.

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
