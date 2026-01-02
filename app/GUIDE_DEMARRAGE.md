# Guide de Démarrage Rapide - MAKMUS App

## Configuration de Supabase

Votre base de données Supabase est déjà configurée avec les tables nécessaires. Il vous reste à configurer les clés d'accès.

### 1. Récupérer vos clés Supabase

1. Connectez-vous à [supabase.com](https://supabase.com)
2. Ouvrez votre projet
3. Allez dans **Settings** > **API**
4. Copiez :
   - **Project URL** (exemple : `https://xxxxx.supabase.co`)
   - **anon public** key (commence par `eyJ...`)

### 2. Configurer l'application

Éditez le fichier `app/.env` et remplacez les valeurs :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anon_ici
```

### 3. Lancer l'application

```bash
cd app
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## Structure de la base de données

### Tables créées :

1. **user_profiles** : Profils utilisateurs
   - username, avatar_url, bio

2. **articles** : Articles d'actualités
   - title, description, content, image_url, category, author

3. **bookmarks** : Articles favoris des utilisateurs
   - Lien entre user_id et article_id

4. **comments** : Commentaires sur les articles
   - content, article_id, user_id

### Row Level Security (RLS)

Toutes les tables ont RLS activé avec des politiques sécurisées :
- Les profils sont publics en lecture, modifiables par leur propriétaire
- Les articles sont publics en lecture
- Les favoris et commentaires sont gérés par leur propriétaire

## Fonctionnalités

### Pour les visiteurs :
- Parcourir les articles par catégorie
- Lire les articles complets
- Voir les commentaires

### Pour les utilisateurs connectés :
- Enregistrer des articles en favoris
- Commenter les articles
- Gérer son profil
- Voir ses statistiques

## Déploiement

### Option 1 : Vercel

```bash
npm install -g vercel
vercel
```

### Option 2 : Netlify

```bash
npm run build
# Glissez le dossier dist/ sur netlify.com
```

N'oubliez pas de configurer les variables d'environnement dans votre plateforme de déploiement.

## Personnalisation

### Modifier les catégories

Éditez `src/components/CategoryNav.js` pour ajouter/modifier les catégories.

### Changer les couleurs

Éditez les variables CSS dans `src/styles/main.css` :

```css
:root {
  --primary: #111;
  --accent: #e63946;
  /* etc. */
}
```

### API NewsData.io

L'application utilise l'API NewsData.io pour récupérer les articles. La clé est déjà configurée dans le code, mais vous pouvez la remplacer par la vôtre dans `src/pages/Home.js`.

## Support

Si vous avez des questions :
- Email : contact@makmus.com
- Documentation Supabase : [supabase.com/docs](https://supabase.com/docs)

## Améliorations futures possibles

- Notifications push
- Partage sur réseaux sociaux
- Mode sombre
- Multi-langues
- Recommandations personnalisées
- Système de likes sur les commentaires
- Recherche avancée
- Flux RSS

Bonne utilisation de votre application MAKMUS !
