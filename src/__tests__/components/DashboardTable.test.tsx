import { render, screen } from "@testing-library/react";
import {
  DashboardLabelBadge,
  DashboardScoreBar,
} from "@/app/dashboard/page";

describe("Dashboard table components", () => {
  it("renders label badge with correct text", () => {
    render(<DashboardLabelBadge label="ESTAFA" />);
    expect(screen.getByText("ESTAFA")).toBeInTheDocument();
  });

  it("renders score bar value", () => {
    render(<DashboardScoreBar score={80} label="ESTAFA" />);
    expect(screen.getByText("80/100")).toBeInTheDocument();
  });
});
