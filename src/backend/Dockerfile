FROM node:lts-alpine
ENV NODE_ENV=development
WORKDIR /usr/src/app
COPY ["**/package.json", "**/package-lock.json*", "**/npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
RUN npm install eslint --save-dev npm install eslint-config-standard --save-dev npm install eslint-config-standard-jsx --save-dev npm install eslint-plugin-react --save-dev npm install eslint-plugin-import --save-dev npm install eslint-plugin-node --save-dev npm install eslint-plugin-promise --save-dev npm install eslint-plugin-standard --save-dev
COPY . .
RUN npm run build-be 
EXPOSE 4000
RUN chown -R node /usr/src/app
USER node
