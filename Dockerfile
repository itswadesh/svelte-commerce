# Use an official Node.js runtime as a parent image
FROM node:20-alpine
LABEL author="Swadesh Behera"

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application's source code to the working directory
COPY . .

# Build the project (if needed)
RUN npm run build

# Expose the port that your application runs on
EXPOSE 3000

# Define environment variables
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]