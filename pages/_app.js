import "nextra-theme-blog/style.css";
import Head from "next/head";
import "../styles/main.css";

import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'; // default theme
import outputs from "../amplify_outputs.json";
import { PageMenu, defaultMenuData } from "../components/menu";

Amplify.configure(outputs, {ssr: true});

export default function App({ Component, pageProps }) {
  console.log('pageProps =>', pageProps);
  let currentPage = '/';
  let defaultMenu = defaultMenuData;

  if (pageProps.hasOwnProperty('menus')) {
    defaultMenu = pageProps.menus;
  }

  if (pageProps.hasOwnProperty('currentPage')) {
    currentPage = pageProps.currentPage;
  }

  return (
    <Authenticator.Provider>
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
        <article className="nx-container nx-prose max-md:nx-prose-sm dark:nx-prose-dark" dir="ltr">
          <div className="nx-mb-8 nx-flex nx-items-center nx-gap-3">
            <PageMenu menus={ defaultMenu } currentPage={ currentPage }/>
          </div>
        
          <Component {...pageProps} />
        
          <footer>
            <small><time>2024</time> &copy; Rio Astamal - <a href="/feed.xml">RSS</a></small>
          </footer>
        </article>
    </Authenticator.Provider>
  );
}
