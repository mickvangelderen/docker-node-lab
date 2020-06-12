FROM node:14.4 AS base
WORKDIR /usr/src/server
COPY package.json package-lock.json ./

# FROM base AS build
# RUN npm install
# COPY . .
# RUN ls
# RUN npm run build

# FROM base AS run
# EXPOSE 3000
# RUN npm install --production
# COPY --from=build /usr/src/server/dist/ ./
# CMD npm start

FROM base AS develop
CMD node_modules/.bin/nodemon --verbose --ext ts --exec "node_modules/.bin/tsc && node dist/index.js"