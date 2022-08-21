##### Stage 1 - Development - Generate dist folder
FROM node:18 AS builder
LABEL author="Swadesh Behera"
# RUN mkdir -p /app/node_modules && chown -R node:node /app
# RUN mkdir -p /app
WORKDIR /usr/app
COPY package*.json ./
# COPY pnpm-lock.yaml ./
ENV PUPPETEER_SKIP_DOWNLOAD="true"
# RUN npm install -g pnpm
RUN npm install
RUN cp -R node_modules prod_node_modules
COPY . .
RUN npm run build

##### Stage 2 - Production
FROM builder as production
WORKDIR /usr/app
COPY --from=builder /usr/app/prod_node_modules ./node_modules
COPY --from=builder /usr/app/package*.json ./
ENV PUPPETEER_SKIP_DOWNLOAD="true"
ENV NODE_ENV=production
# RUN npm install --omit=dev
# COPY --from=builder /usr/app/build ./build
COPY --from=builder /usr/app/static ./static
COPY --from=builder /usr/app/.svelte-kit ./.svelte-kit
COPY --from=builder /usr/app/svelte.config.js ./svelte.config.js
COPY --from=builder /usr/app/tsconfig.json ./tsconfig.json
# COPY --from=builder /usr/app/vite.config.js ./vite.config.js
# COPY .env .
# USER node
# CMD ["node", "-r", "source-map-support/register", "index.js"]
CMD [ "npm", "start" ]

# ##### Stage 3 - Nginx
# FROM nginx:alpine
# VOLUME /var/cache/nginx
# COPY --from=builder /usr/app/dist /usr/share/nginx/html
# COPY ./config/nginx/nginx.conf /etc/nginx/conf.d/default.conf
# COPY ./config/nginx/fullchain.pem /etc/letsencrypt/live/api.litekart.in/fullchain.pem
# COPY ./config/nginx/privkey.pem /etc/letsencrypt/live/api.litekart.in/privkey.pem

# ##### Start nginx
# EXPOSE 80
# CMD ["nginx","-g","daemon off;"]
