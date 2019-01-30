# Base image, LTS version of node
FROM node:8

# Create working app directory
WORKDIR /usr/src/app

# Copy package*.json files for installing dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source code to the image
COPY . .

# Expose the working port
EXPOSE 3000

# Run the app
CMD ["npm", "start"]