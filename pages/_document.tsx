import { Head, Html, Main, NextScript } from "next/document";
import { LOGO_PATH } from "@/shared/site-meta";

export default function Document() {
  return (
    <Html lang="en-IN">
      <Head>
        <link rel="icon" href={LOGO_PATH} type="image/png" />
        <link rel="apple-touch-icon" href={LOGO_PATH} />
        <meta name="theme-color" content="#f5f3ef" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
