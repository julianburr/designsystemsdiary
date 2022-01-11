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

  *:focus {
    outline: .2rem solid rgba(0,0,0,.4);
  }

  html {
    font-size: 62.5%;
  }

  body {
    margin: 0;
    padding: 0;
    font-size: 1.5rem;
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

  h1 {
    font-size: 3.2em;
  }

  h2 {
    font-size: 2em;
  }

  h3 {
    font-size: 1.4em
  }

  h4 {
    font-size: 1em;
  }

  button {
    cursor: pointer;
  }

  input, textarea, button, select {
    font: inherit;
  }

  a {
    color: #c87462;
    text-decoration: none;
    font-weight: bold;
  }

  a:hover {
    text-decoration: underline;
  }
`;
