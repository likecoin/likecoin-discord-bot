FROM node:16
WORKDIR /app
COPY ./package.json ./ 
COPY ./yarn.lock ./
RUN yarn install
ENV NODE_ENV production
COPY ./ ./
CMD yarn start
