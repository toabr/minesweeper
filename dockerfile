FROM node:14.15.1-alpine AS debug

WORKDIR /app/

COPY ./package.json /app/package.json
RUN npm install

RUN npm install -g grunt
COPY ./gruntfile.js /app/gruntfile.js

COPY ./src/ /app/src/
RUN grunt build

ENTRYPOINT [ "npm","run","dev" ]

###########START NEW IMAGE###################
FROM node:14.15.1-alpine AS prod

WORKDIR /app/
ENV NODE_ENV="production"

RUN npm init -y
RUN npm install express

COPY --from=debug /app/dist/ /app/dist/
COPY --from=debug /app/src/server.js /app/index.js

CMD node .