export default {
  testEnvironment: 'node',
  transform: {}, // Disable transpilation (pure modern JS)
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
  testTimeout: 10000
};
