# Use an official Node.js runtime as a parent image
ARG BASE_IMAGE="node:24-slim"
FROM ${BASE_IMAGE}
LABEL author="Swadesh Behera"

# Set the working directory inside the container
WORKDIR /usr/app

# Copy package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

RUN npm install -g bun

# Install dependencies
RUN bun i

# Copy the rest of your application's source code to the working directory
COPY . .

# Pins kit.version.name (see svelte.config.ts) so client and server bundles agree on the
# SvelteKit `__sveltekit_<hash>` global. Pass GIT_SHA as a build arg in CI; without it the
# config falls back to `git rev-parse` (works here because .git is copied in) and then to a
# stable constant — never a per-pass timestamp.
ARG GIT_SHA
ENV GIT_SHA=${GIT_SHA}

# Build the project (if needed)
RUN bun run build

# Expose the port that your application runs on
# EXPOSE 3000

# Define environment variables
ENV NODE_ENV=production

# Start the application
CMD ["bun", "start"]