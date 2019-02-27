import React, { Component } from 'react';
import Router from 'next/router';
import moment from 'moment';
import { NextAuth } from 'next-auth/client';

import { Table, Button, Input, Icon } from 'antd';

import Layout from '../components/layout';
import Container from '../components/container';

export default class extends Component {
  static async getInitialProps({ req, query: { channel } }) {
    if (req) {
      const { models, slackWeb } = req;
      const params = channel
        ? {
            channelId: channel
          }
        : {
            channelId: { $regex: /^C/ }
          };
      const history = await models.MessageHistory.find(params)
        .sort({
          timeString: -1
        })
        .exec();
      const { channels } = await slackWeb.channels.list();
      const { members } = await slackWeb.users.list();

      return { history, channels, members, session: await NextAuth.init({ req }) };
    }
    return {};
  }

  state = {
    searchText: ''
  };

  componentDidMount() {
    const { session } = this.props;
    if (!session || !session.user) {
      Router.push('/.');
    }
  }

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

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
        key: 'text',
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={node => {
                this.searchInput = node;
              }}
              placeholder="Search text"
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Button
              type="primary"
              onClick={() => this.handleSearch(selectedKeys, confirm)}
              icon="search"
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              onClick={() => this.handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </div>
        ),
        filterIcon: filtered => (
          <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
          record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => this.searchInput.select());
          }
        }
      }
    ];

    return <Table dataSource={data} columns={columns} />;
  }

  render() {
    const { history, session } = this.props;

    if (session && session.user) {
      return (
        <Layout>
          <Container>
            <h1>MarvinJS Chat History</h1>
            <Button href="/" type="primary" style={{ marginBottom: '1rem' }}>
              Home
            </Button>
            {this.renderHistoryTable()}
          </Container>
        </Layout>
      );
    }

    return null;
  }
}
