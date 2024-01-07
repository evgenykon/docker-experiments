## Sentry config with Nuxt2 & Docker

Goals:
- make Nuxt 2 app with Sentry using ENV parameters
- catch runtime errors with Sentry

### My steps to pass vars
- repeat steps from [pass-env-to-nuxt](../pass-env-to-nuxt) with 'Typescript' option in Nuxt create app process
- add SENTRY_DSN, APP_ENV and RELEASE_ID parameters to docker configs which will be used in nuxt.config.js
- install @nuxtjs/sentry, @sentry/browser, @sentry/integrations, @sentry/vue
- add '@nuxtjs/sentry' to modules in nuxt.config.js
- add '@nuxtjs/sentry' to compilerOptions.types in tsconfig.json
- add env section to nuxt.config.js
- docker compose build
- docker compose run --rm nuxt bash
- cook a plugin 'plugins/sentry.plugin.ts' according to https://typescript.nuxtjs.org/cookbook/plugins/
- define SENTRY_DSN with `export SENTRY_DSN='...'`
- define APP_ENV with `export APP_ENV='production'`
- define RELEASE_TAG with `export RELEASE_TAG='1.0.0'` or by some other way (e.g. "export RELEASE_ID=`git rev-parse --short HEAD`")
- docker compose build
- docker compose run --rm nuxt yarn build
- docker compose up
- open http://localhost:3000
- click some buttons and watch errors in Sentry