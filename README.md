# compsole

<img src="https://img.shields.io/github/go-mod/go-version/BradHacker/compsole" alt="Go version">
<img src="https://goreportcard.com/badge/github.com/BradHacker/compsole" alt="License">
<img src="https://img.shields.io/github/package-json/dependency-version/BradHacker/compsole/react-scripts?filename=ui%2Fpackage.json" alt="React-scripts version">
<img src="https://img.shields.io/github/license/BradHacker/compsole" alt="License">

<p align="center">
  <img src="ui/src/res/logo.svg" width="80%" />
</p>

## Introduction

This tool is designed to streamline the process of intereacting with virtual cybersecurity competition environments. While originally designed to support [ISTS](https://ists.io "Information Security Talent Search") and [IRSeC](https://irsec.club "Incident Response Security Competiton"), both are competitions run by the student club [RITSEC](https://ritsec.club "RIT's Student-run Computing Security Club"), Compsole is designed in a scalable manner in order to support many different virtual environments.

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
