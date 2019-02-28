import React from 'react';
import Router from 'next/router';
import Link from 'next/link';
import { NextAuth } from 'next-auth/client';

export default class extends React.Component {
  static async getInitialProps({ req }) {
    return {
      session: await NextAuth.init({ req }),
      linkedAccounts: await NextAuth.linked({ req }),
      providers: await NextAuth.providers({ req })
    };
  }

  render() {
    const { session } = this.props;
    if (session) {
      return (
        <div className="container">
          <div className="text-center">
            <h1 className="display-4 mt-3">NextAuth Example</h1>
            <p className="lead mt-3 mb-1">
              You are signed in as <span className="font-weight-bold">{session.user.email}</span>.
            </p>
          </div>
          <p className="text-center">
            <Link href="/">Home</Link>
          </p>
        </div>
      );
    }
    Router.push('/.');
    return null;
  }
}
