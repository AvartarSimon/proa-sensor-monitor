FROM node:24-alpine3.21


WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install -g wait-port

COPY . .

CMD wait-port postgres:5432 && npm run start