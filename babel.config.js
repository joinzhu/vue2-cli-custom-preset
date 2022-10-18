module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3
      }
    ],
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: false,
        helpers: true,
        regenerator: false
      }
    ],
    // 管道函数
    [
      '@babel/plugin-proposal-pipeline-operator',
      {
        proposal: 'hack',
        topicToken: '%'
      }
    ]
  ]
}