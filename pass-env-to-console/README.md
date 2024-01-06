
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

### Update
I've pass value both from current env variable (APP_VERSION_1) and compose.yaml (APP_VERSION_2)