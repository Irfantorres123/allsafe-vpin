FROM node:16.13.1-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --silent

COPY . .

EXPOSE 5000

CMD ["node","app.js"]