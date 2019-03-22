import React from 'react';

export default ({ linked, provider, session }) => {
  if (linked === true) {
    return (
      <form method="post" action={`/auth/oauth/${provider.toLowerCase()}/unlink`}>
        <input name="_csrf" type="hidden" value={session.csrfToken} />
        <p>
          <button className="btn btn-block btn-outline-danger" type="submit">
            Unlink from {provider}
          </button>
        </p>
      </form>
    );
  }
  return (
    <p>
      <a
        className="btn btn-block btn-outline-primary"
        href={`/auth/oauth/${provider.toLowerCase()}`}
      >
        Link with {provider}
      </a>
    </p>
  );
};
