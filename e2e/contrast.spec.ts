import { test, expect } from "@playwright/test";
import { url } from "./helpers";

type Sample = {
  fg: [number, number, number, number];
  bg: [number, number, number, number];
  size: number;
  weight: number;
  text: string;
};

function relativeLuminance([r, g, b]: number[]) {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

/** Composite a possibly-translucent foreground over an opaque backdrop. */
function over(fg: number[], bg: number[]): number[] {
  const a = fg[3];
  return [0, 1, 2].map((i) => fg[i] * a + bg[i] * (1 - a));
}

test("body text meets WCAG AA", async ({ page }) => {
  await page.goto(url("/"));

  const samples: Sample[] = await page.$$eval(
    "h1, h2, h3, h4, p, li, a, dt, dd, span, th, td, figcaption",
    (nodes) => {
      // Resolve any CSS colour — including oklab() and color(srgb ...) — to
      // sRGB bytes by letting the canvas rasterise it. Regex-parsing the
      // computed string only works for legacy rgb() and silently produces
      // nonsense ratios for modern syntaxes.
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

      function toRgba(color: string): [number, number, number, number] {
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = "#000";
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
        const d = ctx.getImageData(0, 0, 1, 1).data;
        return [d[0], d[1], d[2], d[3] / 255];
      }

      const out: Sample[] = [];
      for (const n of Array.from(nodes).slice(0, 400)) {
        const s = getComputedStyle(n);
        if (s.display === "none" || s.visibility === "hidden" || s.opacity === "0") continue;

        // Only elements holding their own text, so a wrapper is not sampled
        // once for every descendant.
        const ownText = Array.from(n.childNodes)
          .filter((c) => c.nodeType === 3)
          .map((c) => c.textContent ?? "")
          .join("")
          .trim();
        if (!ownText) continue;

        // Walk up for the first opaque-enough backdrop.
        let el: Element | null = n;
        let bg: [number, number, number, number] = [255, 255, 255, 1];
        while (el) {
          const c = toRgba(getComputedStyle(el).backgroundColor);
          if (c[3] > 0.5) {
            bg = c;
            break;
          }
          el = el.parentElement;
        }

        out.push({
          fg: toRgba(s.color),
          bg,
          size: parseFloat(s.fontSize),
          weight: Number(s.fontWeight) || 400,
          text: ownText.slice(0, 45),
        });
      }
      return out;
    }
  );

  expect(samples.length, "no text sampled — selector or page is wrong").toBeGreaterThan(20);

  const failures: string[] = [];
  for (const s of samples) {
    const fg = over(s.fg, s.bg);
    const l1 = relativeLuminance(fg);
    const l2 = relativeLuminance(s.bg);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const isLarge = s.size >= 24 || (s.size >= 18.66 && s.weight >= 700);
    const required = isLarge ? 3 : 4.5;

    if (ratio < required) {
      failures.push(`"${s.text}" — ${ratio.toFixed(2)}:1 needs ${required}:1 (${s.size}px)`);
    }
  }

  expect(failures, `\n${failures.join("\n")}\n`).toHaveLength(0);
});
