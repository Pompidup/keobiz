FROM node:21

WORKDIR /keobiz
COPY package.json .
RUN npm install
COPY . .
CMD npm start