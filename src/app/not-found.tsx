import Link from "next/link";
import { PageShell } from "@/components/marshal/page-shell";

const destinations = [
  { href: "/", label: "Home" },
  { href: "/security", label: "Security and trust" },
  { href: "/frameworks/nca-ecc", label: "NCA ECC compliance automation" },
  { href: "/privacy", label: "Privacy policy" },
];

export default function NotFound() {
  return (
    <PageShell
      title="Page not found"
      kicker="404"
      intro="That page has moved or never existed. These cover most of what people come here for."
      crumbs={[{ name: "Not found", path: "/404" }]}
    >
      <ul className="flex list-none flex-col gap-2 py-10 pl-0">
        {destinations.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-marshal-accent-300 underline">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
