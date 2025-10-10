FROM node:20.13

ARG APP

WORKDIR /app
COPY ./dist/apps/${APP} .
COPY ./prisma .
COPY ./blockchain/network-setup/abi ./blockchain/network-setup/abi

RUN npm ci --omit=dev
RUN npm install -D prisma@$(node -p "require('./package.json').dependencies['@prisma/client']")
RUN npx prisma generate

CMD ["node", "main.js"]