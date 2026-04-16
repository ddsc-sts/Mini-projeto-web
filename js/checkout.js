/* ============================================================
   CHECKOUT — Resumo do pedido e confirmação
   Responsabilidades deste arquivo:
     1. Ler o carrinho salvo no sessionStorage pelo cardapio.js
     2. Renderizar o resumo dos itens no aside da página
     3. Calcular e exibir o valor total do pedido
     4. Validar o formulário (nome e número da mesa)
     5. Gerar número do pedido, salvar e redirecionar para confirmação
   ============================================================ */


/* ── 1. SELEÇÃO DE ELEMENTOS ──────────────────────────────── */
// Armazena referências aos elementos HTML que serão manipulados,
// tanto do resumo do pedido quanto do formulário.

const listaResumo   = document.getElementById("lista-resumo");   // <ul> onde os itens do pedido são listados
const resumoVazio   = document.getElementById("resumo-vazio");   // mensagem exibida se o carrinho chegar vazio
const totalCheckout = document.getElementById("total-checkout"); // elemento que mostra o valor total
const formCheckout  = document.getElementById("form-checkout");  // o elemento <form> do checkout
const inputNome     = document.getElementById("nome");           // campo de texto: nome do cliente
const inputMesa     = document.getElementById("mesa");           // campo numérico: número da mesa
const mensagemErro  = document.getElementById("mensagem-erro"); // parágrafo onde erros são exibidos


/* ── 2. CARREGAR CARRINHO DO sessionStorage ────────────────── */
// Recupera o carrinho que foi salvo pela página do cardápio.
// sessionStorage.getItem retorna null se a chave não existir.

const carrinhoSalvo = sessionStorage.getItem("carrinho"); // tenta ler a string JSON salva com a chave "carrinho"

// se carrinhoSalvo não for null, converte a string JSON de volta para um array de objetos
// caso contrário (null), usa um array vazio como valor padrão
const carrinho = carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];


/* ── 3. FUNÇÃO: formatarPreco ─────────────────────────────── */
/*
   Converte um número (ex: 54.9) para string no formato monetário
   brasileiro (ex: "R$ 54,90").
   Parâmetro:
     valor — número decimal representando o preço
*/
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { // usa as regras de formatação do português do Brasil
    style:    "currency",                 // formato de moeda — adiciona o símbolo "R$"
    currency: "BRL"                       // define a moeda como Real Brasileiro
  });
}


/* ── 4. FUNÇÃO: renderizarResumo ──────────────────────────── */
/*
   Lê o array "carrinho" e constrói a lista de itens do resumo no aside.
   Também calcula e exibe o total do pedido.
*/
function renderizarResumo() {

  listaResumo.innerHTML = ""; // limpa a lista antes de inserir os itens

  // se o carrinho estiver vazio, exibe a mensagem de aviso e encerra
  if (carrinho.length === 0) {
    resumoVazio.hidden        = false;        // torna visível a mensagem "nenhum item no carrinho"
    totalCheckout.textContent = formatarPreco(0); // exibe R$ 0,00 como total
    return;                                    // encerra — não há itens para renderizar
  }

  resumoVazio.hidden = true; // oculta a mensagem de carrinho vazio quando há itens

  // percorre cada item do carrinho e cria um <li> de resumo para ele
  carrinho.forEach(function (item) {

    const li = document.createElement("li"); // cria o elemento de lista para o item
    li.className = "resumo-item";            // aplica a classe CSS do item de resumo

    // define o HTML interno: nome, quantidade e preço total do item
    li.innerHTML = `
      <span class="resumo-item__nome">${item.nome}</span>
      <span class="resumo-item__qtd">x${item.quantidade}</span>
      <span class="resumo-item__preco">${formatarPreco(item.preco * item.quantidade)}</span>
    `;
    // item.preco * item.quantidade → subtotal do item (preço unitário × quantidade)

    listaResumo.appendChild(li); // insere o item no final da lista de resumo
  });

  // calcula o valor total somando os subtotais de todos os itens
  // .reduce() percorre o array acumulando valores; começa do 0 (segundo argumento)
  const total = carrinho.reduce(function (soma, item) {
    return soma + item.preco * item.quantidade; // acumula: soma atual + subtotal do item
  }, 0); // valor inicial do acumulador é 0

  totalCheckout.textContent = formatarPreco(total); // exibe o total formatado no elemento HTML
}


