/**
 * Returns the current exposed app url.
 *
 * @param {string} path
 * @returns {URL}
 */
export function getAppUrl(path = '/') {
  const url =
    process.env.APP_URL || `http://localhost${process.env.PORT ? `:${process.env.PORT}` : ''}`;
  return new URL(path, url).href;
}
