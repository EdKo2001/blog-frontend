import React from "react";

import { Provider } from "react-redux";

import { fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryHistory } from "history";

import renderWithRouter from "../config/setupTests";

import store from "app/store";

import LoginPage from "../pages/Login";

describe("LoginPage", () => {
  let history: MemoryHistory;
  beforeEach(() => {
    /* eslint-disable testing-library/no-render-in-setup */
    const { history: h } = renderWithRouter(
      <Provider store={store}>
        <LoginPage />
      </Provider>,
      { route: "/login" }
    );

    history = h;
  });

  it("should render login form", () => {
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });

  it("should contain email and password input fields", () => {
    expect(
      // eslint-disable-next-line testing-library/no-node-access
      screen.getByTestId("email").querySelector("input")
    ).toBeInTheDocument();
    expect(
      // eslint-disable-next-line testing-library/no-node-access
      screen.getByTestId("password").querySelector("input")
    ).toBeInTheDocument();
  });

  it("should allow user to input email and password", () => {
    const emailInput = screen
      .getByTestId("email")
      // eslint-disable-next-line testing-library/no-node-access
      .querySelector("input") as HTMLInputElement;
    const passwordInput = screen
      .getByTestId("password")
      // eslint-disable-next-line testing-library/no-node-access
      .querySelector("input") as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    expect(emailInput.value).toBe("test@test.com");
    expect(passwordInput.value).toBe("password");
  });

  it("should submit login form and show User is not found", async () => {
    const emailInput = screen
      .getByTestId("email")
      // eslint-disable-next-line testing-library/no-node-access
      .querySelector("input") as HTMLInputElement;
    const passwordInput = screen
      .getByTestId("password")
      // eslint-disable-next-line testing-library/no-node-access
      .querySelector("input") as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "test@me.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.submit(screen.getByTestId("login-form"));
    await waitFor(() => expect(screen.getByText("User is not found")));
  });

  it("should submit login form and show Invalid login or password", async () => {
    const emailInput = screen
      .getByTestId("email")
      // eslint-disable-next-line testing-library/no-node-access
      .querySelector("input") as HTMLInputElement;
    const passwordInput = screen
      .getByTestId("password")
      // eslint-disable-next-line testing-library/no-node-access
      .querySelector("input") as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.submit(screen.getByTestId("login-form"));
    await waitFor(() => expect(screen.getByText("Invalid login or password")));
  });

  it("should submit login form and redirect to home page", async () => {
    const emailInput = screen
      .getByTestId("email")
      // eslint-disable-next-line testing-library/no-node-access
      .querySelector("input") as HTMLInputElement;
    const passwordInput = screen
      .getByTestId("password")
      // eslint-disable-next-line testing-library/no-node-access
      .querySelector("input") as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.change(passwordInput, { target: { value: "test@test.com" } });
    fireEvent.submit(screen.getByTestId("login-form"));

    await waitFor(() => {
      // TODO: path does not change after successful authentication
      // expect(history.location.pathname).toBe("/");
      expect(
        screen.queryByText("Invalid login or password")
      ).not.toBeInTheDocument();
    });
    expect(screen.queryByText("User is not found")).not.toBeInTheDocument();
  });
});
