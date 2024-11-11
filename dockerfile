FROM node:20-alpine
LABEL authors="yuanchaoye"
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

COPY . .

EXPOSE 8000

ENV DB_PATH=/app/fp.db

CMD ["node", "app.js"]