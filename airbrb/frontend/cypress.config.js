const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    testIsolation: false,
  },
  component: {
    // Component test specific configuration
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
    indexHtmlFile: 'cypress/support/component-index.html'
  },
})
