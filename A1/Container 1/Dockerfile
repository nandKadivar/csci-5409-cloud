FROM node:alpine
COPY . /application
WORKDIR /application
EXPOSE 6000
RUN npm install
CMD ["node","index.js"]