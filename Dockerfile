# node
FROM node

# Set the working directory to /public
WORKDIR /public/server

COPY package*.json ./

# Install any needed node dependencies
RUN npm install
# Bundle app source
COPY . .
# Make port 80 available to world outside this container
EXPOSE 3009

# Run app.py when the container launches
# CMD run server
CMD ["npm", "run", "start"]