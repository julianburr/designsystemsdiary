import { createGlobalStyle } from "styled-components";

export const BREAKPOINTS = {
  TABLET: "@media (min-width: 750px)",
  DESKTOP: "@media (min-width: 1240px)",
  CUSTOM: (minWidth: string | number) => `@media (min-width: ${minWidth})`,
};

export const GlobalStyles = createGlobalStyle`
  *, *:before, *:after {
    box-sizing: border-box;
  }

  html {
    font-size: 62.5%;
  }

  body {
    margin: 0;
    padding: 0;
    font-size: 1.6rem;
    line-height: 1.4;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    font-weight: 400;
    background: #f9f8f1;
    color: #222;
  }

  h1, h2, h3 {
    font-family: Staatliches;
    margin: 0;
    padding: 0;
  }

  button {
    cursor: pointer;
  }

  input, textarea, button, select {
    font: inherit;
  }
`;
