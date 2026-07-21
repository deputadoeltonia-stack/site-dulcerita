(function () {
  "use strict";

  // Destino dos leads. Vazio = modo demo (nada sai do browser).
  // Quando conectar: URL do Apps Script /exec, mesmo padrão do evento-fotos.
  const LEAD_ENDPOINT = "";

  /* ---------- máscara de telefone BR ---------- */
  const telefone = document.getElementById("telefone");
  telefone.addEventListener("input", function () {
    const d = this.value.replace(/\D/g, "").slice(0, 11);
    let out = d;
    if (d.length > 2) out = "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length > 6) {
      const corte = d.length === 11 ? 7 : 6;
      out = "(" + d.slice(0, 2) + ") " + d.slice(2, corte) + "-" + d.slice(corte);
    }
    this.value = out;
  });

  /* ---------- formulário ---------- */
  const form = document.getElementById("form-lead");
  const retorno = document.getElementById("form-retorno");

  function avisar(msg, ok) {
    retorno.textContent = msg;
    retorno.className = "form-retorno " + (ok ? "ok" : "erro");
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();

    // honeypot: bot preencheu → finge sucesso, descarta
    if (form.site.value) {
      avisar("Recebido! Obrigada por participar.", true);
      form.reset();
      return;
    }

    const nome = form.nome.value.trim();
    const fone = form.telefone.value.replace(/\D/g, "");

    if (nome.length < 2) return avisar("Escreva seu nome, por favor.", false);
    if (fone.length < 10 || fone.length > 11) return avisar("Telefone incompleto. Use DDD + número.", false);
    if (!form.lgpd.checked) return avisar("Precisamos da sua autorização para contato.", false);

    const botao = form.querySelector("button[type=submit]");
    botao.disabled = true;

    if (!LEAD_ENDPOINT) {
      // modo demo: simula gravação
      setTimeout(function () {
        avisar("Recebido! A equipe da Dulce fala com você em breve.", true);
        form.reset();
        botao.disabled = false;
      }, 600);
      return;
    }

    fetch(LEAD_ENDPOINT, {
      method: "POST",
      // text/plain evita preflight CORS no Apps Script
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ nome: nome, telefone: fone, consentimento: true }),
    })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        avisar("Recebido! A equipe da Dulce fala com você em breve.", true);
        form.reset();
      })
      .catch(function () {
        avisar("Não conseguimos enviar agora. Tente de novo ou chame no WhatsApp.", false);
      })
      .finally(function () {
        botao.disabled = false;
      });
  });

  /* ---------- CTA fixo: some quando o formulário está na tela ---------- */
  const ctaFixo = document.getElementById("cta-fixo");
  const secaoForm = document.getElementById("participar");

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      function (entradas) {
        ctaFixo.classList.toggle("escondido", entradas[0].isIntersecting);
      },
      { threshold: 0.15 }
    ).observe(secaoForm);

    /* ---------- revelação suave das seções ---------- */
    // threshold 0: blocos mais altos que a viewport nunca atingiriam uma fração fixa
    const revelador = new IntersectionObserver(
      function (entradas, obs) {
        entradas.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("visivel");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" }
    );

    // #propostas .miolo fica de fora: transform de ancestral quebraria o
    // position:sticky dos eixos que empilham no mobile
    document
      .querySelectorAll(".secao:not(#propostas) .miolo, .depo, .cartao")
      .forEach(function (el) {
        el.classList.add("revela");
        revelador.observe(el);
      });

    // failsafe: reveal nunca pode ser o que torna o conteúdo visível;
    // se o observer não disparar, tudo aparece mesmo assim
    setTimeout(function () {
      document.querySelectorAll(".revela").forEach(function (el) {
        el.classList.add("visivel");
      });
    }, 3000);
  }
})();
