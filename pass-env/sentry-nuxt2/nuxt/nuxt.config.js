export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'app',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/sentry.plugin.ts',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/sentry'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  server: {
    port: 3000,
    host: '0.0.0.0'
  },

  sentry: {
    dsn: process.env.SENTRY_DSN,
    config: {
      environment: process.env.APP_ENV,
      release: process.env.RELEASE_ID,
    },
    tracing: true,
    disableServerSide: true,
    initialize: true,
    clientIntegrations: {
      Vue: { attachProps: true },
      ExtraErrorData: {
        collectWindowErrors: true,
        collectPromiseErrors: true,
        collectVueXStoreErrors: true,
        showCustomEventDetails: true,
        showCustomEventData: true,
      },
    },

  },

  env: {
    APP_ENV: process.env.APP_ENV,
    RELEASE_ID: process.env.RELEASE_ID,
    SENTRY_DSN: process.env.SENTRY_DSN,
  }
}
