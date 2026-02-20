FROM node:24-alpine AS discord-bot

COPY ./src /src
WORKDIR /src

RUN NODE_ENV=production
RUN npm install
RUN npm run dev