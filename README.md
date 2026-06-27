# mohamed-seyam.github.io

Personal portfolio of **Mohamed Seyam** — AI Engineer. Built with **React + Vite** and deployed to GitHub Pages.

## Tech stack

- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/)
- Plain CSS (light theme, no UI framework)

## Develop locally

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build into dist/
npm run preview  # preview the production build locally
```

## Editing content

All text — experience, projects, skills, blogs, publications, education — lives in
[`src/data/portfolio.js`](src/data/portfolio.js). Edit that file and the whole site updates.

Images live in [`public/assets/images/`](public/assets/images/).

## Deployment

Every push to `main` triggers the workflow in
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the
site and publishes it to GitHub Pages.

**One-time setup:** in the repository, go to **Settings → Pages → Build and deployment**
and set **Source** to **GitHub Actions**.

The original static HTML site is preserved under [`legacy/`](legacy/) for reference.
