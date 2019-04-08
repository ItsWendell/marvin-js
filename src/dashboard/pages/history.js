import React, { Component } from 'react';
import Router from 'next/router';
import { NextAuth } from 'next-auth/client';

import { Button, Row, Col, Card } from 'antd';

import Layout from '../components/layout';
import Container from '../components/container';
import SlackHistoryTable from '../components/slack-history-table';

export default class extends Component {
  static async getInitialProps({ req, query, query: { channel } }) {
    if (req) {
      const { models, slackWeb } = req;
      const session = await NextAuth.init({ req });
      const user =
        session && session.user && session.user.id && (await models.User.findById(session.user.id));

      if (!(user && user.slack && user.slackClient())) {
        return {
          session
        };
      }

      const { members } = await slackWeb.users.list();

      let { channels: userChannels } =
        user.slackClient() &&
        (await user.slackClient().conversations.list({
          types: 'public_channel,private_channel'
        }));

      userChannels = userChannels.filter(item => !!item.is_member);

      /** @type WebClient */
      const params = channel
        ? {
            channelId: userChannels.map(item => item.id).includes(channel) ? channel : null
          }
        : {
            channelId: {
              $in: userChannels.map(item => item.id)
            }
          };
      const history = await models.MessageHistory.find({
        ...params,
        text: {
          $ne: null
        },
        $or: [
          {
            text: {
              $ne: ''
            }
          }
        ]
      })
        .sort({
          timeString: -1
        })
        .exec();
      return {
        query,
        history,
        members,
        session,
        userChannels,
        userSlackIdentity: user.slackClient() && (await user.slackClient().users.identity()),
        botSlackTeam: await slackWeb.team.info(),
        linkedAccounts: await NextAuth.linked({ req })
      };
    }
    return {};
  }

  componentDidMount() {
    const { session } = this.props;
    if (!session || !session.user) {
      Router.push('/.');
    }
  }

  handleSearch = (selectedKeys, confirm) => {
    confirm();
  };

  handleReset = clearFilters => {
    clearFilters();
  };

  renderChannels = () => {
    const { userChannels } = this.props;
    return (
      <Row gutter={16} style={{ paddingBottom: '2rem' }}>
        {userChannels &&
          userChannels.map(channel => {
            return (
              <Col css="margin: 0.5rem 0;" span={8}>
                <Card
                  extra={<a href={`/history?channel=${channel.id}`}>History</a>}
                  title={channel.name}
                  bordered={false}
                  style={{ height: '9rem' }}
                >
                  {channel.topic && channel.topic.value}
                </Card>
              </Col>
            );
          })}
      </Row>
    );
  };

  hasSlackAccess = () => {
    const { botSlackTeam, userSlackIdentity } = this.props;
    if (!(botSlackTeam && botSlackTeam.team && userSlackIdentity && userSlackIdentity.team)) {
      return false;
    }
    return botSlackTeam.team.id === userSlackIdentity.team.id;
  };

  renderGuest = () => {
    return (
      <div>
        <h2>Whoops, you are not in the right team or not logged-in to slack.</h2>
        <a href="/auth/oauth/slack">
          <img
            alt="Sign in with Slack"
            height="40"
            width="172"
            src="https://platform.slack-edge.com/img/sign_in_with_slack.png"
            srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x"
          />
        </a>
      </div>
    );
  };

  renderLoggedIn = () => {
    const { query, history, userChannels, members } = this.props;

    if (query && query.channel && userChannels.map(item => item.id).includes(query.channel)) {
      return <SlackHistoryTable history={history} channels={userChannels} members={members} />;
    }
    if (query && query.channel) {
      return (
        <div>
          <h2>You do not have access to this channel!</h2>
        </div>
      );
    }
    return this.renderChannels();
  };

  render() {
    const { session, query } = this.props;
    if (session && session.user) {
      return (
        <Layout>
          <Container>
            <h1>MarvinJS Chat History</h1>
            <Button href="/" type="ghost" style={{ marginBottom: '1rem', marginRight: '1rem' }}>
              Home
            </Button>

            {query && query.channel && (
              <Button href="/history" type="primary" style={{ marginBottom: '1rem' }}>
                Overview
              </Button>
            )}

            {this.hasSlackAccess() ? this.renderLoggedIn() : this.renderGuest()}
          </Container>
        </Layout>
      );
    }

    return null;
  }
}
