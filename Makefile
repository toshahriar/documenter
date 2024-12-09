# Define Docker Compose commands
DOCKER_COMPOSE = docker compose

# Default target
.PHONY: help
help:
	@echo "Makefile for managing Docker commands for two projects"
	@echo ""
	@echo "Usage:"
	@echo "  make <target>"
	@echo ""
	@echo "Targets:"
	@echo "  prepare            Prepare the environment (copy .env files)"
	@echo "  install            Install dependencies in both API and web"
	@echo "  start              Start the Docker containers"
	@echo "  stop               Stop the Docker containers"
	@echo "  reset              Reset the environment (stop and remove volumes)"
	@echo "  list               List running Docker containers"
	@echo "  api-logs           View logs for the API service"
	@echo "  web-logs           View logs for the web service"
	@echo "  format             Format code using Prettier"
	@echo "  migration          Run migrations for the API service"
	@echo "  migration-revert   Revert the last migration for the API service"
	@echo "  seed               Seed the database for the API service"

# Environment setup
.PHONY: prepare
prepare:
	cp .env.example .env
	cp api/.env.example api/.env
	cp web/.env.example web/.env

# Install dependencies
.PHONY: install
install:
	$(DOCKER_COMPOSE) run --rm api npm install
	$(DOCKER_COMPOSE) run --rm web npm install

# Docker container management
.PHONY: start
start:
	$(DOCKER_COMPOSE) up -d --force-recreate --remove-orphans

.PHONY: stop
stop:
	$(DOCKER_COMPOSE) down --remove-orphans

.PHONY: reset
reset:
	$(DOCKER_COMPOSE) down --remove-orphans --volumes

.PHONY: list
list:
	$(DOCKER_COMPOSE) ps

# Logs
.PHONY: api-logs
api-logs:
	$(DOCKER_COMPOSE) logs -f api

.PHONY: web-logs
web-logs:
	$(DOCKER_COMPOSE) logs -f web

# Code formatting
.PHONY: format
format:
	$(DOCKER_COMPOSE) run --rm api npm run format
	$(DOCKER_COMPOSE) run --rm web npm run format

# Database management
.PHONY: migration
migration:
	$(DOCKER_COMPOSE) run --rm api npm run migration

.PHONY: migration-revert
migration-revert:
	$(DOCKER_COMPOSE) run --rm api npm run migration:revert

.PHONY: seed
seed:
	$(DOCKER_COMPOSE) run --rm api npm run seed
