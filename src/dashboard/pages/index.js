import React, { Component } from 'react';
import Router from 'next/router';
import { NextAuth } from 'next-auth/client';

import { Button } from 'antd';
import Layout from '../layout';

export default class extends Component {
  static async getInitialProps({ req }) {
    return {
      session: await NextAuth.init({ req }),
      providers: await NextAuth.providers({ req })
    };
  }

  login = () => {
    const { providers } = this.props;
    if (providers && providers.intra42) Router.push(providers.intra42.signin);
  };

  renderLogin = () => {
    console.log('providers', this.props.providers);
    return (
      <Button onClick={this.login} type="primary" icon="key">
        Login with Intra42
      </Button>
    );
  };

  render() {
    const { session } = this.props;
    console.log('session', session);
    return <Layout>{session && session.user ? 'Already logged in!' : this.renderLogin()}</Layout>;
  }
}
