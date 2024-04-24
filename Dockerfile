FROM node:21.7.2-alpine AS build

WORKDIR /app

COPY package*.json ./

USER root
RUN npm install

COPY . .
RUN npm run build

RUN npm cache clean --force

EXPOSE 3000

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["node"]
CMD ["dist/main.js"]
