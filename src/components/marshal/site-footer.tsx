import { BRAND } from "@/lib/brand";
import { StellarGlobalWordmark } from "@/components/marshal/brand-logo";

export function SiteFooter() {
  return (
    <footer className="border-marshal-divider text-marshal-text/70 flex flex-wrap items-center justify-between gap-5 border-t py-7 pb-12 text-[12.5px]">
      <span className="flex flex-wrap items-center gap-2.5">
        {BRAND.product} is a product of
        <StellarGlobalWordmark />
      </span>
      <span>Riyadh · Dammam · Dubai</span>
    </footer>
  );
}
