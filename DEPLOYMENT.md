# Guide de Déploiement - MAKMUS App

## Erreurs Corrigées

### Erreur : `package.json` manquant au déploiement
- **Cause** : Le projet a une structure monorepo avec l'app dans le dossier `app/`, mais aucun `package.json` à la racine
- **Solution** : Création d'un `package.json` à la racine qui orchestre les builds

## Préparation au Déploiement

### 1. Variables d'Environnement

Avant de déployer, configurez vos variables Supabase sur votre plateforme :

- `VITE_SUPABASE_URL` : https://votre-projet.supabase.co
- `VITE_SUPABASE_ANON_KEY` : Votre clé anon depuis Supabase

### 2. Build Local

Testez le build localement :
```bash
npm run build
```

Vous devriez voir le dossier `app/dist/` créé avec la build Vite et les fichiers PWA.

## Déploiement sur Vercel

### Option 1 : Interface Web

1. Allez sur [vercel.com](https://vercel.com)
2. Importez votre dépôt Git
3. Configuration automatique avec `vercel.json`
4. Ajoutez les variables d'environnement dans "Settings" > "Environment Variables"
5. Deploy

### Option 2 : CLI

```bash
npm install -g vercel
vercel
```

## Déploiement sur Netlify

### Option 1 : Interface Web

1. Allez sur [netlify.com](https://netlify.com)
2. Connectez votre dépôt Git
3. Configuration automatique avec `netlify.toml`
4. Ajoutez les variables d'environnement dans "Site settings" > "Build & deploy" > "Environment"
5. Deploy

### Option 2 : Drag & Drop

```bash
npm run build
# Glissez le dossier app/dist/ sur netlify.com
```

## Déploiement sur Cloudflare Pages

1. Créez un nouveau projet Pages sur Cloudflare
2. Connectez votre dépôt Git
3. Configurez :
   - **Build command**: `npm run build`
   - **Build output directory**: `app/dist`
   - **Node.js version**: 22.x
4. Ajoutez les variables d'environnement
5. Deploy

## Déploiement sur GitHub Pages

1. Modifiez `app/vite.config.js` :
   ```javascript
   export default defineConfig({
     base: '/votre-repo-name/',
     // ...
   });
   ```

2. Créez `.github/workflows/deploy.yml` :
   ```yaml
   name: Build and Deploy
   on:
     push:
       branches: [main]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: actions/setup-node@v2
           with:
             node-version: '22.x'
         - run: npm install
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./app/dist
   ```

## Dépannage

### Build échoue avec erreur `ENOENT`
- Assurez-vous que vous avez un `package.json` à la racine du projet
- Vérifiez que `app/package.json` existe aussi
- Lancez `npm install` depuis la racine

### Variables d'environnement non reconnues
- Vérifiez les noms : `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
- Assurez-vous que le préfixe `VITE_` est présent (exigence de Vite)
- Redéployez après avoir ajouté les variables

### Build réussit localement mais échoue en déploiement
- Vérifiez que Node.js version 22.x est utilisée
- Vérifiez la version de npm (10.9.4+)
- Nettoyez le cache de la plateforme de déploiement

## Fichiers de Configuration

- **vercel.json** : Configuration pour Vercel
- **netlify.toml** : Configuration pour Netlify
- **package.json** (racine) : Orchestre les builds
- **app/vite.config.js** : Configuration de Vite et PWA

## Performance en Production

L'application inclut :
- Gzip compression activée
- CSS minifié (2.33 kB → 0.91 kB gzip)
- Code splitting automatique
- Service Workers pour caching
- PWA optimisée pour offline

Taille totale : ~46 KB gzip

## Sécurité

- Toutes les requêtes API passent par Supabase
- Row Level Security (RLS) activé
- CORS configuré
- Pas de secrets exposés en client

## Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs de build de votre plateforme
2. Consultez la documentation de Vite : https://vitejs.dev/
3. Vérifiez les docs Supabase : https://supabase.com/docs
4. Contactez : contact@makmus.com
