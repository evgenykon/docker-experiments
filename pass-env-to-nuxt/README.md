## Pass env vars to Nuxt 2 page

Goals:
- make Nuxt 2 app which uses ENV-parameters in config and show them on main page
- pass ENV-parameters to Nuxt 2 app from docker-compose.yaml, .env file and system environment variable

### My steps to pass vars
- docker init
- some edits with Dockerfile and compose.yaml
- docker compose build
- docker compose run --rm nuxt bash
- (inside container) run `yarn create nuxt-app .`
- edit nuxt.config.js (port, host, env)
- edit pages/index.vue (show env vars)
- export VAR_FROM_SYS_ENV='var from sysenv'
- docker compose run --rm nuxt yarn build
- docker compose build
- docker compose up
- open localhost:3000 in browser

### Notes to update env
All the same in .env, compose.yaml and sys env:
- Only docker compose down / docker compose up has no effect
- `docker compose run --rm nuxt yarn build && docker compose up` has effect 
- docker compose rebuild NOT required
