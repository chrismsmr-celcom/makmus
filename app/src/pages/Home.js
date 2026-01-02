import { Header, initHeader } from '../components/Header';
import { ArticleCard } from '../components/ArticleCard';
import { CategoryNav } from '../components/CategoryNav';
import { supabase } from '../lib/supabase';

const API_KEY = "pub_4e1227be068d43c7b03da109494a3907";
let currentCategory = 'all';

export async function renderHome(app) {
  app.innerHTML = `
    ${Header()}
    ${CategoryNav(currentCategory)}
    <main class="home-page">
      <div class="container">
        <div id="articlesContainer" class="loading">
          <div class="spinner"></div>
        </div>
      </div>
    </main>

    <style>
      .home-page {
        min-height: calc(100vh - 150px);
        padding: var(--spacing-lg) 0;
      }

      #articlesContainer {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: var(--spacing-lg);
      }

      @media (max-width: 768px) {
        #articlesContainer {
          grid-template-columns: 1fr;
        }
      }
    </style>
  `;

  initHeader();
  await loadArticles();
  initCategoryNav();
}

async function loadArticles() {
  const container = document.getElementById('articlesContainer');

  try {
    const { data: articles, error } = await supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(24);

    if (error) throw error;

    if (articles && articles.length > 0) {
      renderArticles(articles);
    } else {
      await fetchFromAPI();
    }
  } catch (error) {
    console.error('Error loading articles:', error);
    await fetchFromAPI();
  }
}

async function fetchFromAPI() {
  const container = document.getElementById('articlesContainer');

  try {
    const categoryParam = currentCategory === 'all' ? '' : `&category=${currentCategory}`;
    const response = await fetch(
      `https://newsdata.io/api/1/latest?apikey=${API_KEY}&language=fr${categoryParam}`
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const articlesData = data.results
        .filter(a => a.title && a.image_url)
        .map(a => ({
          title: a.title,
          description: a.description || '',
          content: a.content || a.description || '',
          image_url: a.image_url,
          category: a.category?.[0] || 'news',
          author: a.source_id || 'MAKMUS',
          source_url: a.link,
          published_at: a.pubDate || new Date().toISOString()
        }));

      for (const article of articlesData) {
        try {
          await supabase.from('articles').insert(article);
        } catch (error) {
          console.error('Error saving article:', error);
        }
      }

      const { data: savedArticles } = await supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(24);

      if (savedArticles) {
        renderArticles(savedArticles);
      }
    } else {
      container.innerHTML = '<p>Aucun article disponible pour le moment.</p>';
    }
  } catch (error) {
    console.error('Error fetching from API:', error);
    container.innerHTML = '<p>Erreur lors du chargement des articles.</p>';
  }
}

function renderArticles(articles) {
  const container = document.getElementById('articlesContainer');
  container.innerHTML = articles.map(article => ArticleCard(article)).join('');
}

function initCategoryNav() {
  const categoryButtons = document.querySelectorAll('.category-btn');
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      currentCategory = btn.dataset.category;

      categoryButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const container = document.getElementById('articlesContainer');
      container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

      if (currentCategory === 'all') {
        await loadArticles();
      } else {
        const { data: articles } = await supabase
          .from('articles')
          .select('*')
          .eq('category', currentCategory)
          .order('published_at', { ascending: false })
          .limit(24);

        if (articles && articles.length > 0) {
          renderArticles(articles);
        } else {
          await fetchFromAPI();
        }
      }
    });
  });
}
