# specify the node base image with your desired version node:<version>
FROM node:14



COPY . .

RUN yarn install
RUN yarn add concurrently -W

EXPOSE 3000
EXPOSE 8080

CMD ["npm", "run", "dev"]