/* ── 5. FUNÇÃO: mostrarErro ───────────────────────────────── */
/*
   Exibe uma mensagem de erro no parágrafo #mensagem-erro.
   Parâmetro:
     texto — string com a mensagem a ser exibida ao usuário
*/
function mostrarErro(texto) {
  mensagemErro.textContent = texto;  // define o texto da mensagem
  mensagemErro.hidden      = false;  // torna o parágrafo de erro visível
}


/* ── 6. FUNÇÃO: limparErro ────────────────────────────────── */
/*
   Oculta e apaga a mensagem de erro.
   Chamada no início de cada tentativa de envio.
*/
function limparErro() {
  mensagemErro.textContent = "";   // apaga o texto da mensagem
  mensagemErro.hidden      = true; // oculta o parágrafo de erro
}


/* ── 7. FUNÇÃO: validarFormulario ─────────────────────────── */
/*
   Verifica se os campos do formulário estão preenchidos corretamente.
   Retorna true se tudo estiver válido, ou false após
   exibir a primeira mensagem de erro encontrada.
*/
function validarFormulario() {

  const nome = inputNome.value.trim();  // lê o nome e remove espaços das bordas
  const mesa = Number(inputMesa.value); // lê o valor do campo mesa e converte para número

  // valida se o nome foi preenchido (não pode ser vazio após o trim)
  if (!nome) {
    mostrarErro("Por favor, informe seu nome completo."); // mensagem de erro de nome vazio
    inputNome.focus();                                    // move foco para o campo de nome
    return false;                                          // validação falhou
  }

  // valida se a mesa é um número entre 1 e 20 (intervalo configurável conforme o restaurante)
  if (!mesa || mesa < 1 || mesa > 20) {
    mostrarErro("Por favor, informe um número de mesa válido (1 a 20)."); // mensagem de mesa inválida
    inputMesa.focus();                                                     // move foco para o campo de mesa
    return false;
  }

  // valida se o carrinho não está vazio (impedido de finalizar sem itens)
  if (carrinho.length === 0) {
    mostrarErro("Seu carrinho está vazio. Adicione itens antes de confirmar."); // carrinho vazio
    return false;
  }

  return true; // todos os campos e condições passaram — formulário válido
}


/* ── 8. EVENTO: submit do formulário de checkout ─────────── */
/*
   Escuta o evento "submit" (clique em "Confirmar Pedido").
   Valida o formulário, gera o número do pedido, salva no
   sessionStorage e redireciona para a página de confirmação.
*/
formCheckout.addEventListener("submit", function (evento) {

  evento.preventDefault(); // cancela o envio padrão do formulário (que recarregaria a página)

  limparErro(); // apaga mensagens de erro de tentativas anteriores

  // executa a validação — se retornar false, exibe o erro e encerra
  if (!validarFormulario()) return;

  // gera um número de pedido aleatório de 6 dígitos
  // Math.random() retorna um decimal entre 0 e 1
  // multiplicar por 900000 e somar 100000 garante um número entre 100000 e 999999
  // Math.floor() arredonda para baixo, eliminando a parte decimal
  const numeroPedido = Math.floor(100000 + Math.random() * 900000);

  // monta o objeto pedido com todos os dados que serão exibidos na confirmação
  const pedido = {
    numero: numeroPedido,                    // número gerado para identificar o pedido
    nome:   inputNome.value.trim(),          // nome do cliente lido do campo
    mesa:   Number(inputMesa.value),         // número da mesa convertido para inteiro
    itens:  carrinho,                        // array com todos os itens do carrinho
    total:  carrinho.reduce(function (soma, item) { // calcula o total final do pedido
      return soma + item.preco * item.quantidade;   // soma os subtotais de cada item
    }, 0)                                           // acumulador começa em 0
  };

  // salva o objeto pedido como string JSON no sessionStorage com a chave "pedido"
  // a página de confirmação vai ler esse valor para exibir o número do pedido
  sessionStorage.setItem("pedido", JSON.stringify(pedido));

  // remove o carrinho do sessionStorage — o pedido foi confirmado, carrinho pode ser apagado
  sessionStorage.removeItem("carrinho");

  window.location.href = "confirmacao.html"; // redireciona para a página de confirmação do pedido
});


/* ── 9. INICIALIZAÇÃO ─────────────────────────────────────── */
// Executado assim que o script carrega — monta o resumo do pedido na tela.

renderizarResumo(); // exibe os itens do carrinho e o total no resumo lateral
