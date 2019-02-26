import React, { Component } from 'react';
import { Button } from 'antd';
import Layout from '../layout';

export default class extends Component {
  static async getInitialProps({ req }) {
    if (req) {
      const { models } = req;
      const factoids = await models.Factoid.find({}).exec();
      return { factoids };
    }
    return {};
  }

  login = () => {
    // TODO: Oauth2 login
  };

  render() {
    const { factoids } = this.props;
    return (
      <Layout>
        <h2>Login with intra42</h2>
        <Button icon="key" onClick={this.login} type="primary">
          Login
        </Button>
      </Layout>
    );
  }
}
