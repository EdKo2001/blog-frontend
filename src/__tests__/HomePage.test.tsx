import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { render, screen } from "@testing-library/react";

import axios from "utils/axios";

import Post from "../components/Post";

describe("Displaying the latest post", () => {
  let post: any;

  it("Getting the latest post", async () => {
    post = await axios.get("/posts").then((res: any) => res.data.results[0]);

    expect(typeof post._id).toBe("string");
  });

  it("Rendering the latest post", () => {
    render(
      <Router basename="/">
        <Post {...post} />
      </Router>
    );
    expect(screen.getByText(post.title).textContent).toBe(
      "Python Iterate Over Dictionary – How to Loop Through a Dict"
    );
  });
});
