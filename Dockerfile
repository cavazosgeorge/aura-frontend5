# Stage 1: Build the React application
FROM dmz-kzopa-jfrog.pfizer.com:8443/docker/node:18 AS build-stage
# Build arguments for certificate and authentication
ARG ARTIFACTORY_CA_CERT2
ARG NPM_AUTH_TOKEN
ARG VITE_APP_ENV
# Set working directory
WORKDIR /app
# Copy package.json and package-lock.json
COPY package*.json ./
# Configure CA certificate and npm registry
RUN set -ex \
    && mkdir -p /usr/local/share/ca-certificates/ \
    && echo "$ARTIFACTORY_CA_CERT2" | base64 -d > /usr/local/share/ca-certificates/artifactory_chain.crt \
    && update-ca-certificates \
    && npm config set cafile /etc/ssl/certs/ca-certificates.crt \
    && echo "registry=https://dmz-kzopa-jfrog.pfizer.com:8443/artifactory/api/npm/npm/" > .npmrc \
    && echo "//dmz-kzopa-jfrog.pfizer.com:8443/artifactory/api/npm/npm/:_authToken=${NPM_AUTH_TOKEN}" >> .npmrc \
    && npm install --verbose \
    && rm -f .npmrc
# Copy the rest of the application code
COPY . .
# Set environment variable and build the app
ENV VITE_APP_ENV=$VITE_APP_ENV
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM dmz-kzopa-jfrog.pfizer.com:8443/docker/nginx:latest AS production-stage
# Copy the build output to Nginx's HTML directory
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port 80
EXPOSE 80
# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]