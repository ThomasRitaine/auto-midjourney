ARG NODE_VERSION=18-alpine


###################
# PRODUCTION
###################

FROM node:${NODE_VERSION} As prod

ENV NODE_ENV production

USER node

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY --chown=node:node . .

RUN npm run prisma:generate

EXPOSE 3000 5555

CMD npm run prod
