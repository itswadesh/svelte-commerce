# Use an official Node.js runtime as a parent image
ARG BASE_IMAGE="node:22-alpine"
FROM ${BASE_IMAGE} AS builder
LABEL author="Swadesh Behera"

# Install bun globally
RUN npm install -g bun@1.2.2

# Set the working directory inside the container
WORKDIR /usr/app

# Copy package files
COPY package.json ./
COPY bun.lock ./
ENV NODE_ENV=development
RUN bun install
RUN cp -R node_modules prod_node_modules
COPY . .
RUN bun run build

##### Stage 2 - Production
FROM builder AS production

WORKDIR /usr/app
COPY --from=builder /usr/app/prod_node_modules ./node_modules
COPY --from=builder /usr/app/.svelte-kit ./svelte-kit
COPY --from=builder /usr/app/package*.json ./

ENV NODE_ENV=production

# Start the application
CMD ["bun", "start"]