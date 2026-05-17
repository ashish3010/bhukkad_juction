import Head from "next/head";
import { OurStoryScreen } from "@/features/story/OurStoryScreen";
import { MainAppShell } from "@/features/layout/MainAppShell";
import { common } from "@/shared/data/common";

export default function OurStoryPage() {
  return (
    <MainAppShell>
      <Head>
        <title>{common.desktop.ourStoryPage.documentTitle}</title>
      </Head>
      <OurStoryScreen />
    </MainAppShell>
  );
}
