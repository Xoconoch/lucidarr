# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Install the dependencies
COPY package.json ./

RUN npm install

# Copy the rest of the application source code into the working directory
COPY backend ./backend
COPY config ./config
COPY dist ./dist
COPY public ./public
COPY tsconfig.json ./



# Expose the port the app runs on
EXPOSE 3030

# Set the command to start the server
CMD ["node", "backend/index.js"]
