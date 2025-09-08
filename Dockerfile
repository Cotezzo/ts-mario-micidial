# TODO: use ARG as parameters - ARG BUILD_DIRECTORY=/app
# TODO: use ARG as parameters - ARG DEPLOY_DIRECTORY=/usr/local/lib

# Use an official Node runtime as a parent image
FROM node:20.18.1

#COPY --from=mwader/static-ffmpeg:7.1.1 /ffmpeg /usr/local/bin/

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy necessary directory contents into the container
COPY . .

# Install dependencies and build /dist to be run with "npm start";
# after building, dev dependancies and source are no longer needed - delete
RUN npm install &&\
    #npm test &&\
    #rm -rf test &&\
    #rm -rf .env-test &&\
    npm run build &&\
    rm -rf src &&\
    rm -rf tsconfig.json &&\
    npm prune --production

CMD ["npm", "run", "start"]