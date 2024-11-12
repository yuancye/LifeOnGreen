FROM node:20-alpine
LABEL authors="yuanchaoye"
WORKDIR /app

RUN apk add --no-cache --virtual .build-deps build-base python3
# Copy the package.json and package-lock.json (or yarn.lock) to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install --only=production
RUN npm install --build-from-source sqlite3

COPY . .

EXPOSE 8000

ENV DB_PATH=/app/fp.db

CMD ["node", "app.js"]

RUN apk del .build-deps