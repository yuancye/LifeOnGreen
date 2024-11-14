# FROM node:20-alpine
# LABEL authors="yuanchaoye"
# WORKDIR /app

# RUN apk add --no-cache --virtual .build-deps build-base python3
# # Copy the package.json and package-lock.json (or yarn.lock) to install dependencies
# COPY package*.json ./

# # Install dependencies
# RUN npm install --only=production
# RUN npm install --build-from-source sqlite3

# COPY . .

# EXPOSE 8000

# ENV DB_PATH=/app/fp.db

# CMD ["npm", "start"]

# RUN apk del .build-deps



FROM node:latest

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Expose the desired port (e.g., 3000)
EXPOSE 8000

ENV DB_PATH=/app/fp.db

# Start the app
CMD ["npm", "start"]
