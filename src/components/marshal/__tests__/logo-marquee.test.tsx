import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LogoMarquee } from "@/components/marshal/logo-marquee";

const items = ["AWS", "Okta", "Datadog"];

describe("LogoMarquee", () => {
  it("exposes one accessible list of the systems", () => {
    render(<LogoMarquee items={items} />);
    expect(screen.getByRole("list", { name: /connected systems/i })).toBeInTheDocument();
  });

  it("duplicates the track for a seamless loop but hides the copy", () => {
    const { container } = render(<LogoMarquee items={items} />);
    const tracks = container.querySelectorAll("[data-marquee-track]");
    expect(tracks).toHaveLength(2);
    expect(tracks[1]).toHaveAttribute("aria-hidden", "true");
  });

  it("announces each system exactly once", () => {
    render(<LogoMarquee items={items} />);
    for (const name of items) {
      const visible = screen
        .getAllByText(name)
        .filter((n) => !n.closest('[aria-hidden="true"]'));
      expect(visible, `${name} announced ${visible.length} times`).toHaveLength(1);
    }
  });

  it("derives the duration from the item count so longer lists are not faster", () => {
    const { container } = render(<LogoMarquee items={items} speed={2} />);
    const el = container.querySelector("[data-marquee]") as HTMLElement;
    expect(el.style.getPropertyValue("--marquee-duration")).toBe("6.0s");
  });
});
