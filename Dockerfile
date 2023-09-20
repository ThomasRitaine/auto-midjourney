###################
# PRODUCTION
###################

FROM oven/bun

WORKDIR /home/bun/app

COPY --chown=bun:bun package.json bun.lockb ./

RUN bun install --production

COPY --chown=bun:bun . .

EXPOSE 3000

CMD [ "bun", "run", "src/app.ts" ]

USER bun
