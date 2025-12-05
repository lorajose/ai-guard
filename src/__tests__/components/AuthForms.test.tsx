import { render, screen, fireEvent } from "@testing-library/react";

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    signIn: jest.fn().mockResolvedValue({ success: true }),
    sendMagicLink: jest.fn().mockResolvedValue({ success: true }),
    signInWithGoogle: jest.fn(),
  }),
}));

import LoginPage from "@/app/login/page";

describe("Auth form", () => {
  it("renders login inputs", () => {
    render(<LoginPage />);
    expect(
      screen.getByPlaceholderText("you@email.com")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
  });

  it("submits login form", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Iniciar sesión"));
    expect(screen.getByText("Iniciar sesión")).toBeInTheDocument();
  });
});
