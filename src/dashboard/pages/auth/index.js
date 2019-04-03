import React from 'react';
import Router from 'next/router';
import Link from 'next/link';
import { NextAuth } from 'next-auth/client';

import LinkAccount from '../../components/link-account';
import { Container, Layout } from '../../components';

export default class extends React.Component {
  static async getInitialProps({ req }) {
    const data = {
      session: await NextAuth.init({ req }),
      linkedAccounts: await NextAuth.linked({ req }),
      providers: await NextAuth.providers({ req })
    };
    return {
      ...data
    };
  }

  renderProviders() {
    const { linkedAccounts, session } = this.props;
    return Object.keys(linkedAccounts).map((provider, id) => {
      return (
        <LinkAccount
          css="display: inline;"
          key={`${provider}`}
          provider={provider}
          session={session}
          linked={linkedAccounts[provider]}
        />
      );
    });
  }

  render() {
    const { session } = this.props;
    if (session) {
      return (
        <Layout>
          <Container center>
            <h1>Account Details</h1>
            <p>
              You are signed in as <span className="font-weight-bold">{session.user.email}</span>.
            </p>
            <div>{this.renderProviders()}</div>
            <p css="padding-top: 1rem;">
              <Link href="/">Home</Link>
            </p>
          </Container>
        </Layout>
      );
    }
    Router.push('/.');
    return null;
  }
}
