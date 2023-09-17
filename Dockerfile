# Use the official Node.js 16 image as a parent image
FROM node:16 as builder

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies in the container
RUN npm install

# Copy the entire project to the container (except what's ignored in .dockerignore)
COPY . .

# Compile the TypeScript code to JavaScript
RUN npm run build

# Start a new stage
FROM node:16

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy over compiled JS files and node_modules from the previous stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

# Expose port 3000 in the container (this is the default port for NestJS)
EXPOSE 3000

# Specify the command to run when the container starts
CMD ["npm", "run", "start:prod"]
