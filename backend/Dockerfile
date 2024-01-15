FROM node:latest

WORKDIR /app

COPY package*.json .

RUN npm install

RUN npm install -g ts-node

COPY . .

EXPOSE 5000

CMD ["ts-node", "./src/app.ts"]