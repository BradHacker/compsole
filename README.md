# compsole

[![Go version](https://img.shields.io/github/go-mod/go-version/BradHacker/compsole)](https://github.com/BradHacker/compsole)
[![Go Report Card](https://goreportcard.com/badge/github.com/BradHacker/compsole)](https://goreportcard.com/report/github.com/BradHacker/compsole)
[![React-scripts version](https://img.shields.io/github/package-json/dependency-version/BradHacker/compsole/react-scripts?filename=ui%2Fpackage.json)](https://github.com/BradHacker/compsole/blob/main/ui/package.json)
[![License](https://img.shields.io/github/license/BradHacker/compsole)](https://github.com/BradHacker/compsole/blob/main/LICENSE)

<p align="center">
  <img src="ui/src/res/logo.svg" width="80%" style="max-width:500px;" />
</p>

## Introduction

This tool is designed to streamline the process of intereacting with virtual cybersecurity competition environments. While originally designed to support [ISTS](https://ists.io "Information Security Talent Search") and [IRSeC](https://irsec.club "Incident Response Security Competiton"), both are competitions run by the student club [RITSEC](https://ritsec.club "RIT's Student-run Computing Security Club"), Compsole is designed in a scalable manner in order to support many different virtual environments.

## Setup environment

Source the `.envrc` file to generate your `.env` file.

> _Note: this is necessary to run every time the environment is executed to prefill the environment variables_

```shell
source .envrc
```

## Production

Docker is used in production to host the frontend, backend, database, and Redis.

### Create your production `docker-compose.prod.yml`

Copy the contents of the [docker-compose.yml](./docker-compose.yml) to a new file `docker-compose.prod.yml`.

Set the environment variables as follows:

```yaml
# [...]
services:
  # [...]
  ui:
    build:
      context: ./ui
      # Use "./Dockerfile.ssl" instead for SSL
      dockerfile: ./Dockerfile
    # [...]
    volumes:
      - /app/node_modules/
      # vvvvvvvvvvvvv FOR SSL vvvvvvvvvvvvv #
      - ./ui/docker_files/caddyfile:/etc/caddy/Caddyfile
      - ./.caddy/data:/data
      - ./.caddy/config:/config
      # ^^^^^^^^^^^^^ FOR SSL ^^^^^^^^^^^^^ #
    environment:
      - DOMAIN=<fqdn of host>
  # [...]
  backend:
    # [...]
    environment:
      # Server
      - GRAPHQL_HOSTNAME=<fqdn of host>
      - CORS_ALLOWED_ORIGINS=http(s)://<fqdn of host>
      - PORT=:<port for graphql api (8080 by default)>
      # Toggle this option if using SSL
      - HTTPS_ENABLED=<true/false>
      - DEFAULT_ADMIN_USERNAME=<admin username>
      - DEFAULT_ADMIN_PASSWORD=<admin password>
      # [...]
      # Timeout in minutes
      - COOKIE_TIMEOUT=<suggested is 180 (or 3 hours)>
      # Window is in hours (time after invalid session to refresh REST tokens)
      - REFRESH_WINDOW=<suggested is 8 hours>
      # Change this to a randomly generated value (>= 64 bytes encouraged)
      - JWT_SECRET=<random key (>= 64 bytes</random>)>
      # Database
      - PG_URI=postgresql://<postgres user>:<postgres password>@db/compsole
      # Redis
      - REDIS_URI=redis:6379
      - REDIS_PASSWORD=
      # [...]
    db:
      # [...]
      environment:
        - POSTGRES_USER=<postgres user>
        - POSTGRES_PASSWORD=<postgres password>
        # [...]
```

### Create React `.env` file

Copy the contents of the [ui/.env.example](./ui/.env.example) to a new file `ui/.env`

Set the environment variable as follows:

```env
VITE_APP_SERVER_URL=http(s)://<fqdn of host>
VITE_APP_WS_URL=ws(s)://fqdn of host>
```

| _Note: be sure to use **both** `https` and `wss` if using SSL_

### Bring up the production environment

```shell
docker compose -f docker-compose.prod.yml up -d
```

## API Documentation

### Generating API Documentation

The swagger docs are auto-generating. To generate them, simply run:

```shell
go generate ./api
```

### Accessing API Documentation

The API docs for Compsole are hosted by the Compsole server. To access, simply start the server (whether [development](#development) or [production](#production)) and then access the docs by navigating to:

```plaintext
# Development
http://localhost:8080/api/docs/index.html

# Production
http(s)://<deployment url>/api/docs/index.html
```

## Development

For development you can use [Vagrant](https://www.vagrantup.com/) to spin up a development environment.

After installing vagrant, just run:

```shell
# On your host
$ vagrant up
$ vagrant ssh

# Inside the VM
$ cd /vagrant
$ docker compose -f docker-compose.dev.yml up -d
$ source .envrc
# Edit the .env file and exit (will be loaded as env vars automatically)
$ go run server.go
```
