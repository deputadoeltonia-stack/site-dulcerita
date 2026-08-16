#!/bin/sh
# Sincroniza a Colinha Digital para dentro do site (pasta colinha/).
# Fonte da verdade: ~/Projetos/colinha-digital — qualquer mudança lá
# (ex.: dataset 2026 via build/importar_tse.py + importar_fotos.py)
# entra no site rodando este script de novo.
# O hostname do site (site-dulcerita.vercel.app) resolve o tema da Dulce
# por alias no colinha-core.js — nada a configurar aqui.
# fotos/ vai no git: o deploy é por push, gitignorar daria 404.
set -e
SRC="$HOME/Projetos/colinha-digital"
DST="$(cd "$(dirname "$0")/.." && pwd)/colinha"

rsync -a --delete \
  --include='index.html' --include='style.css' \
  --include='app.js' --include='busca.js' --include='colinha-core.js' --include='imagem.js' \
  --include='candidatos-sp.json' \
  --include='fonts/***' --include='marca/***' --include='fotos/***' \
  --exclude='*' \
  "$SRC/" "$DST/"

echo "colinha sincronizada em $DST"
