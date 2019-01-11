import React, { Component } from 'react';

import Layout from '../layout';

export default class extends Component {
  static async getInitialProps ({ req }) {
    if (req) {
      const { models } = req;
      const factoids = await models.Factoid.find({}).exec();        
      console.log(factoids);
      return { factoids }
    }
  }

  render () {
    return (
      <Layout>
        <h1>Factoids: #{ this.props.factoids.length } :D</h1>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </Layout>
    )
  }
}
