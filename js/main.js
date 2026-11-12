/* =========================================================
   MAIN.JS — monta o site a partir do dados.js.
   Você normalmente NÃO precisa mexer aqui.
   ========================================================= */

// Pega um elemento da página pelo atributo data-*
const $ = (seletor) => document.querySelector(seletor);
const $$ = (seletor) => document.querySelectorAll(seletor);

// 2.5 -> "R$ 2,50"
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Monta o link do WhatsApp já com uma mensagem pronta
function linkWhats(mensagem) {
  return `https://wa.me/${LOJA.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

/* ---------- Contatos e links ---------- */
function preencherContatos() {
  const mensagens = {
    padrao: "Olá! Vi o site e gostaria de fazer um pedido!",
    encomenda: "Olá! Vi o site e gostaria de fazer uma encomenda de salgados de festa.",
  };

  $$("[data-whats]").forEach((link) => {
    const tipo = link.dataset.whats || "padrao";
    link.href = linkWhats(mensagens[tipo] || mensagens.padrao);
  });

  $$("[data-tel]").forEach((link) => (link.href = `tel:+${LOJA.telefone}`));
  $$("[data-insta]").forEach((link) => (link.href = `https://www.instagram.com/${LOJA.instagram}/`));

  $("[data-whats-texto]").textContent = LOJA.whatsappTexto;
  $("[data-tel-texto]").textContent = LOJA.telefoneTexto;
  $("[data-insta-texto]").textContent = "@" + LOJA.instagram;
  $("[data-endereco]").textContent = LOJA.endereco;
  $("[data-desde]").textContent = LOJA.desde;
  $("[data-ano]").textContent = new Date().getFullYear();

  // Mapa e rota usam as coordenadas (ponto exato; não precisa de chave de API)
  const ponto = LOJA.coordenadas;
  $("[data-mapa]").src = `https://maps.google.com/maps?q=${ponto}&z=17&output=embed`;
  $("[data-rota]").href = `https://www.google.com/maps/dir/?api=1&destination=${ponto}`;

  // Menor taxa (aparece no topo como "a partir de")
  const menorTaxa = Math.min(...LOJA.entregas.map((e) => e.taxa));
  $("[data-entrega-minima]").textContent = formatarPreco(menorTaxa);

  // Tabela com a taxa de cada cidade
  $("[data-entregas]").innerHTML = LOJA.entregas.map((e) => `
    <tr><th scope="row">${e.cidade}</th><td>${formatarPreco(e.taxa)}</td></tr>
  `).join("");
}

/* ---------- Cardápio ---------- */

// Cada função abaixo devolve um pedaço de HTML em texto

function htmlGrupos(grupos) {
  return grupos.map((grupo) => `
    <div class="grupo">
      <h4>${grupo.nome}</h4>
      <ul class="sabores">
        ${grupo.sabores.map((s) => `<li>${s}</li>`).join("")}
      </ul>
    </div>
  `).join("");
}

function htmlItens(itens) {
  return `
    <ul class="itens">
      ${itens.map((item) => `
        <li>
          <span class="itens__nome">
            ${item.nome}
            ${item.detalhe ? `<small>${item.detalhe}</small>` : ""}
          </span>
          <span class="itens__linha"></span>
          <span class="itens__preco">
            ${formatarPreco(item.preco)}${item.unidade ? ` <small>/${item.unidade}</small>` : ""}
          </span>
        </li>
      `).join("")}
    </ul>
  `;
}

