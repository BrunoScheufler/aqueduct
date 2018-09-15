FROM node:alpine

WORKDIR /app
COPY . .

RUN yarn && yarn build

EXPOSE 4000
CMD node build
