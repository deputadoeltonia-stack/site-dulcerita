# Spec — site-dulcerita (MVP apresentação)

Site institucional de campanha da Vereadora Dulce Rita (São José dos Campos).
MVP para apresentação: visual caprichado, backend mínimo.

## Decisões fechadas

- **Lead storage**: modo demo. `LEAD_ENDPOINT = ""` em js/main.js → form simula
  sucesso, nada sai do browser. Formato do POST já compatível com Apps Script
  (mesmo padrão evento-fotos) para conectar depois.
- **Conteúdo**: placeholder bem escrito (bio, propostas, depoimentos), marcado
  para troca fácil. Nome real: Dulce Rita, SJC.
- **Visual**: direção própria proposta na fase frontend-design. Fugir de clichê
  político (azul genérico). Paleta séria + calor, serif de personalidade.
- **Deploy**: Netlify drag-drop, link netlify.app. Domínio próprio fora do MVP.
- **Extras aprovados**: timeline de trajetória, CTA fixo mobile, aviso LGPD no
  form, redes sociais/WhatsApp no rodapé. Mobile-first obrigatório.

## Stack

HTML/CSS/JS puro, zero build, zero dependência. Mesmo esqueleto do site-tozi.

```
index.html          one-page, âncoras
css/style.css
js/main.js          LEAD_ENDPOINT="" → modo demo
public/assets/      foto oficial (aguardando arquivo do usuário)
```

## Seções (ordem)

1. **Hero** — foto oficial + nome + cidade + frase de posicionamento + CTA.
2. **Quem sou eu** — bio + timeline de trajetória (4-5 marcos).
3. **Propostas** — 6 cards em 3 eixos temáticos (placeholder).
4. **Depoimentos e fotos** — 4 depoimentos fictícios + grade de fotos
   placeholder (blocos com legenda até ter foto real).
5. **Quero participar** — form nome + telefone (máscara BR), checkbox LGPD
   obrigatório com finalidade e direito de exclusão.
6. **Rodapé** — ícones sociais + WhatsApp (links `#`), texto legal de campanha.

CTA fixo: barra flutuante "Quero participar" no mobile; some quando form visível.

## Form — segurança

- Validação client-side: nome não-vazio, telefone 10-11 dígitos.
- Honeypot anti-bot (campo invisível).
- Checkbox LGPD `required` — consentimento explícito.
- Validação real do lado servidor fica no Apps Script quando conectar (fora do MVP).
- Nenhum dado pessoal em URL/query string.

## Validação e entrega

Rodar no browser (375px mobile + desktop), testar form demo, impeccable para
polir, code-review focado no form. Pasta pronta para drag-drop no Netlify.

## Fora do escopo

Endpoint real de lead, fotos reais, domínio próprio, analytics.
