# Use an official Node.js runtime as a parent image
ARG BASE_IMAGE="node:23-slim"
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

# Build the project (if needed)
RUN bun run build

# Expose the port that your application runs on
EXPOSE 3000

# Define environment variables
ENV NODE_ENV=production

# Start the application
CMD ["bun", "start"]