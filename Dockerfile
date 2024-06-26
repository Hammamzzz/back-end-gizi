FROM node:18.17.1
WORKDIR /app
COPY package.json ./
ENV PORT 3000
COPY . .
RUN npm install
EXPOSE 3000
CMD [ "npm", "run", "start"]