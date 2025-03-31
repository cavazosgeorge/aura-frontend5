# Frontend GitLab CI/CD Pipeline Documentation

## Table of Contents
1. [Overview](#overview)
2. [Stages](#stages)
3. [Variables](#variables)
4. [Jobs](#jobs)
    - [run_tests](#run_tests)
    - [build_image](#build_image)
    - [deploy_dev](#deploy_dev)
    - [deploy_prod](#deploy_prod)
5. [Workflow](#workflow)
6. [GitLab Environments](#gitlab-environments)
7. [Docker Image Tagging](#docker-image-tagging)
8. [Important Notes](#important-notes)

## Overview

This GitLab CI/CD pipeline automates the process of testing, building, and deploying the frontend application. It consists of three stages: test, build, and deploy, with separate jobs for development and production deployments.

## Stages

1. `test`: Runs the test suite for the frontend application
2. `build`: Builds a Docker image of the frontend application
3. `deploy`: Deploys the application to either development or production environment

## Variables

- `DEV_ENV`: Set to "development"
- `PROD_ENV`: Set to "production"

These variables are used to set the appropriate environment for deployments.

## Jobs

### run_tests

This job runs the frontend test suite.

```yaml
run_tests:
  stage: test
  tags:
    - urp
  image: ${DOCKER_REGISTRY_IP_ADDRESS}:5000/node:latest
  cache:
    key: ${CI_COMMIT_REF_SLUG}
    paths:
      - node_modules/
    policy: pull-push
  script:
    - npm ci
    - npm run test
```

- Uses a Node.js Docker image from the private registry
- Caches `node_modules` to speed up subsequent runs
- Installs dependencies using `npm ci` for a clean install
- Runs the test suite

### build_image

This job builds a Docker image of the frontend application.

```yaml
build_image:
  stage: build
  tags: 
    - urp
  image: ${DOCKER_REGISTRY_IP_ADDRESS}:5000/docker:24.0.7-cli
  script:
    - echo "Building image for ${CI_COMMIT_REF_NAME}"
    - docker build --no-cache -t user-request-portal-frontend:${CI_COMMIT_REF_NAME} .
    - docker tag user-request-portal-frontend:${CI_COMMIT_REF_NAME} ${DOCKER_REGISTRY_IP_ADDRESS}:5000/user-request-portal-frontend:${CI_COMMIT_REF_NAME}
    - docker push ${DOCKER_REGISTRY_IP_ADDRESS}:5000/user-request-portal-frontend:${CI_COMMIT_REF_NAME}
```

- Uses Docker-in-Docker to build the frontend application image
- Builds the image without using cache to ensure a fresh build
- Tags the image with the branch name and pushes it to the private Docker registry

### deploy_dev

This job deploys the application to the development environment.

```yaml
deploy_dev:
  stage: deploy
  tags:
    - urp
  image: ${DOCKER_REGISTRY_IP_ADDRESS}:5000/node:latest
  environment:
    name: development
  before_script:
    - eval $(ssh-agent -s)
    - ssh-add <(echo "$SSH_PRIVATE_KEY")
    - mkdir -p ~/.ssh
    - echo -e "Host *\n\tStrictHostKeyChecking no\n\n" > ~/.ssh/config
  script:
    - ssh ${FRONTEND_PROD_VM} "docker pull ${DOCKER_REGISTRY_IP_ADDRESS}:5000/user-request-portal-frontend:${CI_COMMIT_REF_NAME}"
    - ssh ${FRONTEND_PROD_VM} "docker stop user-request-portal-frontend-dev || true"
    - ssh ${FRONTEND_PROD_VM} "docker rm user-request-portal-frontend-dev || true"
    - export LAST_UPDATED=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    - |
      ssh ${FRONTEND_PROD_VM} "docker run -d -p 3000:80 \
          -e NODE_ENV=${DEV_ENV} \
          -e LAST_UPDATED='$LAST_UPDATED' \
          --name user-request-portal-frontend-dev \
          ${DOCKER_REGISTRY_IP_ADDRESS}:5000/user-request-portal-frontend:${CI_COMMIT_REF_NAME}"
  only:
    - develop
```

- Sets up SSH access to the deployment server
- Pulls the latest Docker image for the development environment
- Stops and removes any existing development container
- Starts a new Docker container with updated image and environment variables
- Maps port 3000 on the host to port 80 in the container for the development environment
- Only runs on the `develop` branch

### deploy_prod

This job deploys the application to the production environment.

```yaml
deploy_prod:
  stage: deploy
  tags:
    - urp
  image: ${DOCKER_REGISTRY_IP_ADDRESS}:5000/node:latest
  environment:
    name: production
  before_script:
    - eval $(ssh-agent -s)
    - ssh-add <(echo "$SSH_PRIVATE_KEY")
    - mkdir -p ~/.ssh
    - echo -e "Host *\n\tStrictHostKeyChecking no\n\n" > ~/.ssh/config
  script:
    - |
      ssh ${FRONTEND_PROD_VM} "
        # Stop and remove any container using port 80
        container_id=\$(docker ps -q --filter publish=80)
        if [ ! -z \"\$container_id\" ]; then
          docker stop \$container_id
          docker rm \$container_id
        fi
        
        # Stop and remove the specific container if it exists
        docker stop user-request-portal-frontend-prod || true
        docker rm user-request-portal-frontend-prod || true
        
        # Pull the new image
        docker pull ${DOCKER_REGISTRY_IP_ADDRESS}:5000/user-request-portal-frontend:${CI_COMMIT_REF_NAME}
        
        # Run the new container
        docker run -d -p 80:80 \
          -e NODE_ENV=${PROD_ENV} \
          -e LAST_UPDATED='$(date -u +"%Y-%m-%dT%H:%M:%SZ")' \
          --name user-request-portal-frontend-prod \
          ${DOCKER_REGISTRY_IP_ADDRESS}:5000/user-request-portal-frontend:${CI_COMMIT_REF_NAME}
      "
  only:
    - master
```

- Similar to `deploy_dev`, but for the production environment
- Includes additional steps to handle potential port conflicts:
  - Stops and removes any container using port 80
  - Stops and removes the specific production container if it exists
- Pulls the production Docker image
- Starts a new Docker container with production settings
- Maps port 80 on the host to port 80 in the container for the production environment
- Only runs on the `master` branch

## Workflow

1. When code is pushed to any branch:
   - The `run_tests` job executes to ensure all tests pass.
   - The `build_image` job creates a new Docker image tagged with the branch name.

2. When code is pushed to the `develop` branch:
   - After tests pass and the image is built, the `deploy_dev` job deploys this image to the development environment.

3. When code is pushed to the `master` branch:
   - After tests pass and the image is built, the `deploy_prod` job deploys this image to the production environment.

## GitLab Environments

This CI/CD pipeline utilizes GitLab environments for managing deployments. Two environments are set up:

1. `development`: For development deployments (port 3000)
2. `production`: For production deployments (port 80)

## Docker Image Tagging

The CI/CD pipeline uses dynamic Docker image tagging based on the Git branch name, using the `${CI_COMMIT_REF_NAME}` variable provided by GitLab CI.

- For the `develop` branch, images will be tagged as `user-request-portal-frontend:develop`
- For the `master` branch, images will be tagged as `user-request-portal-frontend:master`

## Important Notes

1. Ensure all necessary environment variables (e.g., `SSH_PRIVATE_KEY`, `DOCKER_REGISTRY_IP_ADDRESS`, `FRONTEND_PROD_VM`) are set in your GitLab CI/CD settings.

2. The development environment uses port 3000, while the production environment uses port 80 on the deployment server.

3. The configuration uses `StrictHostKeyChecking no` for SSH connections, which can be a security risk. Consider using a more secure SSH configuration in a production setting.

4. The `build_image` job does not use caching for Docker layers. This ensures a clean build each time but may increase build times.

5. The production deployment script includes steps to handle port conflicts. Ensure this doesn't interfere with other services that might be using port 80.

6. Regular review and updates of this CI/CD configuration are recommended to ensure it meets the evolving needs of the project and maintains security best practices.

7. When making changes to the CI/CD configuration or deployment process, always test thoroughly in the development environment before applying to production.
