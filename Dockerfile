FROM node:16

RUN mkdir -p /app
WORKDIR /app
COPY package*.json /app/
COPY . /app
RUN npm install 

ENV NODE_ENV development
ENV TZ=Asia/Seoul 
EXPOSE 80

CMD ["npm", "start"]