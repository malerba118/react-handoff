import { CSSReset, Heading, ThemeProvider } from "@chakra-ui/core";
import * as React from "react";
import { render } from "react-dom";
import "./styles.css";

function App() {
  return <Heading>Test</Heading>;
}

const rootElement = document.getElementById("root");
render(
  <ThemeProvider>
    <CSSReset />
    <App />
  </ThemeProvider>,
  rootElement
);
