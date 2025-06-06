FROM node:20.9.0-bullseye-slim

WORKDIR /usr/src/app

COPY package.json ./ 
COPY package-lock.json ./
RUN npm install

RUN mkdir -p dist/mail/templates
COPY src/mail/templates/ dist/mail/templates/

COPY . .

RUN npm run build

EXPOSE 4001

CMD [ "npm", "run", "start:dev" ]