/* ============================================================
   PERFIL — Exibe os dados do usuário e histórico de pedidos
   Responsabilidades deste arquivo:
     1. Verificar se há um usuário logado; se não, redirecionar para o login
     2. Exibir o nome e e-mail do usuário no cabeçalho do perfil
     3. Carregar o histórico de pedidos do localStorage
     4. Renderizar cada pedido com data, itens e total
     5. Exibir mensagem amigável se o histórico estiver vazio
   ============================================================ */


/* ── 1. SELEÇÃO DE ELEMENTOS ──────────────────────────────── */
// Referências aos elementos da página onde os dados serão inseridos.

const elNomeUsuario    = document.getElementById("perfil-nome");       // elemento que exibe o nome completo
const elEmailUsuario   = document.getElementById("perfil-email");      // elemento que exibe o e-mail
const listaHistorico   = document.getElementById("historico-lista");   // <div> onde os cards de pedido são inseridos
const semPedidos       = document.getElementById("sem-pedidos");       // mensagem exibida quando não há pedidos


/* ── 2. VERIFICAR SESSÃO DO USUÁRIO ──────────────────────── */
/*
   Lê a chave "usuarioLogado" do localStorage.
   Se não existir (null), o usuário não está logado —
   redireciona para o login e encerra o script.
*/
const dadosSalvos = localStorage.getItem("usuarioLogado"); // tenta ler a sessão

if (!dadosSalvos) {
  // usuário não está logado — redireciona para o login
  window.location.href = "login.html";
}

// a partir daqui, temos certeza que o usuário está logado
const usuario = JSON.parse(dadosSalvos); // converte de string JSON para objeto { nome, email, senha }


/* ── 3. EXIBIR DADOS DO USUÁRIO ───────────────────────────── */
// Preenche o cabeçalho do perfil com o nome e e-mail do usuário logado.

elNomeUsuario.textContent  = usuario.nome;  // exibe o nome completo
elEmailUsuario.textContent = usuario.email; // exibe o e-mail


/* ── 4. FUNÇÃO: formatarPreco ─────────────────────────────── */
/*
   Converte um número (ex: 54.9) para string no formato monetário
   brasileiro (ex: "R$ 54,90").
*/
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { // regras de formatação do português do Brasil
    style:    "currency",                 // formato de moeda — adiciona "R$"
    currency: "BRL"                       // moeda: Real Brasileiro
  });
}


/* ── 5. FUNÇÃO: formatarData ──────────────────────────────── */
/*
   Converte uma string ISO 8601 (ex: "2026-04-14T20:30:00.000Z")
   para um formato legível em português (ex: "14/04/2026 às 17:30").
*/
function formatarData(isoString) {
  const data = new Date(isoString); // cria um objeto Date a partir da string ISO

  // formata a data no padrão DD/MM/AAAA HH:MM usando as regras do Brasil
  return data.toLocaleString("pt-BR", {
    day:    "2-digit",   // dia com dois dígitos (ex: 04)
    month:  "2-digit",   // mês com dois dígitos (ex: 04)
    year:   "numeric",   // ano completo (ex: 2026)
    hour:   "2-digit",   // hora com dois dígitos (ex: 17)
    minute: "2-digit"    // minuto com dois dígitos (ex: 30)
  }).replace(",", " às"); // substitui a vírgula padrão por " às" (ex: "14/04/2026 às 17:30")
}


/* ── 6. CARREGAR E RENDERIZAR HISTÓRICO ───────────────────── */
/*
   Lê o histórico de pedidos do usuário a partir do localStorage.
   A chave é "pedidos_" + e-mail, garantindo histórico individual por usuário.
   Cada pedido no array possui: numero, nome, mesa, itens[], total, data.
*/
function carregarHistorico() {

  const chave    = "pedidos_" + usuario.email; // chave individual do usuário
  const historico = JSON.parse(localStorage.getItem(chave) || "[]"); // histórico ou array vazio

  // se não há pedidos no histórico, exibe a mensagem "nenhum pedido ainda" e encerra
  if (historico.length === 0) {
    semPedidos.hidden    = false; // torna a mensagem visível
    listaHistorico.hidden = true; // oculta a lista vazia para não mostrar espaço em branco
    return;
  }

  semPedidos.hidden    = true;  // oculta a mensagem — há pedidos para exibir
  listaHistorico.hidden = false; // garante que a lista esteja visível

  listaHistorico.innerHTML = ""; // limpa o conteúdo anterior (segurança em caso de re-render)

  // percorre cada pedido do histórico e cria um card para ele
  historico.forEach(function (pedido) {

    /* Monta a lista de itens do pedido como linhas de texto:
       "2× Pizza Calabresa Defumada — R$ 109,80" */
    const itensHTML = pedido.itens.map(function (item) {
      return `
        <li class="historico-item">
          <span class="historico-item__qtd">${item.quantidade}×</span>
          <span class="historico-item__nome">${item.nome}</span>
          <span class="historico-item__preco">${formatarPreco(item.preco * item.quantidade)}</span>
        </li>
      `;
    }).join(""); // .join("") concatena todos os <li> em uma única string HTML

    // cria o card completo do pedido com cabeçalho, lista de itens e total
    const card = document.createElement("article"); // <article> representa cada pedido individualmente
    card.className = "historico-card";               // classe CSS para estilização

    card.innerHTML = `
      <header class="historico-card__header">
        <div class="historico-card__meta">
          <span class="historico-card__numero">Pedido #${pedido.numero}</span>
          <span class="historico-card__mesa">Mesa ${pedido.mesa}</span>
        </div>
        <time class="historico-card__data">${formatarData(pedido.data)}</time>
      </header>

      <ul class="historico-itens">
        ${itensHTML}
      </ul>

      <footer class="historico-card__footer">
        <span class="historico-card__total-label">Total do pedido</span>
        <span class="historico-card__total-valor">${formatarPreco(pedido.total)}</span>
      </footer>
    `;

    listaHistorico.appendChild(card); // insere o card no final da lista de histórico
  });
}

// executa o carregamento do histórico assim que o script é lido
carregarHistorico();
