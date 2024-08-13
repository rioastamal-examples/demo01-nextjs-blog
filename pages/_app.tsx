import "nextra-theme-blog/style.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/main.css";

import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'; // default theme
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs, {ssr: true});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS"
          href="/feed.xml"
        />
        <link
          rel="preload"
          href="/fonts/Inter-roman.latin.var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </Head>
      <Authenticator.Provider>
        <Component {...pageProps} />
      </Authenticator.Provider>
      {/* <Component {...pageProps} /> */}
    </>
  );
}
