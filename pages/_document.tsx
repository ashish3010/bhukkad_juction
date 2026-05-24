import { Head, Html, Main, NextScript } from "next/document";
import { LOGO_PATH } from "@/shared/site-meta";
import { resolveImageSrc } from "@/shared/resolve-image-src";

export default function Document() {
  const logoHref = resolveImageSrc(LOGO_PATH);
  return (
    <Html lang="en-IN">
      <Head>
        <link rel="icon" href={logoHref} type="image/png" />
        <link rel="apple-touch-icon" href={logoHref} />
        <meta name="theme-color" content="#f5f3ef" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
