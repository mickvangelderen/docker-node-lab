FROM node:14.4 AS base
WORKDIR /usr/src/app
COPY package.json package-lock.json ./

# FROM base AS build
# RUN npm install
# COPY . .
# RUN ls
# RUN npm run build

# FROM base AS run
# EXPOSE 3000
# RUN npm install --production
# COPY --from=build /usr/src/app/dist/ ./
# CMD npm start
