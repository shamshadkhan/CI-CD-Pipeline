FROM node:7
WORKDIR /httpserv
COPY package-lock.json /httpserv
COPY package.json /httpserv
COPY service_httpserv.js /httpserv
RUN ls /
CMD ["node","service_httpserv.js"]
