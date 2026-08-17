import { BRAND } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="border-marshal-divider text-marshal-text/55 flex flex-wrap justify-between gap-5 border-t py-7 pb-12 text-[12.5px]">
      <span>
        {BRAND.product} is a product of {BRAND.company}.
      </span>
      <span>Riyadh · Dammam · Dubai</span>
    </footer>
  );
}
