import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { Poppins } from "next/font/google";
import { THEME_STORAGE_KEY, ThemeProvider } from "@/features/theme/theme-context";
import {
  LOGO_PATH,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TITLE,
  absoluteSiteUrl,
  restaurantJsonLd,
} from "@/shared/site-meta";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-app",
});

const themeBootstrap = `!function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var t=localStorage.getItem(k);if(t==="dark"||t==="light")document.documentElement.dataset.theme=t;}catch(e){}}();`;

const LCP_HERO_SRC = "/images/landing-hero.png";

/** Preload menu hero so the LCP image is discoverable from HTML early (Lighthouse “LCP request discovery”). */
function LcpHeroPreload() {
  const { pathname } = useRouter();
  if (pathname !== "/" && pathname !== "/home") return null;
  return (
    <Head>
      <link rel="preload" href={LCP_HERO_SRC} as="image" type="image/png" />
    </Head>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  const canonical = absoluteSiteUrl("/");
  const ogImage = absoluteSiteUrl(LOGO_PATH);

  return (
    <>
      <Head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <title>{SITE_TITLE}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <meta name="keywords" content={SITE_KEYWORDS} />
        <meta name="author" content={SITE_NAME} />
        <meta name="robots" content="index, follow" />
        <meta name="application-name" content={SITE_NAME} />
        {canonical ? <link rel="canonical" href={canonical} /> : null}

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={SITE_TITLE} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:locale" content="en_IN" />
        {canonical ? <meta property="og:url" content={canonical} /> : null}
        {ogImage ? <meta property="og:image" content={ogImage} /> : null}
        {ogImage ? <meta property="og:image:alt" content={`${SITE_NAME} logo`} /> : null}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SITE_TITLE} />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />
        {ogImage ? <meta name="twitter:image" content={ogImage} /> : null}

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: restaurantJsonLd() }} />
      </Head>
      <div className={`${poppins.variable} min-h-screen font-sans antialiased`}>
        <ThemeProvider>
          <LcpHeroPreload />
          <Component {...pageProps} />
        </ThemeProvider>
      </div>
    </>
  );
}
