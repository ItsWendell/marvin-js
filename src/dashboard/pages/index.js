import React, { Component } from 'react';
import Router from 'next/router';
import { NextAuth } from 'next-auth/client';

import { Button } from 'antd';
import Container from '../components/container';
import Layout from '../components/layout';

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

  renderGuest = () => {
    return (
      <Container center>
        <h1>Login to MarvinJS</h1>
        <Button onClick={this.login} type="primary" icon="unlock">
          Login with Intra42
        </Button>
      </Container>
    );
  };

  renderLogoutButton = () => {
    const { session } = this.props;
    return (
      <form
        method="post"
        action="auth/signout"
        style={{ display: 'inline-block', paddingRight: '1rem' }}
      >
        <input name="_csrf" type="hidden" value={session.csrfToken} />
        <p>
          <Button type="ghost" htmlType="submit">
            Logout
          </Button>
        </p>
      </form>
    );
  };

  renderUser = () => {
    const { session } = this.props;
    return (
      <Container center>
        <h2>Logged in as {session.user.email}</h2>
        <p>We are working on improving this dashboard, more is coming soon!</p>
        <div>
          {this.renderLogoutButton()}
          <Button href="/history" type="primary">
            Slack History
          </Button>
        </div>
      </Container>
    );
  };

  render() {
    const { session } = this.props;
    return <Layout>{session && session.user ? this.renderUser() : this.renderGuest()}</Layout>;
  }
}
