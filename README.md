# Hospedaris — site

Site de página única da Hospedaris (gestão profissional de hospedagem por temporada). HTML, CSS e JavaScript puros, sem build. Fontes (Instrument Serif e DM Sans) carregadas do Google Fonts.

## Arquivos
- `index.html`: o site inteiro (estilo e script embutidos)
- `favicon.svg`, `robots.txt`, `sitemap.xml`, `.nojekyll`
- `apps-script/Code.gs`: código que recebe o formulário, grava na planilha e avisa por e-mail

## Publicar no GitHub Pages
1. Crie um repositório (ex.: `hospedaris-site`) e envie estes arquivos na raiz.
2. Em **Settings > Pages**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`. Salve.
3. O site abre em `https://SEU-USUARIO.github.io/hospedaris-site/`.

## Domínio hospedaris.com.br
1. Em **Settings > Pages > Custom domain**, informe `hospedaris.com.br` e salve (o GitHub cria o arquivo `CNAME`).
2. No DNS do domínio, crie quatro registros **A** para o domínio raiz (`@`): `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
3. Crie um registro **CNAME** para `www` apontando para `SEU-USUARIO.github.io`.
4. Aguarde a propagação, volte em Settings > Pages e marque **Enforce HTTPS**.

Se o domínio já tem e-mail configurado (contato@hospedaris.com.br), não apague os registros MX e TXT existentes.

## Formulário de avaliação
O formulário envia para uma planilha do Google e para contato@hospedaris.com.br.
1. Crie uma planilha, abra Extensões > Apps Script e cole o conteúdo de `apps-script/Code.gs`.
2. Implantar > Nova implantação > App da Web. Executar como: **Eu**. Acesso: **Qualquer pessoa**. Copie a URL que termina em `/exec`.
3. No `index.html`, localize `var ENDPOINT='';` (final do arquivo) e cole a URL entre as aspas.
4. Publique e faça um envio de teste. Sem o ENDPOINT, o botão apenas monta uma mensagem para o visitante copiar.

## Antes de divulgar
- WhatsApp corporativo: hoje aparece "em breve" na seção de contato. Quando ativar, trocar por link `https://wa.me/55DDDNUMERO`.
- Política de privacidade (LGPD) e termos: escrever e linkar no rodapé.
- Imagem de compartilhamento (`og:image`) e fotos reais dos imóveis e das cidades: ainda não existem.
- Valores e condições comerciais não aparecem no site, por decisão: são apresentados na avaliação.
