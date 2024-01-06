
## Pass env vars to Node

Goals:
- make Node app which uses ENV-parameters inside Js code and show them in output
- pass ENV-parameters from docker-compose.yaml, .env file and system environment variable

### My steps to pass vars
- docker init
- some edits with Dockerfile and compose.yaml
- docker compose build
- docker compose run --rm node bash
- (inside container) run `yarn init -y`
- docker compose build
- export VAR_FROM_SYS_ENV='var from sysenv'
- docker compose up (outputs to console)