function htmlCategoria(cat) {
  const preco = cat.precoUnico
    ? `<p class="categoria__preco">${formatarPreco(cat.precoUnico.valor)} <small>${cat.precoUnico.unidade}</small></p>`
    : "";

  const foto = cat.foto
    ? `<img class="categoria__foto" src="${cat.foto}" alt="${cat.fotoAlt || cat.titulo}" loading="lazy"
           style="object-position: ${cat.fotoPosicao || "center"}">`
    : "";

  let corpo = "";
  if (cat.grupos) corpo += htmlGrupos(cat.grupos);
  if (cat.itens) corpo += htmlItens(cat.itens);

  if (cat.adicionais) {
    corpo += `
      <div class="grupo grupo--extra">
        <h4>${cat.adicionais.titulo} · ${formatarPreco(cat.adicionais.preco)} cada</h4>
        <ul class="sabores">${cat.adicionais.sabores.map((s) => `<li>${s}</li>`).join("")}</ul>
      </div>`;
  }
  if (cat.adicionaisLista) {
    corpo += `
      <div class="grupo grupo--extra">
        <h4>${cat.adicionaisLista.titulo}</h4>
        ${htmlItens(cat.adicionaisLista.itens)}
      </div>`;
  }

  return `
    <article class="categoria ${cat.foto ? "categoria--com-foto" : ""}" id="cat-${cat.id}">
      ${foto}
      <div class="categoria__conteudo">
        <header class="categoria__topo">
          <div>
            <h3>${cat.titulo}</h3>
            ${cat.subtitulo ? `<p class="categoria__sub">${cat.subtitulo}</p>` : ""}
          </div>
          ${preco}
        </header>
        ${corpo}
      </div>
    </article>
  `;
}

function montarCardapio() {
  $("[data-cardapio]").innerHTML = CARDAPIO.map(htmlCategoria).join("");
  $("[data-abas]").innerHTML = CARDAPIO
    .map((cat) => `<a href="#cat-${cat.id}">${cat.titulo}</a>`)
    .join("");
}

/* ---------- Combos ---------- */
function montarCombos() {
  $("[data-combos]").innerHTML = COMBOS.map((combo) => `
    <div class="combo">
      <span class="combo__qtd">${combo.quantidade}</span>
      <span class="combo__rotulo">salgados</span>
      <span class="combo__preco">${formatarPreco(combo.preco)}</span>
    </div>
  `).join("");

  const festa = CARDAPIO.find((c) => c.id === "festa");
  $("[data-preco-festa]").textContent = formatarPreco(festa.precoUnico.valor);
}

/* ---------- Horários ---------- */
const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

// "10:00" -> 600 (minutos desde meia-noite), facilita comparar
const emMinutos = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const formatarHora = (hhmm) => hhmm.replace(":00", "h").replace(":", "h");

function montarHorarios() {
  const hoje = new Date().getDay();
  // Começa a tabela na segunda (1..6, depois 0)
  const ordem = [1, 2, 3, 4, 5, 6, 0];

  $("[data-horarios]").innerHTML = ordem.map((dia) => {
    const h = LOJA.horarios[dia];
    const texto = h ? `${formatarHora(h.abre)} às ${formatarHora(h.fecha)}` : "Fechado";
    return `
      <tr class="${dia === hoje ? "hoje" : ""}">
        <th scope="row">${DIAS[dia]}${dia === hoje ? " <small>(hoje)</small>" : ""}</th>
        <td>${texto}</td>
      </tr>`;
  }).join("");
}

// Mostra "Aberto agora" ou "Fechado" usando o relógio do visitante
function mostrarStatus() {
  const agora = new Date();
  const hoje = LOJA.horarios[agora.getDay()];
  const minutos = agora.getHours() * 60 + agora.getMinutes();
  const el = $("[data-status]");

  if (hoje && minutos >= emMinutos(hoje.abre) && minutos < emMinutos(hoje.fecha)) {
    el.innerHTML = `<span class="ponto ponto--aberto"></span> Aberto agora · fecha às ${formatarHora(hoje.fecha)}`;
  } else {
    // Procura o próximo dia (ou hoje mais tarde) em que abre
    let texto = "Fechado agora";
    for (let i = 0; i < 7; i++) {
      const dia = (agora.getDay() + i) % 7;
      const h = LOJA.horarios[dia];
      if (!h) continue;
      if (i === 0 && minutos >= emMinutos(h.abre)) continue; // hoje já fechou
      const quando = i === 0 ? "hoje" : i === 1 ? "amanhã" : DIAS[dia].toLowerCase();
      texto += ` · abre ${quando} às ${formatarHora(h.abre)}`;
      break;
    }
    el.innerHTML = `<span class="ponto ponto--fechado"></span> ${texto}`;
  }
}

/* ---------- Liga tudo ---------- */
preencherContatos();
montarCardapio();
montarCombos();
montarHorarios();
mostrarStatus();
