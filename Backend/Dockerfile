FROM node:latest

WORKDIR /thoughtful

#ENV SECRET_NAME=*****
# import from env?

# server port
EXPOSE 8080

# copy local files
COPY . .

# install server dependencies and run server
RUN npm install --silent

CMD ["npm", "start"]