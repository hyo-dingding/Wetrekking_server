FROM node:14

WORKDIR /team-wetrekking/
COPY ./package.json /team-wetrekking/
COPY ./yarn.lock /team-wetrekking/
RUN yarn install

COPY . /team-wetrekking/

CMD yarn start:dev