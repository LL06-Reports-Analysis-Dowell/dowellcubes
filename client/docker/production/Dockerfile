FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

# Install dependencies including vite
RUN npm install -g vite

COPY . .

# Build the app for production
RUN npm run build

# Install serve to serve the built files
RUN npm install -g serve

EXPOSE 5173

# Serve the built files
CMD ["serve", "-s", "dist", "-l", "5173"]