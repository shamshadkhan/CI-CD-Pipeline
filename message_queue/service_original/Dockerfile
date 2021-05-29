FROM node:7
WORKDIR /original
COPY package-lock.json /original
COPY package.json /original
COPY service_original.js /original
COPY wait-for-it.sh /original
RUN chmod +x /original/wait-for-it.sh
RUN npm install
RUN ls /original
