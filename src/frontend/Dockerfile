FROM node:lts-alpine
ENV NODE_ENV=development
WORKDIR /usr/src/app
COPY ["**/package.json", "**/package-lock.json*", "**/npm-shrinkwrap.json*", "**/.env", "../../"]
COPY . .
RUN chown -R node /usr/src/app
RUN npm i concurrently
RUN npm install -g serve
RUN npm install eslint --save-dev npm install eslint-config-standard --save-dev npm install eslint-config-standard-jsx --save-dev npm install eslint-plugin-react --save-dev npm install eslint-plugin-import --save-dev npm install eslint-plugin-node --save-dev npm install eslint-plugin-promise --save-dev npm install eslint-plugin-standard --save-dev
COPY . .
RUN npm run build-fe 
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node
