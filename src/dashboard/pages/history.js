import React, { Component } from 'react';
import moment from 'moment';

import { Table } from 'antd';

import Layout from '../layout';
import Container from '../atoms/container';

export default class extends Component {
  static async getInitialProps({ req, query: { channel } }) {
    if (req) {
      const { models, slackWeb } = req;
      const params = channel
        ? {
            channelId: channel
          }
        : {};
      const history = await models.MessageHistory.find(params)
        .sort({
          timeString: -1
        })
        .exec();
      const { channels } = await slackWeb.channels.list();
      const { members } = await slackWeb.users.list();
      return { history, channels, members };
    }
    return {};
  }

  renderHistoryTable() {
    const { history, channels, members } = this.props;

    const data = history.map(item => ({
      key: item._id,
      ...item
    }));

    const columns = [
      {
        title: 'Channel',
        dataIndex: 'channelId',
        key: 'channelId',
        render: (text, record, index) => {
          const channel = channels.find(item => item.id === record.channelId);
          if (channel) {
            return channel.name;
          }
          return text;
        },
        filters:
          data &&
          [...new Set(data.map(item => item.channelId))].map(channelId => {
            const channel = channels.find(item => item.id === channelId);
            return {
              text: (channel && channel.name) || channelId,
              value: channelId || ''
            };
          }),
        onFilter: (value, item) => item.channelId === value
      },
      {
        title: 'Time',
        dataIndex: 'timeString',
        key: 'timeString',
        render: (text, record, index) => <p>{moment.unix(record.timeString).toLocaleString()}</p>,
        sorter: (a, b) => a.timeString.localeCompare(b.timeString)
      },
      {
        title: 'User',
        dataIndex: 'userId',
        key: 'userId',
        render: (text, record, index) => {
          const member = members.find(item => item.id === record.userId);
          if (member) {
            return member.name;
          }
          return text;
        },
        filters:
          data &&
          [...new Set(data.map(item => item.userId))].map(userId => {
            const member = members.find(item => item.id === userId);
            return {
              text: (member && member.name) || userId,
              value: userId || ''
            };
          }),
        onFilter: (value, item) => item.userId === value
      },
      {
        title: 'Message',
        dataIndex: 'text',
        key: 'text'
      }
    ];

    return <Table dataSource={data} columns={columns} />;
  }

  render() {
    const { history } = this.props;
    return (
      <Layout>
        <Container>
          <h1>MarvinJS Chat History</h1>
          {this.renderHistoryTable()}
        </Container>
      </Layout>
    );
  }
}
