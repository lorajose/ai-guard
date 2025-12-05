import { render, screen, fireEvent } from "@testing-library/react";
import Pricing from "@/components/Pricing";

describe("Pricing component", () => {
  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    window.open = jest.fn();
  });

  it("renders both plan options", () => {
    render(<Pricing />);
    expect(screen.getByText("Personal")).toBeInTheDocument();
    expect(screen.getByText("Business")).toBeInTheDocument();
  });

  it("switches to business plan on toggle", () => {
    render(<Pricing />);
    fireEvent.click(screen.getByText("Business"));
    expect(screen.getByText("IA Shield Pro")).toBeInTheDocument();
  });
});
