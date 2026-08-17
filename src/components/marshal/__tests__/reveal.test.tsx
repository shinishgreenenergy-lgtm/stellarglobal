import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Reveal } from "@/components/marshal/reveal";

describe("Reveal", () => {
  it("always renders its children, so content survives without JS", () => {
    render(<Reveal>visible content</Reveal>);
    expect(screen.getByText("visible content")).toBeInTheDocument();
  });

  it("marks itself revealed once observed", () => {
    // The IntersectionObserver mock in vitest.setup.ts fires immediately.
    const { container } = render(<Reveal>x</Reveal>);
    expect(container.firstElementChild).toHaveAttribute("data-revealed", "true");
  });

  it("applies the requested delay", () => {
    const { container } = render(<Reveal delay={120}>x</Reveal>);
    expect((container.firstElementChild as HTMLElement).style.transitionDelay).toBe("120ms");
  });

  it("renders the requested element type", () => {
    const { container } = render(<Reveal as="section">x</Reveal>);
    expect(container.firstElementChild?.tagName).toBe("SECTION");
  });

  it("keeps any className passed alongside its own", () => {
    const { container } = render(<Reveal className="mt-4">x</Reveal>);
    expect(container.firstElementChild).toHaveClass("marshal-reveal");
    expect(container.firstElementChild).toHaveClass("mt-4");
  });
});
