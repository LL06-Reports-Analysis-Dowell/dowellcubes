# Specify the base image
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Install dependencies including vite
RUN npm install -g vite

# Copy the rest of the code
COPY . .

# Expose the port the app runs on
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev"]