# From node docker image
FROM node:13.12.0-alpine

# Set working directory
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

# Install app dependencies
COPY package.json ./
COPY package-lock.json ./

RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

# Copy app
COPY . ./

# start app
CMD ["npm", "start"]
