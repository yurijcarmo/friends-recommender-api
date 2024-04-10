FROM node:21.7.2-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

RUN npm prune --production

FROM node:21.7.2-alpine

WORKDIR /app

COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/.env /app/.env
COPY --from=build /app/package.json /app/package.json

ENTRYPOINT [ "node" ]
CMD [ "dist/main.js" ]

EXPOSE 3000
