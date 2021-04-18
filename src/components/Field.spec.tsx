import React from "react";
import Field from "./Field";
import { render } from "@testing-library/react";

import { mockSdk } from "../../test/mocks/mockSdk";

describe("Field component", () => {
  it("Component text exists", () => {
    const { getByText } = render(<Field sdk={mockSdk} />);

    expect(getByText("Hello Entry Field Component")).toBeInTheDocument();
  });
});
