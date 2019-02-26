import React, { Component } from 'react';
import { NextAuth } from 'next-auth/client';

import Layout from '../layout';

export default class extends Component {
  static async getInitialProps({ req }) {
    return {
      session: await NextAuth.init({ req })
    };
  }

  renderSession() {
    const { session } = this.props;

    if (session.user) {
      return <h1>Logged In as {session.user.email}!</h1>;
    }

    return <h1>Please login first!</h1>;
  }

  render() {
    const { factoids } = this.props;
    return this.renderSession();
  }
}
