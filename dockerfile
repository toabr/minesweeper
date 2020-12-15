FROM node:14.15.1-alpine AS debug

WORKDIR /app/

COPY ./package.json /app/package.json
RUN npm install

RUN npm install -g grunt

COPY ./src/ /app/src
COPY ./gruntfile.js /app/gruntfile.js
COPY ./server.js /app/server.js
COPY ./index.html /app/index.html

ENTRYPOINT [ "npm","run","start" ]

# FROM node:12.4.0-alpine AS prod

# WORKDIR /app/
# COPY ./package.json /app/package.json
# RUN npm install
# COPY ./dist/ /app/dist/

# COPY ./server.js /app/server.js
# COPY ./index.html /app/index.html

# CMD node .