require('@babel/register')({
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }]
  ]
});

try {
  const App = require('./src/App').default;
  if (App) {
    console.log('App loaded without Syntax Errors.');
  }
} catch (err) {
  console.error('Failed to load:', err);
}
