import React from 'react';
import { Button } from 'antd';

export default ({ linked, provider, session }) => {
  if (linked === true) {
    return (
      <form
        css="display: inline; padding: 0 0.5rem;"
        method="post"
        action={`/auth/oauth/${provider.toLowerCase()}/unlink`}
      >
        <input name="_csrf" type="hidden" value={session.csrfToken} />
        <Button className="btn btn-block btn-outline-danger" htmlType="submit">
          Unlink from&nbsp;{provider}
        </Button>
      </form>
    );
  }
  return (
    <Button
      className="btn btn-block btn-outline-primary"
      href={`/auth/oauth/${provider.toLowerCase()}`}
      type="primary"
    >
      Link with&nbsp;{provider}
    </Button>
  );
};
