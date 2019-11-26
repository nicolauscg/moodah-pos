import React from "react";
import ReactDOM from "react-dom";
import CategoryIndex from "./index";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("./components/CategoryTable");

it("renders index without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Router>
      <CategoryIndex />
    </Router>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
