###################
# PRODUCTION
###################

FROM oven/bun

COPY --chown=bun:bun package.json bun.lockb ./

RUN bun install --production

COPY --chown=bun:bun . .

EXPOSE 3000

CMD [ "bun", "run", "app.ts" ]

USER bun
