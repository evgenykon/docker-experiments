## Sentry config with Nuxt2 & Docker

Goals:
- make Nuxt 2 app with Sentry using ENV parameters
- catch runtime errors with Sentry

### My steps to pass vars
- repeat steps from [pass-env-to-nuxt](../pass-env-to-nuxt) with 'Typescript' option in Nuxt create app process
- set SENTRY_DSN in .env file and configs
- add APP_ENV and RELEASE_TAG parameter
- add '@nuxtjs/sentry' to modules in nuxt.config.js
- add '@nuxtjs/sentry' to compilerOptions.types in tsconfig.json
- docker compose build
- docker compose run --rm nuxt bash
- (inside container) run `yarn add @nuxtjs/sentry`
- add Sentry module to nuxt.config.js
