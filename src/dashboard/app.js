import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({
  dir: './src/dashboard',
  dev,
  quiet: true
});

export default app;
