# docker-experiments

## Pass env vars to console app

Goals:
- make console app which uses ENV-parameter 'APP_VERSION' and output it to file
- pass ENV-parameter 'APP_VERSION' to console app from compose.yaml
- pass ENV-parameter 'APP_VERSION' to console app from current docker up environment variable

### My steps to initialize project 'pass-env-to-console'
- docker init
- some edits with Dockerfile and compose.yaml
- docker compose build
- export APP_VERSION=1
- docker compose up

Result: file 'result.txt' with version '1'
Update: pass value both from current env variable (APP_VERSION_1) and compose.yaml (APP_VERSION_2)

## Pass env vars to Nuxt 2 config

Goals:
- make Nuxt 2 app which uses ENV-parameter 'APP_VERSION' in config and show them on main page
- pass ENV-parameter 'APP_VERSION' to Nuxt 2 app from docker-compose.yaml

### My steps to initialize project 'pass-env-to-nuxt'
- docker init
- some edits with Dockerfile and compose.yaml
- docker compose run --build -v .:/usr/src/app --rm node bash
- (inside container) yarn create nuxt-app nuxt
- edit Nuxt main page and config to show ENV-parameter 'APP_VERSION'
- change Dockerfile workdir to /usr/src/app/nuxt
