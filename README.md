# Galetus Rosarinho

Cardápio digital do Galetus Rosarinho.

## Estrutura

- `index.html`: versão principal do cardápio.
- `fotos/`: fotos novas usadas como fundo das categorias do cardápio.
- `assets/galetus/`: imagens otimizadas usadas pela versão principal.
- `docs/index.html`: versão publicada pelo GitHub Pages.
- `docs/fotos/`: cópia das fotos de categoria usada pelo deploy.
- `docs/assets/galetus/`: imagens otimizadas usadas pelo deploy.
- `docs/.nojekyll`: evita processamento do Jekyll no Pages.
- `.github/workflows/deploy-galetus-pages.yml`: workflow de deploy.

## Publicação

O site é estático e é publicado no GitHub Pages a partir da pasta `docs/`.
