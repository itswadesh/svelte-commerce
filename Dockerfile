##### Stage 1 - Build
FROM node:18 AS builder
LABEL author="Swadesh Behera"
WORKDIR /usr/app
COPY package*.json ./
COPY .npmrc ./
ENV PUPPETEER_SKIP_DOWNLOAD="true"
RUN yarn install --force
RUN cp -R node_modules prod_node_modules
COPY . .
RUN yarn run build

##### Stage 2 - Move  to Production
FROM builder as production
WORKDIR /usr/app
COPY --from=builder /usr/app/prod_node_modules ./node_modules
COPY --from=builder /usr/app/package.json ./
COPY --from=builder /usr/app/yarn.lock ./
ENV PUPPETEER_SKIP_DOWNLOAD="true"
ENV NODE_ENV=production
COPY --from=builder /usr/app/build ./build
COPY --from=builder /usr/app/static ./static
COPY --from=builder /usr/app/.svelte-kit ./.svelte-kit
COPY --from=builder /usr/app/svelte.config.js ./svelte.config.js
COPY --from=builder /usr/app/tsconfig.json ./tsconfig.json
COPY --from=builder /usr/app/vite.config.js ./vite.config.js
CMD [ "yarn", "start" ]
