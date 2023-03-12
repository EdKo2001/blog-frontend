import React from "react";
import { render, RenderResult } from "@testing-library/react";
import { createMemoryHistory, MemoryHistory } from "history";
import { BrowserRouter as Router } from "react-router-dom";

interface RenderWithRouterOptions {
  route?: string;
  history?: any;
}

const renderWithRouter = (
  ui: React.ReactElement,
  {
    route = "/",
    history = createMemoryHistory({ initialEntries: [route] }),
  }: RenderWithRouterOptions = {}
): RenderResult & { history: MemoryHistory } => {
  return {
    //@ts-ignore
    ...render(<Router history={history}>{ui}</Router>),
    history,
  };
};

export default renderWithRouter;
