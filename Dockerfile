FROM node:alpine

WORKDIR /home/node/src

COPY src /home/node/src

RUN npm install

EXPOSE 8080

CMD ["npm", "start"]