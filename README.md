# compsole

## Setup environment

Source the `.envrc` file to generate your `.env` file.

> _Note: this is necessary to run every time the environment is executed to prefill the environment variables_

```shell
$ source .envrc
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
$ export $(grep -v '^#' .env | xargs)
$ go run server.go
```
