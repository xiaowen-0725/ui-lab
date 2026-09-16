import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Playground } from "@/components/app/playground/playground";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "Playground",
  description:
    "Tweak spring, tween and stagger properties, watch them play, and copy the motion code. Built on UI Lab's motion tokens.",
};

export default async function PlaygroundPage() {
  const t = await getTranslations("labPresentationPrototype");

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-6">
        <Link
          href="/playground/lab-presentation"
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          {t("playgroundGate")}
        </Link>
      </div>
      <Playground />
    </>
  );
}
