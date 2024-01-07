import {SeverityLevel} from "@sentry/vue";

declare module 'vue/types/vue' {
  // this.$log inside Vue components
  interface Vue {
    $log(message: string): void
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$log inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $log(message: string): void
  }
  // nuxtContext.$test
  interface Context {
    $log(message: string): void
  }
}

declare module 'vuex/types/index' {
  // this.$log inside Vuex stores
  interface Store<S> {
    $log(message: string): void
  }
}

import { Plugin } from '@nuxt/types'

const SentryExtraPlugin: Plugin = (context, inject) => {
  context.$sentry.getCurrentScope().addEventProcessor(function(event) {
    return event;
  });

  inject('log', (message: string) => {
    context.$sentry.captureMessage(message, {
      level: 'info',
      tags: {
        action: 'click',
      }
    })
  })
}

export default SentryExtraPlugin
