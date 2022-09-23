FROM node:16
WORKDIR /app
# TODO: do not hardcode folder
RUN mkdir -p frontend backend packages/config
COPY ./package.json ./
COPY ./frontend/package.json ./frontend/
COPY ./backend/package.json ./backend/
COPY ./packages/config/package.json ./packages/config/
COPY ./yarn.lock ./
RUN yarn install
ENV NODE_ENV production
COPY ./ ./
RUN yarn generate
CMD yarn start
