# parcel development starter image

FROM node:lts-slim

USER node
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=/home/node/.npm-global/bin:$PATH
RUN npm i -g parcel
run mkdir /home/node/app
WORKDIR /home/node/app
EXPOSE 1234
CMD parcel src/index.html