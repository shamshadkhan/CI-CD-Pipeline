FROM node:7
WORKDIR /observer
COPY package-lock.json /observer
COPY package.json /observer
COPY service_observer.js /observer
COPY wait-for-it.sh /observer
RUN chmod +x /observer/wait-for-it.sh
RUN npm install
RUN ls /observer
