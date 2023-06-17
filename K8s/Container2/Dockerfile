FROM node:alpine
COPY . /application
WORKDIR /application
EXPOSE 7000
RUN npm install
CMD ["node","index.js"]