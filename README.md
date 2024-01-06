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

## Pass env vars to Node

Goals:
- make Node app which uses ENV-parameter 'APP_VERSION' in config and show them on console app
- pass ENV-parameter 'APP_VERSION' from docker-compose.yaml, .env file and environment variable

### My steps to pass vars
- docker init
- some edits with Dockerfile and compose.yaml
- docker compose build
- docker compose run --rm node bash
- (inside container) run `yarn init -y`
- docker compose build
- export VAR_FROM_SYS_ENV='var from sysenv'
- docker compose up (outputs to console)

## Pass env vars to Nuxt 2 config

Goals:
- make Nuxt 2 app which uses ENV-parameter 'APP_VERSION' in config and show them on main page
- pass ENV-parameter 'APP_VERSION' to Nuxt 2 app from docker-compose.yaml

### My steps to pass vars to Nuxt page
