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

# Feeds kit.version.name (see svelte.config.ts), shown in the footer. `.git` is copied in, so the
# config can read the commit timestamp; GIT_SHA remains a stable last-resort fallback for per-deploy
# version detection if git is ever unavailable.
ARG GIT_SHA
ENV GIT_SHA=${GIT_SHA}

# Build. BUILD_TIME is computed ONCE here and exported into the single build process, so both the
# client and server passes read the identical `yyyy-mm-dd hh:mm:ss` value — a per-pass `new Date()`
# would desync the `__sveltekit_<hash>` global and break every page in prod (see svelte.config.ts).
RUN BUILD_TIME="$(date -u +'%Y-%m-%d %H:%M:%S')" bun run build

# Expose the port that your application runs on
# EXPOSE 3000

# Define environment variables
ENV NODE_ENV=production

# Start the application
CMD ["bun", "start"]