FROM node:20
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# On s'assure que le serveur peut voir les fichiers du dessus si nécessaire
EXPOSE 3000
CMD [ "node", "server.js" ]
