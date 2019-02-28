import React from 'react';
import Router from 'next/router';
import { NextAuth } from 'next-auth/client';
import { Spin } from 'antd';
import Container from '../../components/container';
import Layout from '../../components/layout';

export default class extends React.Component {
  static async getInitialProps({ req }) {
    return {
      session: await NextAuth.init({ force: true, req })
    };
  }

  componentDidMount() {
    NextAuth.init({ force: true }).then(() => {
      Router.push('/.');
    });
  }

  render() {
    // Provide a link for clients without JavaScript as a fallback.
    return (
      <React.Fragment>
        <Layout>
          <Container center>
            <Spin size="large" />
          </Container>
        </Layout>
      </React.Fragment>
    );
  }
}
