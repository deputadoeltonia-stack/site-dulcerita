(function () {
  "use strict";

  // Destino dos leads. Vazio = modo demo (nada sai do browser).
  // Quando conectar: URL do Apps Script /exec, mesmo padrão do evento-fotos.
  const LEAD_ENDPOINT = "https://script.google.com/macros/s/AKfycbyBdY45weHbgTSWLBt0ymfRSHPmz4vHVGdEiu13T3o3yGejT36JiGPauMrxmv-vRz-j/exec";

  // Mesma planilha dos sites do Dr. Elton e do Tozi; `origem` e o campo que
  // manda o lead para a aba "Pagina Dulce" em vez da aba padrao.
  const LEAD_ORIGEM = "site-dulcerita";

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
      body: JSON.stringify({ nome: nome, telefone: fone, consentimento_lgpd: true, origem: LEAD_ORIGEM }),
    })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        // O Apps Script responde 200 mesmo recusando o lead ({ok:false}).
        return r.text().then(function (t) {
          try {
            const j = JSON.parse(t);
            if (j && j.ok === false) throw new Error(j.msg || "recusado");
          } catch (e) {
            if (e instanceof SyntaxError) return;  // corpo opaco: 200 ja basta
            throw e;
          }
        });
      })
      .then(function () {
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

  /* ---------- CTA fixo: some quando já existe um CTA na tela ----------
     São dois: os botões do hero (na dobra) e o formulário. Observando só o
     formulário, o CTA fixo nascia visível por cima do rosto da foto,
     duplicando o botão que já estava a um dedo de distância. */
  const ctaFixo = document.getElementById("cta-fixo");
  const secaoForm = document.getElementById("participar");
  const ctasNaPagina = [document.querySelector(".hero-acoes"), secaoForm].filter(Boolean);

  if ("IntersectionObserver" in window) {
    const ctasVisiveis = new Set();
    const observadorCta = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (e) {
          if (e.isIntersecting) ctasVisiveis.add(e.target);
          else ctasVisiveis.delete(e.target);
        });
        ctaFixo.classList.toggle("escondido", ctasVisiveis.size > 0);
      },
      { threshold: 0.15 }
    );
    // começa escondido: o observer só responde no frame seguinte e sem isso
    // o botão pisca sobre o hero. Fora deste if (sem IO) ele fica sempre visível.
    ctaFixo.classList.add("escondido");
    ctasNaPagina.forEach(function (alvo) { observadorCta.observe(alvo); });

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

    // #propostas e #depoimentos ficam de fora: transform de ancestral
    // quebraria o position:sticky dos empilhamentos (eixos e depoimentos).
    // .depo também sai — a entrada dele agora é o próprio empilhado sticky.
    document
      .querySelectorAll(".secao:not(#propostas):not(#depoimentos) .miolo, .cartao, .video-item, .galeria-item")
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

  /* ---------- parallax do padrão de pessoinhas ----------
     Camadas [data-parallax] deslizam a uma fração da rolagem, na direção
     contrária, criando profundidade entre o padrão e o conteúdo.
     Só transform (compositor), atualizado 1x por frame via rAF. */
  const camadasParallax = document.querySelectorAll("[data-parallax]");
  const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (camadasParallax.length && !semMovimento.matches) {
    let aguardandoFrame = false;

    function aplicarParallax() {
      aguardandoFrame = false;
      const vh = window.innerHeight;
      camadasParallax.forEach(function (camada) {
        const secao = camada.parentElement;
        const r = secao.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;   // fora da tela: não mexe
        // progresso da seção pela viewport (-1 → 1), vezes o fator da camada
        const progresso = (r.top + r.height / 2 - vh / 2) / vh;
        const desloca = progresso * parseFloat(camada.dataset.parallax) * vh;
        camada.style.transform = "translate3d(0," + desloca.toFixed(1) + "px,0)";
      });
    }

    window.addEventListener("scroll", function () {
      if (!aguardandoFrame) {
        aguardandoFrame = true;
        requestAnimationFrame(aplicarParallax);
      }
    }, { passive: true });

    aplicarParallax();
  }

  /* ---------- lightbox da galeria ---------- */
  const itensGaleria = document.querySelectorAll(".galeria-item");
  const lightbox = document.getElementById("lightbox");

  if (itensGaleria.length && lightbox) {
    const lbImg = document.getElementById("lightbox-img");
    const lbLegenda = document.getElementById("lightbox-legenda");
    let indiceAtual = 0;

    function mostrar(indice) {
      indiceAtual = (indice + itensGaleria.length) % itensGaleria.length;
      const item = itensGaleria[indiceAtual];
      const img = item.querySelector("img");
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbLegenda.textContent = item.querySelector("figcaption").textContent;
    }

    function abrir(indice) {
      mostrar(indice);
      if (typeof lightbox.showModal === "function") lightbox.showModal();
    }

    itensGaleria.forEach(function (item, indice) {
      item.addEventListener("click", function () { abrir(indice); });
      item.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          abrir(indice);
        }
      });
    });

    lightbox.querySelector(".lightbox-fechar").addEventListener("click", function () {
      lightbox.close();
    });
    lightbox.querySelector(".lightbox-anterior").addEventListener("click", function () {
      mostrar(indiceAtual - 1);
    });
    lightbox.querySelector(".lightbox-proxima").addEventListener("click", function () {
      mostrar(indiceAtual + 1);
    });

    // clique fora da foto (no <dialog> em si, não no conteúdo) fecha
    lightbox.addEventListener("click", function (ev) {
      if (ev.target === lightbox) lightbox.close();
    });

    lightbox.addEventListener("keydown", function (ev) {
      if (ev.key === "ArrowLeft") mostrar(indiceAtual - 1);
      if (ev.key === "ArrowRight") mostrar(indiceAtual + 1);
      // Esc já fecha o <dialog> nativamente, não precisa tratar aqui
    });
  }

  /* ---------- player dos depoimentos em vídeo ---------- */
  const itensVideo = document.querySelectorAll(".video-item");
  const videoLightbox = document.getElementById("video-lightbox");

  if (itensVideo.length && videoLightbox) {
    const player = document.getElementById("video-lightbox-player");
    const legenda = document.getElementById("video-lightbox-legenda");
    let indiceVideoAtual = 0;

    function mostrarVideo(indice) {
      indiceVideoAtual = (indice + itensVideo.length) % itensVideo.length;
      const item = itensVideo[indiceVideoAtual];
      // troca de vídeo pausa e descarta o anterior antes de carregar o novo
      player.pause();
      player.src = item.dataset.video;
      legenda.textContent = item.dataset.cargo
        ? item.dataset.nome + " — " + item.dataset.cargo
        : item.dataset.nome;
      player.play().catch(function () {});
    }

    itensVideo.forEach(function (item, indice) {
      item.addEventListener("click", function () {
        // src só entra ao clicar: nenhum dos 8 vídeos baixa nada sem interação
        mostrarVideo(indice);
        videoLightbox.showModal();
      });
    });

    videoLightbox.querySelector(".lightbox-fechar").addEventListener("click", function () {
      videoLightbox.close();
    });
    videoLightbox.querySelector(".lightbox-anterior").addEventListener("click", function () {
      mostrarVideo(indiceVideoAtual - 1);
    });
    videoLightbox.querySelector(".lightbox-proxima").addEventListener("click", function () {
      mostrarVideo(indiceVideoAtual + 1);
    });

    videoLightbox.addEventListener("click", function (ev) {
      if (ev.target === videoLightbox) videoLightbox.close();
    });

    videoLightbox.addEventListener("keydown", function (ev) {
      if (ev.key === "ArrowLeft") mostrarVideo(indiceVideoAtual - 1);
      if (ev.key === "ArrowRight") mostrarVideo(indiceVideoAtual + 1);
    });

    // fecha por qualquer via (Esc, backdrop, botão): sempre pausa e larga o
    // buffer, senão o áudio segue tocando escondido atrás do modal fechado
    videoLightbox.addEventListener("close", function () {
      player.pause();
      player.removeAttribute("src");
      player.load();
    });
  }
})();
