import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";

describe("App", () => {
  test("with empty parameters", () => {
    render(<App />);

    expect(screen.getAllByText("Equities Lab")[0]).toBeInTheDocument();
    expect(screen.getByText("Set User (Debug):")).toBeInTheDocument();
    expect(screen.getByText("Frank")).toBeInTheDocument();
    expect(
      screen.queryByText("View Positions", { selector: "button" }) // (1)
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Company")).toBeNull();

    expect(
      screen.getByText(
        "Sorry! You need to supply your username and security token"
      )
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Welcome, Frank Student")
    ).not.toBeInTheDocument();
  });

  test("debugging to Frank", async () => {
    render(<App />);

    userEvent.click(screen.getByText("Frank"));
    expect(
      // This makes it wait, so DOM will be updated
      await screen.findByText("Welcome, Frank Student") // (2)
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Welcome, Frank Student")
    ).toBeInTheDocument();
    expect(screen.queryByText("Sorry!")).not.toBeInTheDocument();
    expect(screen.getByText("View Positions")).toBeInTheDocument();
    expect(screen.getByText("View Orders")).toBeInTheDocument();
  });

  test("visiting positions", async () => {
    render(<App />);
    expect(
      screen.queryByText("View Positions", { selector: "button" })
    ).not.toBeInTheDocument();

    userEvent.click(screen.getByText("Frank"));
    // First update
    userEvent.click(await screen.findByText("View Positions"));
    // Second update
    expect(await screen.findByText("Buy/Short")).toBeInTheDocument();
  });
});

/*
  (1) 
  Original: screen.queryByText("View Positions", { selector: "button" })
  Alternate: screen.getByRole("button", {name: "View Positions"})

  (2) 
  original:
    expect(
      await screen.findByText("Welcome, Frank Student")
    ).toBeInTheDocument();
  Alternate:
    await waitFor(() => {
      expect(screen.getByText("Welcome, Frank Student")).toBeInTheDocument();
    });
*/
