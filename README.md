# PersonalChef

## GitHub Pages deployment

This repository is configured for the simplest GitHub Pages project-site setup:

- In **Settings → Pages**, choose **Deploy from a branch**.
- Set **Branch** to `main`.
- Set **Folder** to `/docs`.
- The live project-site URL will be `https://<your-github-username>.github.io/PersonalChef/`.

The production-ready static site is built directly into `docs/`, including `docs/index.html` and `docs/.nojekyll`, so GitHub Pages can serve the site as a plain static project site from the `main` branch.
