FROM node:10-alpine

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN apk add --no-cache \
        git \
        build-base \
        g++ \
        cairo-dev \
        jpeg-dev \
        pango-dev \
        freetype-dev \
        giflib-dev

RUN npm install

# Bundle app source
COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]
