import React from 'react';
import Head from 'next/head';
import { Layout } from 'antd';

import './styles/index.less';

export default ({ children }) => (
  <div>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <link rel="stylesheet" href="/_next/static/style.css" />
      <link href="https://fonts.googleapis.com/css?family=Noto+Sans" rel="stylesheet" />
    </Head>
    <Layout>
      <style jsx global>
        {`
          body {
          }
        `}
      </style>
      {children}
    </Layout>
  </div>
);
