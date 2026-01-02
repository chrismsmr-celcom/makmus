import './styles/main.css';
import { supabase } from './lib/supabase';
import { router } from './lib/router';
import { authStore } from './stores/authStore';

async function init() {
  await authStore.init();

  const app = document.getElementById('app');

  router.on('/', () => import('./pages/Home').then(m => m.renderHome(app)));
  router.on('/article/:id', (params) => import('./pages/Article').then(m => m.renderArticle(app, params.id)));
  router.on('/profile', () => import('./pages/Profile').then(m => m.renderProfile(app)));
  router.on('/bookmarks', () => import('./pages/Bookmarks').then(m => m.renderBookmarks(app)));
  router.on('/login', () => import('./pages/Auth').then(m => m.renderLogin(app)));
  router.on('/signup', () => import('./pages/Auth').then(m => m.renderSignup(app)));

  router.resolve();
}

init();
