FROM node:18

COPY ./package.json /backend/
COPY ./yarn.lock /backend/
WORKDIR /backend/
RUN yarn install 

COPY . /backend/

CMD yarn start:dev







