import { CSSReset, Heading, ThemeProvider, Switch } from "@chakra-ui/core";
import * as React from "react";
import { render } from "react-dom";
import App from "./App";
import { ControlsProvider } from "./controls";
import "./styles.css";

const rootElement = document.getElementById("root");
render(
  <ThemeProvider>
    <CSSReset />
    <ControlsProvider>
      <App />
    </ControlsProvider>
  </ThemeProvider>,
  rootElement
);
