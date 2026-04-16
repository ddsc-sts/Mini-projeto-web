/* ============================================================
   CONFIRMAÇÃO — Exibe o número do pedido e salva no histórico
   Responsabilidades deste arquivo:
     1. Ler os dados do pedido salvos no sessionStorage pelo checkout.js
     2. Exibir o número do pedido na tela
     3. Salvar o pedido no histórico do usuário logado (localStorage)
     4. Limpar os dados temporários do pedido após exibição
     5. Redirecionar para o cardápio se o usuário acessar esta página diretamente
   ============================================================ */


/* ── 1. SELEÇÃO DE ELEMENTOS ──────────────────────────────── */
// Busca a referência do elemento onde o número do pedido será exibido.

const elNumeroPedido = document.getElementById("numero-pedido"); // <span> que mostra o número do pedido


/* ── 2. CARREGAR PEDIDO DO sessionStorage ─────────────────── */
/*
   Tenta recuperar os dados do pedido salvos pelo checkout.js.
   sessionStorage.getItem retorna null se a chave não existir
   (ex: usuário acessou a página diretamente sem passar pelo checkout).
*/
const pedidoSalvo = sessionStorage.getItem("pedido"); // lê a string JSON com a chave "pedido"


/* ── 3. FUNÇÃO: salvarPedidoNoHistorico ──────────────────── */
/*
   Se houver um usuário logado, persiste o pedido no histórico
   individual dele no localStorage.
   Etapas:
     a) Verifica se há um usuário na sessão — sem usuário, não salva
     b) Monta a chave de armazenamento com o e-mail do usuário
        para que cada usuário tenha sua própria lista de pedidos
     c) Carrega o histórico existente (ou cria array vazio)
     d) Adiciona a data/hora atual ao pedido e o insere no início do array
        (pedidos mais recentes aparecem primeiro no perfil)
     e) Serializa e salva o histórico atualizado
*/
function salvarPedidoNoHistorico(pedido) {

  // a) Lê o usuário logado — retorna null se ninguém estiver logado
  const dadosUsuario = localStorage.getItem("usuarioLogado");
  if (!dadosUsuario) return; // não há sessão ativa — não é possível salvar no histórico

  const usuario = JSON.parse(dadosUsuario); // converte a string para objeto { nome, email, senha }

  // b) Chave única por usuário: "pedidos_seuemail@exemplo.com"
  const chave = "pedidos_" + usuario.email;

  // c) Recupera o histórico de pedidos já salvos; se não existir, usa array vazio
  const historico = JSON.parse(localStorage.getItem(chave) || "[]");

  // d) Adiciona data/hora ao objeto do pedido e insere no início do array
  const pedidoComData = {
    ...pedido,                              // copia todas as propriedades do pedido (numero, nome, mesa, itens, total)
    data: new Date().toISOString()          // registra o momento exato da confirmação no formato ISO 8601
  };
  historico.unshift(pedidoComData);        // unshift() insere no início → pedidos recentes primeiro

  // e) Serializa e persiste o histórico atualizado no localStorage
  localStorage.setItem(chave, JSON.stringify(historico));
}


/* ── 4. VERIFICAÇÃO E EXIBIÇÃO ─────────────────────────────── */

if (!pedidoSalvo) {
  // pedidoSalvo é null — o usuário acessou /confirmacao.html diretamente, sem fazer um pedido
  // redireciona para o cardápio para evitar que a página apareça vazia ou com dados incorretos
  window.location.href = "cardapio.html"; // volta para o cardápio

} else {
  // pedidoSalvo contém a string JSON do pedido — converte de volta para objeto JavaScript
  const pedido = JSON.parse(pedidoSalvo); // JSON.parse() transforma a string em objeto {numero, nome, mesa, ...}

  // exibe o número do pedido no elemento da página, precedido de "#" para formatação visual
  elNumeroPedido.textContent = "#" + pedido.numero; // ex: "#384729"

  // salva o pedido no histórico do usuário logado (se houver sessão ativa)
  salvarPedidoNoHistorico(pedido);

  // remove os dados do pedido do sessionStorage após exibi-los e salvá-los
  // evita que recarregar a página mostre um pedido antigo que não existe mais
  sessionStorage.removeItem("pedido"); // apaga a chave "pedido" do sessionStorage
}
