# MAKMUS App

Application moderne de lecture d'actualités avec fonctionnalités sociales.

## Fonctionnalités

- **Lecture d'articles** : Navigation par catégories et recherche
- **Authentification** : Inscription et connexion sécurisées avec Supabase
- **Favoris** : Enregistrez vos articles préférés
- **Commentaires** : Interagissez avec la communauté
- **Profil utilisateur** : Gérez vos informations personnelles
- **PWA** : Installable et fonctionne hors ligne
- **Responsive** : Optimisé pour mobile, tablette et desktop

## Technologies

- **Frontend** : Vanilla JS, Vite
- **Backend** : Supabase (PostgreSQL, Auth, RLS)
- **PWA** : Service Workers avec Workbox
- **API** : NewsData.io pour les actualités

## Installation

1. Clonez le dépôt :
```bash
cd app
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez les variables d'environnement :
```bash
cp .env.example .env
```

Remplissez le fichier `.env` avec vos clés Supabase :
- `VITE_SUPABASE_URL` : URL de votre projet Supabase
- `VITE_SUPABASE_ANON_KEY` : Clé anonyme de votre projet

4. Lancez le serveur de développement :
```bash
npm run dev
```

5. Buildez pour la production :
```bash
npm run build
```

## Structure du projet

```
app/
├── src/
│   ├── components/      # Composants réutilisables
│   │   ├── Header.js
│   │   ├── ArticleCard.js
│   │   └── CategoryNav.js
│   ├── pages/          # Pages de l'application
│   │   ├── Home.js
│   │   ├── Article.js
│   │   ├── Auth.js
│   │   ├── Profile.js
│   │   └── Bookmarks.js
│   ├── lib/            # Utilitaires et configuration
│   │   ├── supabase.js
│   │   └── router.js
│   ├── stores/         # Gestion d'état
│   │   └── authStore.js
│   ├── styles/         # CSS global
│   │   └── main.css
│   └── main.js         # Point d'entrée
├── index.html
├── vite.config.js
└── package.json
```

## Base de données

L'application utilise Supabase avec les tables suivantes :

- `user_profiles` : Profils utilisateurs
- `articles` : Articles d'actualités
- `bookmarks` : Articles favoris
- `comments` : Commentaires sur les articles

Les migrations sont automatiquement appliquées. Assurez-vous que RLS est activé pour toutes les tables.

## Déploiement

L'application peut être déployée sur :
- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages

N'oubliez pas de configurer les variables d'environnement dans votre plateforme de déploiement.

## Sécurité

- Row Level Security (RLS) activé sur toutes les tables
- Authentification gérée par Supabase Auth
- Validation des données côté serveur et client
- Protection CSRF intégrée

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## Licence

MIT

## Support

Pour toute question, contactez : contact@makmus.com
