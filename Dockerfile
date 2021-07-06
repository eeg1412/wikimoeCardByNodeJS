FROM node:12

WORKDIR /app

COPY . .

RUN npm install
RUN cd client && npm install
RUN cd client && npm run build

EXPOSE 3000
CMD [ "npm", "start" ]