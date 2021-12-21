import type { AppProps } from "next/app";

import "../src/assets/fonts/staatliches.css";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
