# 1. On utilise une version stable de Node
FROM node:20

# 2. On crée le dossier de l'application dans le container
WORKDIR /usr/src/app

# 3. On copie les fichiers de dépendances
COPY package*.json ./

# 4. On installe les outils
RUN npm install

# 5. On copie tout le reste du code (server.js, dossier public, etc.)
COPY . .

# 6. On expose le port (Render utilise souvent 10000 par défaut ou ce que tu définis)
EXPOSE 3000

# 7. La commande pour lancer le journal
CMD [ "node", "server.js" ]
