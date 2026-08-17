/**
 * Renders a JSON-LD block.
 *
 * The payload is built by src/lib/structured-data.ts from our own constants —
 * never from user input — so JSON.stringify is safe here. If that ever changes,
 * escape `<` to `<` before injecting.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
