FROM node:11 as build

WORKDIR /app

# copy all dependency-related files and install dependencies
COPY package.json yarn.lock /app/
RUN yarn

# copy all src-related files and build aqueduct
COPY src/ /app/src
COPY tsconfig.json tslint.json /app/
RUN yarn build

FROM node:11-alpine

WORKDIR /app

# copy package/dependency-related files and install production deps
COPY --from=build /app/package.json /app/yarn.lock /app/
RUN yarn install --production

# copy built aqueduct
COPY --from=build /app/build /app/build

# run
EXPOSE 4000
CMD node build
