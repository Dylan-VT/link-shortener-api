# specify the node base image with your desired version node:<version>
FROM node:14



COPY . .

RUN yarn install

EXPOSE 8080

CMD ["npm", "start"]