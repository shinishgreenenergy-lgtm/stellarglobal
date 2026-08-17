import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroDashboard } from "@/components/marshal/hero-dashboard";
import { heroRun } from "@/lib/marshal-content";

describe("HeroDashboard", () => {
  it("names the automation that ran", () => {
    render(<HeroDashboard />);
    expect(screen.getAllByText(heroRun.automation).length).toBeGreaterThan(0);
  });

  it("lists every framework the run cleared", () => {
    render(<HeroDashboard />);
    for (const clause of heroRun.cleared) {
      expect(screen.getByText(clause.framework)).toBeInTheDocument();
      expect(screen.getByText(clause.reference)).toBeInTheDocument();
    }
  });

  it("describes itself for screen readers", () => {
    render(<HeroDashboard />);
    expect(screen.getByRole("figure")).toHaveAccessibleName(/cleared/i);
  });

  it("staggers each clause row by its index", () => {
    const { container } = render(<HeroDashboard />);
    const rows = container.querySelectorAll("[data-clause-row]");
    expect(rows).toHaveLength(heroRun.cleared.length);
    expect((rows[1] as HTMLElement).style.animationDelay).toBe("90ms");
  });
});
