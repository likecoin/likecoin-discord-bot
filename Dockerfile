FROM node:16
WORKDIR /app
COPY ./package.json ./ 
COPY ./yarn.lock ./
RUN yarn install
ENV NODE_ENV production
COPY ./ ./
RUN yarn generate
CMD yarn start
