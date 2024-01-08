FROM node:21-bullseye-slim
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init
RUN mkdir -p /keobiz/app/node_modules && chown -R node:node /keobiz/app
ENV NODE_ENV=production
WORKDIR /keobiz/app
COPY package*.json ./
USER node
RUN npm ci --only=production
COPY --chown=node:node . .
CMD ["dumb-init", "node", "src/index.js"]