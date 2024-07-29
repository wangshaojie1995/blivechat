// 不能用localhost，https://forum.dfinity.org/t/development-workflow-quickly-test-code-modifications/1793/21
const API_BASE_URL = 'http://127.0.0.1:12450'

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: API_BASE_URL,
        ws: true
      },
      '/emoticons': {
        target: API_BASE_URL
      },
      '/custom_public': {
        target: API_BASE_URL
      },
    }
  },
  chainWebpack: config => {
    const APP_VERSION = `v${process.env.npm_package_version}`

    config.plugin('define')
      .tap(args => {
        let defineMap = args[0]
        let env = defineMap['process.env']
        env['APP_VERSION'] = JSON.stringify(APP_VERSION)
        return args
      })

    // config.externals({
    //   'element-ui': 'ELEMENT',
    //   lodash: '_',
    //   pako: 'pako',
    //   vue: 'Vue',
    //   'vue-router': 'VueRouter',
    //   'vue-i18n': 'VueI18n',
    // })
  }
}
