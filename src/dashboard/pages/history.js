import React, { Component } from 'react';
import moment from 'moment';

import { Table } from 'antd';

import Layout from '../layout';

export default class extends Component {
  static async getInitialProps({ req, query: { channel } }) {
    if (req) {
      const { models } = req;
      const params = channel ? { channelId: channel } : {};
      const history = await models.MessageHistory.find(params).exec();
      console.log(history);
      return { history };
    }
  }

  renderHistoryTable() {
    const { history } = this.props;

    const data = history.map((item) => ({
      key: item._id,
      ...item
    }));

    const columns = [{
      title: 'Time',
      dataIndex: 'timeString',
      key: 'timeString',
      render: (text, record, index) => (
        <p>{moment.unix(record.timeString).toLocaleString()}</p>
      )
    }, {
      title: 'User',
      dataIndex: 'userId',
      key: 'userId',
    }, {
      title: 'Message',
      dataIndex: 'text',
      key: 'text',
    }];

    return (
      <Table dataSource={data} columns={columns} />
    )
  }

  render() {
    const { history } = this.props;
    return (
      <Layout>
        <h1>Messages: #{history.length} :D</h1>
        {this.renderHistoryTable()}
      </Layout>
    )
  }
}
