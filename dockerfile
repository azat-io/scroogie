FROM node:15.3.0-alpine3.10
RUN mkdir /app
WORKDIR /app

# Copy app files

RUN yarn set version berry
CMD yarn
COPY .yarn/ ./.yarn
COPY src ./src
COPY .env .pnp.js .yarnrc.yml makefile package.json tsconfig.json yarn.lock ./

# Install browser and font for Puppeteer

RUN apk add --update-cache make build-base
RUN apk update && apk upgrade && \
  echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
  echo @edge http://dl-cdn.alpinelinux.org/alpine/edge/testing/ >> /etc/apk/repositories && \
  apk add --no-cache \
    chromium@edge \
    nss@edge \
    freetype@edge \
    harfbuzz@edge
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD 1
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser
RUN apk add --update ttf-dejavu fontconfig && rm -rf /var/cache/apk/*

# Change timezone on Moscow

ENV TZ=Europe/Moscow
RUN apk add --update tzdata && \
  cp /usr/share/zoneinfo/$TZ /etc/localtime && \
  echo $TZ > /etc/timezone && apk del tzdata

CMD make start
EXPOSE $APP_PORT
