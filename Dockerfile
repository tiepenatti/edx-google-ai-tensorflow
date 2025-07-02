# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Install wget, unzip
RUN apk add --no-cache wget unzip

# Set the working directory in the container
WORKDIR /app

# Download and extract the repository
RUN wget https://github.com/tiepenatti/edx-google-ai-tensorflow/archive/refs/heads/main.zip -O repo.zip && \
    unzip repo.zip && \
    mv edx-google-ai-tensorflow-main/* . && \
    rm -rf edx-google-ai-tensorflow-main repo.zip

# ---
# Copy files from localhost to patch the repo for testing. 
# (eg file build is failing, you suspect the reason is some changes on package.json,
# update it on your localhost, then uncomment the copy command below to override the
# current version on repo)
#COPY package.json ./
#RUN rm -f src/types/exercise.ts
#COPY src/types/Exercise.ts ./src/types
# ---

#RUN echo "Debugging list of files. Build with --progress=plain to see output (eg 'docker build --progress=plain -t edx-google-ai-tensorflow .')."
#RUN ls -laR src/types

# Install any needed packages
RUN npm install

# Creates a "dist" directory with the production build
RUN npm run build

# The container will not be run, so no CMD is needed
