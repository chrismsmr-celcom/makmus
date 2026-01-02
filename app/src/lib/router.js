class Router {
  constructor() {
    this.routes = [];
    window.addEventListener('popstate', () => this.resolve());
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-link]')) {
        e.preventDefault();
        this.navigate(e.target.getAttribute('href'));
      }
    });
  }

  on(path, handler) {
    this.routes.push({ path, handler });
  }

  navigate(path) {
    window.history.pushState({}, '', path);
    this.resolve();
  }

  async resolve() {
    const path = window.location.pathname;

    for (const route of this.routes) {
      const regex = new RegExp('^' + route.path.replace(/:\w+/g, '([^/]+)') + '$');
      const match = path.match(regex);

      if (match) {
        const params = {};
        const keys = route.path.match(/:\w+/g) || [];
        keys.forEach((key, i) => {
          params[key.slice(1)] = match[i + 1];
        });

        await route.handler(params);
        return;
      }
    }

    this.navigate('/');
  }
}

export const router = new Router();
