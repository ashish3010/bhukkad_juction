import Head from "next/head";
import { OurStoryScreen } from "@/features/story/OurStoryScreen";
import { MainAppShell } from "@/features/layout/MainAppShell";
import { useCommon } from "@/shared/data/common-copy-provider";

export default function OurStoryPage() {
  const common = useCommon();
  return (
    <MainAppShell>
      <Head>
        <title>{common.desktop.ourStoryPage.documentTitle}</title>
      </Head>
      <OurStoryScreen />
    </MainAppShell>
  );
}
