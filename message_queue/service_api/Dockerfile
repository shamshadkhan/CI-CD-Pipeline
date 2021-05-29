FROM node:7
WORKDIR /api
COPY package-lock.json /api
COPY package.json /api
COPY service_api.js /api
COPY index.html /api
COPY wait-for-it.sh /api
RUN chmod +x /api/wait-for-it.sh
RUN npm install
RUN ls -la /api
