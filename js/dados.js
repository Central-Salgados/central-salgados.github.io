/* =========================================================
   DADOS DO SITE — é AQUI que você atualiza preços, sabores,
   horários e contatos. Não precisa mexer no HTML.

   Regras rápidas:
   - Preço é número com PONTO, sem "R$":  2.50  (não "2,50")
   - Cada item fica entre aspas e separado por vírgula.
   - Depois de salvar, é só recarregar a página.
   ========================================================= */

const LOJA = {
  nome: "Central Salgados",
  desde: 2011,
  cidade: "Dobrada - SP",
  endereco: "R. Capitão Alberto Mendes Júnior, 780 - Centro, Dobrada - SP, 15980-000",

  // Ponto exato da loja no mapa (latitude, longitude) — o mesmo do linkme
  coordenadas: "-21.51745,-48.39489",

  // Taxa de entrega por cidade. Para incluir uma cidade, copie uma linha.
  entregas: [
    { cidade: "Dobrada", taxa: 5.00 },
    { cidade: "Santa Ernestina", taxa: 15.00 },
    { cidade: "Matão", taxa: 20.00 },
  ],

  // Número só com dígitos: 55 (Brasil) + DDD + número
  whatsapp: "5516982053296",
  whatsappTexto: "(16) 98205-3296",
  telefone: "551633861258",
  telefoneTexto: "(16) 3386-1258",
  instagram: "centralsalgados016",

  // Horário por dia da semana (0 = domingo ... 6 = sábado)
  // null = fechado. Horas no formato "HH:MM".
  horarios: [
    null,                               // domingo
    { abre: "10:00", fecha: "18:00" },  // segunda
    { abre: "10:00", fecha: "18:00" },  // terça
    { abre: "10:00", fecha: "20:00" },  // quarta
    { abre: "10:00", fecha: "20:00" },  // quinta
    { abre: "10:00", fecha: "20:00" },  // sexta
    { abre: "10:00", fecha: "20:00" },  // sábado
  ],
};

/* ---------------------------------------------------------
   CARDÁPIO
   Cada categoria pode ter:
   - precoUnico: quando todos os sabores custam o mesmo
   - grupos: listas de sabores (ex.: Fritos / Assados)
   - itens: produtos com preço próprio
   - adicionais: extras com preço
   - foto: caminho da imagem (ou null se não tiver)
   --------------------------------------------------------- */

const CARDAPIO = [
  {
    id: "estufa",
    titulo: "Salgados de estufa",
    subtitulo: "Tamanho normal, quentinhos no balcão.",
    foto: "img/assados.jpg",
    fotoAlt: "Bandejas de salgados assados",
    precoUnico: { valor: 2.50, unidade: "cada" },
    grupos: [
      {
        nome: "Fritos",
        sabores: ["Coxinha de frango", "Coxinha de carne", "Bolinha de queijo",
                  "Frango com catupiry", "Salsicha", "Calabresa", "Risoles"],
      },
      {
        nome: "Assados",
        sabores: ["Esfiha de frango", "Esfiha de carne", "Hamburguinho", "Doguinho"],
      },
    ],
  },

  {
    id: "festa",
    titulo: "Salgados de festa",
    subtitulo: "Mini salgados para festas e encomendas.",
    foto: "img/festa-bandeja.jpg",
    fotoAlt: "Bandeja com salgados de festa sortidos",
    precoUnico: { valor: 0.70, unidade: "cada" },
    grupos: [
      {
        nome: "Fritos",
        sabores: ["Coxinha de frango", "Coxinha de carne", "Bolinha de queijo",
                  "Risoles", "Calabresa", "Salsicha", "Kibe",
                  "Pastel de frango", "Pastel de carne", "Pastel de presunto e queijo"],
      },
      {
        nome: "Assados",
        sabores: ["Esfiha de frango", "Esfiha de carne", "Esfiha de presunto e queijo"],
      },
    ],
  },

  {
    id: "pastel",
    titulo: "Pastel grande",
    subtitulo: "Frito na hora.",
    foto: "img/pastel.jpg",
    fotoAlt: "Pastel grande frito",
    fotoPosicao: "center 15%",   // qual parte da foto aparece quando ela é cortada
    itens: [
      { nome: "Carne", preco: 10.00 },
      { nome: "Frango", preco: 10.00 },
      { nome: "Presunto e queijo", preco: 10.00 },
      { nome: "Queijo", preco: 12.00 },
    ],
    adicionais: {
      titulo: "Adicionais",
      preco: 5.00,
      sabores: ["Carne", "Queijo", "Bacon", "Catupiry", "Milho", "Azeitona", "Frango", "Tomate"],
    },
  },

  {
    id: "tortas",
    titulo: "Tortas grandes",
    subtitulo: "Frango ou presunto e queijo.",
    foto: "img/torta-de-frango.jpg",
    fotoAlt: "Torta de frango inteira e um pedaço",
    itens: [
      { nome: "Torta inteira", preco: 75.00 },
      { nome: "Pedaço", preco: 10.00 },
    ],
  },

  {
    id: "lanches",
    titulo: "Lanches e porções",
    subtitulo: "",
    foto: "img/pate-de-frango.jpg",
    fotoAlt: "Potes de patê de frango",
    itens: [
      { nome: "Lanchinho", detalhe: "Pãozinho com hambúrguer, alface e tomate", preco: 2.50, unidade: "cada" },
      { nome: "Batata frita", detalhe: "Porção de 450 g", preco: 15.00 },
      { nome: "Batata temperada", preco: 25.00, unidade: "kg" },
      { nome: "Patê de frango", preco: 26.00, unidade: "kg" },
    ],
    adicionaisLista: {
      titulo: "Adicionais da batata frita",
      itens: [
        { nome: "Queijo", preco: 4.00 },
        { nome: "Bacon", preco: 4.00 },
        { nome: "Catupiry", preco: 3.00 },
      ],
    },
  },
];

/* ---------------------------------------------------------
   COMBOS DE FESTA (sortidos com os sabores mais pedidos)
   --------------------------------------------------------- */
const COMBOS = [
  { quantidade: 30, preco: 20.00 },
  { quantidade: 50, preco: 35.00 },
  { quantidade: 100, preco: 70.00 },
];
