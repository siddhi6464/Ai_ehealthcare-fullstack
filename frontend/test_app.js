require('@babel/register')({
  presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]],
  plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-transform-modules-commonjs']
});

try {
  const App = require('./src/App.js');
  console.log("App loaded successfully. If we are here, there is no top-level undefined import causing immediate crash.");
} catch (err) {
  console.error("Error loading App.js:", err);
}
