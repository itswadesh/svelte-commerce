##### Stage 1 - Development - Generate dist folder
FROM node:21-slim AS builder
LABEL author="Swadesh Behera"

# RUN npm install -g npm

# Add timezone
RUN apt-get install -yq tzdata && \
    ln -fs /usr/share/zoneinfo/Asia/Kolkata /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata
    
WORKDIR /usr/app
COPY package.json ./
COPY .npmrc ./
ENV PUPPETEER_SKIP_DOWNLOAD="true"
RUN npm install --force
RUN cp -R node_modules prod_node_modules
COPY . .
RUN npm run build
##### Stage 2 - Production
FROM node:21-slim as production
WORKDIR /usr/app
COPY --from=builder /usr/app/prod_node_modules ./node_modules
COPY --from=builder /usr/app/package*.json ./
ENV PUPPETEER_SKIP_DOWNLOAD="true"
ENV NODE_ENV=production
COPY --from=builder /usr/app/.svelte-kit ./.svelte-kit
CMD [ "npm", "start" ]
