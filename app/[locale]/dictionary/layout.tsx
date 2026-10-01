import { DictionaryNav } from "@/components/app/catalog/dictionary-nav";
import { SiteFooter } from "@/components/app/chrome/site-footer";

export default function DictionaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 md:pt-28">
        <div className="md:grid md:grid-cols-[11rem_minmax(0,1fr)] md:gap-12">
          <DictionaryNav />
          <div className="min-w-0">{children}</div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
