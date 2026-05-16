import Link from "next/link";
import { Button } from "@/shared/components/ui/Button";
import { IconArrowRight } from "@/shared/components/icons";
import { common } from "@/shared/data/common";

export function GetStartedButton() {
  return (
    <Link href="/home" className="block w-full px-6">
      <Button className="w-full py-3 text-sm">
        {common.landing.getStarted}
        <IconArrowRight className="h-4 w-4" />
      </Button>
    </Link>
  );
}
