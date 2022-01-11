import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import styled from "styled-components";

import { BREAKPOINTS, GlobalStyles } from "src/theme";
import { usePageView } from "src/utils/ga";
import { Header } from "src/components/header";

import faviconPng from "src/assets/favicon.png";
import "src/assets/fonts/staatliches.css";
import { Footer } from "src/components/footer";

const Content = styled.div`
  width: 100%;
  padding: 0.8rem;
  max-width: 124rem;
  display: flex;
  flex-direction: column;
  margin: 0 auto;

  ${BREAKPOINTS.TABLET} {
    padding: 2rem;
  }

  main {
    width: 100%;
    padding: 3.2rem 3.2rem 6rem;
    background: #fff;
    position: relative;

    p img.emoji {
      height: 1.1em;
      width: auto;
      display: inline-block;
      margin: -0.1rem 0 0.2rem;
      vertical-align: middle;
    }
  }
`;

function MyApp({ Component, pageProps }: AppProps) {
  usePageView();

  return (
    <>
      <GlobalStyles />

      <Head>
        <title>Design Systems Diary</title>
        <meta
          name="description"
          content="Learning about how to build and improve design systems"
        />
        <link rel="icon" href={faviconPng.src} />
      </Head>

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
      <Content>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </Content>
    </>
  );
}

export default MyApp;
