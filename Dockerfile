ARG NODE_VERSION=18-alpine


###################
# BUILD FOR PRODUCTION
###################

FROM node:${NODE_VERSION} As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

USER node


###################
# PRODUCTION
###################

FROM node:${NODE_VERSION} As prod

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma
COPY --chown=node:node --from=build /usr/src/app/public ./public
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

USER node

EXPOSE 3000

CMD [ "node", "dist/app.js" ]
