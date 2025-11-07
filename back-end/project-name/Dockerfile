FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build Nest en mode prod
RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start:prod"]
