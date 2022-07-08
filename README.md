# compsole

## Setup environment

Copy the `.env.example` file to `.env`

```shell
$ cp .env.example .env
```

Edit the `.env` file with the appropriate values. Then run this command to export them to your terminal:

```shell
$ export $(grep -v '^#' .env | xargs)
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
