import type { AppProps } from "next/app";

import { usePageView } from "src/utils/ga";

import "src/assets/fonts/staatliches.css";

function MyApp({ Component, pageProps }: AppProps) {
  usePageView();
  return <Component {...pageProps} />;
}

export default MyApp;
