FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
RUN npm i concurrently
RUN npm install -g serve
RUN npm run build-fe 
RUN npm run build-be 
COPY . .
EXPOSE 4000
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node
CMD ["serve", "-s", "build"]
