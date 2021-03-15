FROM node:14-15-buster

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
  # task-check
  # puppeteer
  dumb-init tzdata \
  # rsync\
  # ca-certificates fonts-liberation gconf-service libappindicator1 libasound2 libatk-bridge2.0-0 \
  # libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libgconf-2-4 \
  # libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 \
  # libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 \
  # libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils \
  && rm -rf /var/lib/apt/lists/*

RUN echo "Europe/Moscow" > /etc/timezone && rm -f /etc/localtime && dpkg-reconfigure -f noninteractive tzdata

RUN useradd -u 1001 -ms /bin/bash raccon
RUN chown -R raccon:raccon /usr/src/app
USER raccon

COPY package*.json ./

COPY NPMTOKEN .

RUN echo "@htmlacademy:registry=https://npm.pkg.github.com/htmlacademy" > .npmrc \
  && echo "//npm.pkg.github.com/:_authToken=$(cat NPMTOKEN)" >> .npmrc

RUN npm install --engine-strict

COPY tsconfig.json ./

COPY . .
RUN npm run build && mkdir tmp

EXPOSE 9000 4567

ENV NODE_ENV production

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/server.js"]
