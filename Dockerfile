ARG NODE_VERSION=18-alpine


###################
# PRODUCTION
###################

FROM node:${NODE_VERSION} As prod

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY --chown=node:node . .

RUN npm run prisma:generate

USER node

EXPOSE 3000 5555

CMD (npx prisma studio &) && npm run prod
