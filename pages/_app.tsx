import type { AppProps } from "next/app";
import Script from "next/script";

import { usePageView } from "src/utils/ga";

import "src/assets/fonts/staatliches.css";

function MyApp({ Component, pageProps }: AppProps) {
  usePageView();
  return (
    <>
      {/* Add Google Analytics */}
      {/* See https://nextjs.org/docs/messages/next-script-for-ga */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>

      {/* Main app */}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
