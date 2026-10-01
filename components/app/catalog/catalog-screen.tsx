import {
  CatalogDoor,
  type CatalogGroup,
} from "@/components/app/catalog/catalog-door";
import { SiteFooter } from "@/components/app/chrome/site-footer";

export function CatalogScreen({
  eyebrow,
  title,
  intro,
  groups,
  alsoCalled,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  groups: readonly CatalogGroup[];
  alsoCalled: string;
}) {
  return (
    <div className="relative">
      <section className="mx-auto max-w-7xl px-4 pb-24 pt-24 md:pt-28">
        <CatalogDoor
          eyebrow={eyebrow}
          title={title}
          intro={intro}
          groups={groups}
          alsoCalled={alsoCalled}
        />
      </section>
      <SiteFooter />
    </div>
  );
}
