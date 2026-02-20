FROM node:24-alpine AS crydengo-bot

COPY ./src /src
WORKDIR /src

RUN NODE_ENV=production
RUN npm install --production

ENV NODE_ENV=production

CMD ["npm", "run dev"]