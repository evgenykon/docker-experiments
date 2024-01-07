<template>
  <div>
    <h1>Index page for Nuxt app</h1>
    <ul>
      <li>APP_ENV {{APP_ENV}}</li>
      <li>SENTRY_DSN {{SENTRY_DSN}}</li>
      <li>RELEASE_TAG {{RELEASE_ID}}</li>
    </ul>
    <h2>Event triggers</h2>
    <ul>
      <li><button @click="unreachableAxiosRequest">Make Axios request to wrong URL</button></li>
      <li><button @click="callSentryEvent">Call direct Sentry captureMessage</button></li>
      <li><button @click="callUglyMethod">Call ugly method</button></li>
      <li><button @click="callLogMethod">Call global $log method</button></li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'IndexPage',
  data: () => ({
    APP_ENV: process.env.APP_ENV,
    SENTRY_DSN: process.env.SENTRY_DSN,
    RELEASE_ID: process.env.RELEASE_ID,
  }),
  methods: {
    unreachableAxiosRequest() {
      this.$axios.get('https://asdsd.ccccc')
    },
    callSentryEvent() {
      this.$sentry.captureMessage('direct sentry message', 'info')
    },
    callUglyMethod() {
      throw Error('Ugly method called');
    },
    callLogMethod() {
      this.$log('Global log method called')
    }
  },
})
</script>
