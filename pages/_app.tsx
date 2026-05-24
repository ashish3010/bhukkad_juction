import "@/styles/globals.css";
import NextApp from "next/app";
import type { AppContext, AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { Poppins } from "next/font/google";
import { THEME_STORAGE_KEY, ThemeProvider } from "@/features/theme/theme-context";
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TITLE,
  absoluteSiteUrl,
  restaurantJsonLd,
  getCachedLogoSrcForMeta,
} from "@/shared/site-meta";
import { resolveImageSrc } from "@/shared/resolve-image-src";
import { VercelAnalytics } from "@/features/analytics/VercelAnalytics";
import { VercelSpeedInsights } from "@/features/analytics/VercelSpeedInsights";
import { CommonCopyProvider } from "@/shared/data/common-copy-provider";
import { MenuDataProvider } from "@/shared/data/menu-data-provider";
import { loadInitialSiteJson } from "@/lib/load-initial-site-json";
import type { CommonCopy } from "@/shared/data/common";
import type { SiteMenuPayload } from "@/shared/data/site-json-payload";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-app",
});

const themeBootstrap = `!function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var t=localStorage.getItem(k);if(t==="dark"||t==="light")document.documentElement.dataset.theme=t;}catch(e){}}();`;

const LCP_HERO_SRC = "/images/landing-hero.png";

type PagePropsWithSiteJson = AppProps["pageProps"] & {
  __initialCommon?: CommonCopy | null;
  __initialMenu?: SiteMenuPayload | null;
};

/** Preload menu hero so the LCP image is discoverable from HTML early (Lighthouse “LCP request discovery”). */
function LcpHeroPreload() {
  const { pathname } = useRouter();
  if (pathname !== "/" && pathname !== "/home") return null;
  return (
    <Head>
      <link rel="preload" href={resolveImageSrc(LCP_HERO_SRC)} as="image" type="image/png" />
    </Head>
  );
}

function BhukkadApp({ Component, pageProps }: AppProps) {
  const { __initialCommon, __initialMenu, ...componentPageProps } = pageProps as PagePropsWithSiteJson;
  const canonical = absoluteSiteUrl("/");
  const ogImage = absoluteSiteUrl(getCachedLogoSrcForMeta());

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
          <CommonCopyProvider initialCommon={__initialCommon}>
            <MenuDataProvider initialMenu={__initialMenu}>
              <VercelAnalytics />
              <VercelSpeedInsights />
              <LcpHeroPreload />
              <Component {...componentPageProps} />
            </MenuDataProvider>
          </CommonCopyProvider>
        </ThemeProvider>
      </div>
    </>
  );
}

BhukkadApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  /** Site JSON is not fetched during SSR; `CommonCopyProvider` / `MenuDataProvider` load on the client. */
  const { common, menu } =
    typeof window === "undefined"
      ? { common: null as CommonCopy | null, menu: null as SiteMenuPayload | null }
      : await loadInitialSiteJson(appContext.ctx.req);
  return {
    ...appProps,
    pageProps: {
      ...appProps.pageProps,
      __initialCommon: common,
      __initialMenu: menu,
    },
  };
};

export default BhukkadApp;
