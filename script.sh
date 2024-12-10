#!/bin/bash

# Define Docker Compose command
DOCKER_COMPOSE="docker compose"

# Function to display help message
function show_help() {
  echo "Shell script for managing Docker commands for two projects"
  echo ""
  echo "Usage: $0 <command>"
  echo ""
  echo "Commands:"
  echo "  prepare            Prepare the environment (copy .env files)"
  echo "  install            Install dependencies in both API and web"
  echo "  start              Start the Docker containers"
  echo "  stop               Stop the Docker containers"
  echo "  reset              Reset the environment (stop and remove volumes)"
  echo "  list               List running Docker containers"
  echo "  api-logs           View logs for the API service"
  echo "  consumer-logs      View logs for the consumer service"
  echo "  web-logs           View logs for the web service"
  echo "  format             Format code using prettier"
  echo "  migration          Run migrations for the API service"
  echo "  migration-revert   Revert the last migration for the API service"
  echo "  seed               Seed the database for the API service"
}

# Function to prepare the environment by copying .env files
function prepare() {
  cp .env.example .env
  cp api/.env.example api/.env
}

# Function to install dependencies for API and web services
function install() {
  $DOCKER_COMPOSE build
  $DOCKER_COMPOSE run --rm api npm install
  $DOCKER_COMPOSE run --rm consumer npm install
  $DOCKER_COMPOSE run --rm web npm install
}

# Function to init the Docker containers in detached mode
function start() {
  $DOCKER_COMPOSE up -d --force-recreate --remove-orphans
}

# Function to stop the Docker containers
function stop() {
  $DOCKER_COMPOSE down --remove-orphans
}

# Function to reset the environment (stop and remove containers, networks, and volumes)
function reset() {
  $DOCKER_COMPOSE down --remove-orphans --volumes
}

# Function to list running Docker containers
function list() {
  $DOCKER_COMPOSE ps
}

# Function to view logs for the API service
function api_logs() {
  $DOCKER_COMPOSE logs -f api
}

# Function to view logs for the consumer service
function consumer_logs() {
  $DOCKER_COMPOSE logs -f consumer
}

# Function to view logs for the web service
function web_logs() {
  $DOCKER_COMPOSE logs -f web
}

# Function to format code using prettier
function format() {
  $DOCKER_COMPOSE run --rm api npm run format
  $DOCKER_COMPOSE run --rm web npm run format
}

# Function to run migrations for the API service
function migration() {
  $DOCKER_COMPOSE run --rm api npm run migration
}

# Function to revert the last migration for the API service
function migration_revert() {
  $DOCKER_COMPOSE run --rm api npm run migration:revert
}

# Function to seed the database for the API service
function seed() {
  $DOCKER_COMPOSE run --rm api npm run seed
}

# Main script logic
case "$1" in
  prepare)
    prepare
    ;;
  install)
    install
    ;;
  init)
    start
    ;;
  stop)
    stop
    ;;
  reset)
    reset
    ;;
  list)
    list
    ;;
  api-logs)
    api_logs
    ;;
  web-logs)
    web_logs
    ;;
  format)
    format
    ;;
  migration)
    migration
    ;;
  migration-revert)
    migration_revert
    ;;
  seed)
    seed
    ;;
  *)
    show_help
    ;;
esac
