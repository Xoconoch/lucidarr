# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Install the dependencies
COPY package.json ./

RUN npm install

# Copy the rest of the application source code into the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 3030

# Set the command to start the server
CMD ["node", "backend/index.js"]
