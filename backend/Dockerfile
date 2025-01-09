FROM node:21-alpine
RUN apk add -U dumb-init python3

WORKDIR /app/backend
COPY package.json .
RUN npm install
COPY ../shared /app/shared
COPY . /app/backend
RUN npm run build
COPY src/database/migrations dist/migrations

EXPOSE 3000
ENTRYPOINT ["dumb-init", "--"]
ENV SERVE_STATIC=/app/web
CMD ["node", "dist/main.js"]
