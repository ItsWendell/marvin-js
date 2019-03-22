import React from 'react';
import Router from 'next/router';
import Link from 'next/link';
import { NextAuth } from 'next-auth/client';

import LinkAccount from '../../components/link-account';

export default class extends React.Component {
  static async getInitialProps({ req }) {
    const data = {
      session: await NextAuth.init({ req }),
      linkedAccounts: await NextAuth.linked({ req }),
      providers: await NextAuth.providers({ req })
    };
    const user = await req.models.User.find({
      _id: data.session.user.id
    });
    console.log('USER', user);
    return {
      ...data
    };
  }

  renderProviders() {
    const { linkedAccounts, session } = this.props;
    console.log('linked', linkedAccounts, session);
    return (
      <div className="card mt-3 mb-3">
        <h4 className="card-header">Link Accounts</h4>
        <div className="card-body pb-0">
          {Object.keys(linkedAccounts).map((provider, id) => {
            return (
              <LinkAccount
                key={`${provider}`}
                provider={provider}
                session={session}
                linked={linkedAccounts[provider]}
              />
            );
          })}
        </div>
      </div>
    );
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
          {this.renderProviders()}
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
