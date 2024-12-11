FROM node:20.13

ARG APP

WORKDIR /app
COPY ./dist/apps/${APP} .
COPY ./prisma .
COPY ./.npmrc .

RUN npm ci --omit=dev
RUN npm install -D prisma
RUN npx prisma generate

CMD ["node", "main.js"]