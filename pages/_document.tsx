import { Head, Html, Main, NextScript } from "next/document";
import { getCachedLogoSrcForUi } from "@/shared/site-meta";

export default function Document() {
  /** Same string as in-page `<Image />` so the browser can dedupe the network entry with the logo in headers. */
  const logoHref = getCachedLogoSrcForUi();
  return (
    <Html lang="en-IN">
      <Head>
        <link rel="icon" href={logoHref} type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href={logoHref} sizes="180x180" />
        <meta name="theme-color" content="#f5f3ef" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
