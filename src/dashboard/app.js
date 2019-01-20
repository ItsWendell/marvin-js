import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({
    dir: dev ? './src/dashboard' : './build/dashboard', 
    dev, 
    quiet: true,
});

export default app;