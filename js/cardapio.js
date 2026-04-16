/* ============================================================
   CARDÁPIO — Produtos, Vitrine e Carrinho
   Responsabilidades deste arquivo:
     1. Lista de produtos (fonte de verdade)
     2. Gerar botões de filtro por categoria
     3. Renderizar cards na vitrine
     4. Filtrar vitrine ao clicar em uma categoria
     5. Adicionar / remover / ajustar quantidade no carrinho
     6. Atualizar total e estado do botão finalizar
     7. Salvar carrinho no sessionStorage ao finalizar
   ============================================================ */


/* ── 1. LISTA DE PRODUTOS ─────────────────────────────────── */
/*
   Array de objetos — cada objeto representa um produto do cardápio.
   Para adicionar um produto novo, copie um bloco { } e ajuste os valores.
   Campos obrigatórios: id, nome, descricao, preco, categoria, imagem.
   O campo "imagem" deve ser o caminho a partir da raiz do projeto.
*/
const produtos = [
  {
    id: 1,                                                            // identificador único do produto (número inteiro)
    nome: "Pizza Calabresa Defumada",                                 // nome exibido no card
    descricao: "Mussarela, calabresa defumada fatiada e cebola.",     // descrição exibida no card
    preco: 54.90,                                                     // preço em reais (número decimal)
    categoria: "pizzas",                                              // chave de categoria usada nos filtros
    imagem: "img/produtos/pizza-calabresa.jpg"                        // caminho da imagem do produto
  },
  {
    id: 2,
    nome: "Pizza de Mussarela",
    descricao: "A clássica pizza de mussarela com orégano.",
    preco: 49.90,
    categoria: "pizzas",
    imagem: "img/produtos/pizza-mussarela.jpg"
  },
  {
    id: 3,
    nome: "Pizza de Frango com Catupiry",
    descricao: "Frango desfiado, catupiry e azeitona.",
    preco: 57.90,
    categoria: "pizzas",
    imagem: "img/produtos/pizza-frango.jpg"
  },
  {
    id: 4,
    nome: "Pizza de Chocolate",
    descricao: "Chocolate ao leite derretido com granulado.",
    preco: 44.90,
    categoria: "sobremesas",
    imagem: "img/produtos/pizza-chocolate.jpg"
  },
  {
    id: 5,
    nome: "Pizza Romeu e Julieta",
    descricao: "Mussarela derretida com goiabada cremosa.",
    preco: 44.90,
    categoria: "sobremesas",
    imagem: "img/produtos/pizza-romeu-julieta.jpg"
  },
  {
    id: 6,
    nome: "Coca-Cola 350ml",
    descricao: "Lata gelada.",
    preco: 6.90,
    categoria: "bebidas",
    imagem: "img/produtos/coca-cola.jpg"
  },
  {
    id: 7,
    nome: "Suco de Laranja 500ml",
    descricao: "Suco natural feito na hora.",
    preco: 9.90,
    categoria: "bebidas",
    imagem: "img/produtos/suco-laranja.jpg"
  },
  {
    id: 8,
    nome: "Bordinha de Pizza",
    descricao: "Bordas recheadas com catupiry, porção com 8 unidades.",
    preco: 19.90,
    categoria: "acompanhamentos",
    imagem: "img/produtos/bordinha.jpg"
  },
  {
    id: 9,
    nome: "Alho e Óleo",
    descricao: "Pão de alho artesanal com azeite e ervas finas.",
    preco: 14.90,
    categoria: "acompanhamentos",
    imagem: "img/produtos/alho-oleo.jpg"
  }
];


/* ── 2. NOMES DE EXIBIÇÃO DAS CATEGORIAS ──────────────────── */
/*
   Objeto que mapeia a chave interna da categoria para o texto
   legível que aparece nos botões de filtro na tela.
   Ex: a chave "pizzas" vira o texto "Pizzas" no botão.
*/
const nomesCategorias = {
  pizzas:          "Pizzas",                    // texto do botão para a categoria pizzas
  sobremesas:      "Pizzas Doces / Sobremesas", // texto do botão para a categoria sobremesas
  bebidas:         "Drinks e Bebidas",          // texto do botão para a categoria bebidas
  acompanhamentos: "Acompanhamentos"            // texto do botão para a categoria acompanhamentos
};


/* ── 3. SELEÇÃO DE ELEMENTOS DO DOM ───────────────────────── */
// Busca e armazena referências aos elementos HTML que serão manipulados pelo JS.
// Fazer isso uma única vez aqui evita buscar o elemento repetidamente no DOM.

const elFiltros      = document.getElementById("filtros-categorias"); // container dos botões de filtro
const elVitrine      = document.getElementById("vitrine-produtos");   // grid onde os cards dos produtos são inseridos
const elVitrineVazia = document.getElementById("vitrine-vazia");      // mensagem exibida quando nenhum produto é encontrado


/* ── 4. FUNÇÃO: formatarPreco ─────────────────────────────── */
/*
   Recebe um número (ex: 54.9) e retorna uma string formatada
   no padrão monetário brasileiro (ex: "R$ 54,90").
   Usada em toda parte que exibe preço na tela.
   Parâmetro:
     valor — número decimal representando o preço
*/
function formatarPreco(valor) {
  // toLocaleString converte o número para string usando as regras do idioma informado
  return valor.toLocaleString("pt-BR", {
    style:    "currency", // formato de moeda — adiciona o símbolo "R$"
    currency: "BRL"       // define a moeda como Real Brasileiro
  });
}


/* ── 5. FUNÇÃO: renderizarVitrine ─────────────────────────── */
/*
   Reconstrói os cards de produto na vitrine a partir de um array.
   É chamada na inicialização e sempre que o filtro de categoria muda.
   Parâmetro:
     lista — array de objetos produto a serem exibidos
*/
function renderizarVitrine(lista) {

  elVitrine.innerHTML = ""; // apaga todos os cards existentes antes de inserir os novos

  // se a lista recebida estiver vazia, exibe mensagem e encerra a função
  if (lista.length === 0) {
    elVitrineVazia.hidden = false; // torna visível a mensagem "nenhum produto encontrado"
    return;                        // encerra — não há nada para renderizar
  }

  elVitrineVazia.hidden = true; // oculta a mensagem de vazio quando há produtos

  // percorre cada produto do array e cria um card HTML para ele
  lista.forEach(function(produto) {

    const card = document.createElement("article"); // cria o elemento <article> que envolve o card
    card.className         = "card-produto";        // aplica a classe CSS responsável pelo estilo do card
    card.dataset.id        = produto.id;            // salva o id do produto no atributo data-id do HTML
    card.dataset.categoria = produto.categoria;     // salva a categoria no atributo data-categoria

    // define o conteúdo HTML interno do card usando template literal
    // as variáveis entre ${} são substituídas pelos valores reais do produto
    card.innerHTML = `
      <div class="card-produto__img-wrap">
        <img
          src="${produto.imagem}"
          alt="${produto.nome}"
          class="card-produto__img"
          onerror="this.src='img/icons/logo.png'"
        >
      </div>
      <div class="card-produto__info">
        <h3 class="card-produto__nome">${produto.nome}</h3>
        <p  class="card-produto__desc">${produto.descricao}</p>
        <div class="card-produto__rodape">
          <span class="card-produto__preco">${formatarPreco(produto.preco)}</span>
          <button class="btn-adicionar" data-id="${produto.id}">Adicionar</button>
        </div>
      </div>
    `;
    // onerror na <img>: se a imagem não carregar (arquivo não encontrado), usa o logo como substituto

    elVitrine.appendChild(card); // insere o card construído no final da vitrine no DOM
  });
}


/* ── 6. FUNÇÃO: gerarFiltros ──────────────────────────────── */
/*
   Lê o array de produtos, extrai as categorias únicas e cria
   dinamicamente os botões de filtro no DOM.
   Vantagem: ao adicionar uma nova categoria em "produtos",
   o botão aparece automaticamente, sem alterar o HTML.
*/
function gerarFiltros() {

  // .map() percorre o array e retorna um novo array com apenas o campo "categoria" de cada produto
  // ex: ["pizzas", "pizzas", "sobremesas", "bebidas", "bebidas", "acompanhamentos"]
  // new Set() remove os valores duplicados, mantendo só os únicos
  // [...] (spread) converte o Set de volta para um array
  const categoriasUnicas = [...new Set(produtos.map(function(p) {
    return p.categoria; // retorna só a categoria de cada produto para o .map()
  }))];

  elFiltros.innerHTML = ""; // limpa os botões anteriores para evitar duplicatas

  // cria o botão "Todos" — exibe todos os produtos sem filtro de categoria
  const btnTodos = document.createElement("button");          // cria o elemento <button>
  btnTodos.className         = "filtro-btn filtro-btn--ativo"; // classe CSS + classe de ativo (começa selecionado)
  btnTodos.dataset.categoria = "todos";                        // valor especial que significa "sem filtro"
  btnTodos.textContent       = "Todos";                        // texto visível no botão
  elFiltros.appendChild(btnTodos);                             // insere o botão no container de filtros

  // para cada categoria única encontrada, cria um botão de filtro correspondente
  categoriasUnicas.forEach(function(categoria) {
    const btn = document.createElement("button");         // cria um novo <button> para esta categoria
    btn.className         = "filtro-btn";                 // aplica apenas a classe base (sem ativo)
    btn.dataset.categoria = categoria;                    // armazena a chave da categoria no data-categoria
    btn.textContent       = nomesCategorias[categoria] || categoria;
    // busca o nome amigável no objeto nomesCategorias usando a chave
    // o || categoria é um fallback: se a chave não existir no mapeamento, usa a própria chave como texto
    elFiltros.appendChild(btn); // insere o botão no container de filtros
  });
}


/* ── 7. EVENTO: clique nos botões de filtro de categoria ──── */
/*
   Delegação de eventos: em vez de um listener por botão,
   escuta o clique no container pai e identifica qual botão foi clicado.
   Isso funciona mesmo para botões criados dinamicamente pelo JS.
*/
elFiltros.addEventListener("click", function(evento) {

  // evento.target é o elemento exato clicado pelo usuário
  // .closest(".filtro-btn") sobe na árvore do DOM procurando o botão de filtro
  // retorna null se o usuário clicou fora de qualquer botão de filtro
  const btn = evento.target.closest(".filtro-btn");
  if (!btn) return; // clique fora de um botão de filtro — ignora o evento

  // remove a classe "ativo" de todos os botões de filtro (desmarca o anterior)
  elFiltros.querySelectorAll(".filtro-btn").forEach(function(b) {
    b.classList.remove("filtro-btn--ativo"); // remove a classe de destaque de cada botão
  });
  btn.classList.add("filtro-btn--ativo"); // aplica a classe de destaque no botão que foi clicado

  const categoria = btn.dataset.categoria; // lê a categoria armazenada no atributo data-categoria do botão

  // monta a lista de produtos a exibir:
  // se categoria for "todos", usa o array completo sem filtrar
  // caso contrário, filtra mantendo apenas os produtos dessa categoria
  const listaFiltrada = categoria === "todos"
    ? produtos                                                            // todos os produtos
    : produtos.filter(function(p) { return p.categoria === categoria; }); // apenas os da categoria clicada

  renderizarVitrine(listaFiltrada); // reconstrói a vitrine com os produtos filtrados
});


/* ── 8. INICIALIZAÇÃO DA VITRINE ──────────────────────────── */
// Executado assim que o script é carregado, monta a página pela primeira vez.

gerarFiltros();              // cria todos os botões de filtro com base nas categorias existentes
renderizarVitrine(produtos); // exibe todos os produtos na vitrine (sem filtro inicial)


/* ── 9. ESTADO DO CARRINHO ────────────────────────────────── */
/*
   Array em memória que representa o carrinho atual do usuário.
   Cada elemento tem a forma: { id, nome, preco, quantidade }
   É atualizado pelas funções abaixo e zerado ao recarregar a página.
*/
let carrinho = []; // começa vazio — nenhum item adicionado ainda


/* ── 10. SELEÇÃO DE ELEMENTOS DO CARRINHO ─────────────────── */
// Referências aos elementos HTML do painel lateral do carrinho.

const elListaCarrinho = document.getElementById("lista-carrinho"); // <ul> onde os itens do carrinho são listados
const elCarrinhoVazio = document.getElementById("carrinho-vazio"); // mensagem exibida quando o carrinho está vazio
const elValorTotal    = document.getElementById("valor-total");    // elemento que mostra o valor total do pedido
const elBtnFinalizar  = document.getElementById("btn-finalizar");  // botão de avançar para o checkout


/* ── 11. FUNÇÃO: renderizarCarrinho ───────────────────────── */
/*
   Reconstrói a lista de itens do carrinho no DOM.
   Chamada sempre que o carrinho sofre alguma alteração.
   Também atualiza o valor total e o estado do botão finalizar.
*/
function renderizarCarrinho() {

  elListaCarrinho.innerHTML = ""; // apaga os itens anteriores antes de recriar

  // se o carrinho estiver vazio, exibe a mensagem e desabilita o botão de finalizar
  if (carrinho.length === 0) {
    elCarrinhoVazio.hidden   = false;                    // torna visível a mensagem "seu carrinho está vazio"
    elBtnFinalizar.classList.add("desabilitado");        // adiciona a classe que visualmente desabilita o botão
    elValorTotal.textContent = formatarPreco(0);         // exibe "R$ 0,00" como valor total
    return;                                               // encerra a função — nada mais a renderizar
  }

  elCarrinhoVazio.hidden = true;                         // oculta a mensagem de carrinho vazio
  elBtnFinalizar.classList.remove("desabilitado");       // remove a classe de desabilitado, habilitando o botão

  // percorre cada item do carrinho e cria um elemento <li> para ele
  carrinho.forEach(function(item) {

    const li = document.createElement("li"); // cria o elemento de lista para o item
    li.className  = "item-carrinho";         // aplica a classe CSS do item do carrinho
    li.dataset.id = item.id;                 // armazena o id no data-id para identificação posterior

    // define o HTML interno do item com nome, preço total do item e botões de controle
    li.innerHTML = `
      <div class="item-carrinho__info">
        <span class="item-carrinho__nome">${item.nome}</span>
        <span class="item-carrinho__preco">${formatarPreco(item.preco * item.quantidade)}</span>
      </div>
      <div class="item-carrinho__controles">
        <button class="item-carrinho__qtd-btn" data-acao="diminuir" data-id="${item.id}">−</button>
        <span   class="item-carrinho__qtd">${item.quantidade}</span>
        <button class="item-carrinho__qtd-btn" data-acao="aumentar" data-id="${item.id}">+</button>
        <button class="btn-remover" data-id="${item.id}">Remover</button>
      </div>
    `;
    // item.preco * item.quantidade → subtotal do item (preço unitário vezes a quantidade)
    // data-acao="diminuir" e data-acao="aumentar" → identificam a ação de cada botão de quantidade

    elListaCarrinho.appendChild(li); // insere o <li> no final da lista do carrinho
  });

  // calcula o valor total somando o subtotal de cada item
  // .reduce() percorre o array acumulando os valores; começa em 0 (segundo argumento)
  const total = carrinho.reduce(function(soma, item) {
    return soma + item.preco * item.quantidade; // acumula: soma atual + subtotal do item
  }, 0); // valor inicial do acumulador é 0

  elValorTotal.textContent = formatarPreco(total); // exibe o total formatado no elemento HTML
}


/* ── 12. FUNÇÃO: adicionarAoCarrinho ─────────────────────── */
/*
   Adiciona um produto ao carrinho identificado pelo seu id.
   Se o produto já existir no carrinho, incrementa a quantidade.
   Se for novo, cria uma entrada com quantidade 1.
   Parâmetro:
     id — número inteiro, id do produto a adicionar
*/
function adicionarAoCarrinho(id) {

  // procura o produto no array global de produtos pelo id recebido
  // .find() retorna o objeto encontrado ou undefined se não existir
  const produto = produtos.find(function(p) { return p.id === id; });
  if (!produto) return; // id não corresponde a nenhum produto — encerra sem fazer nada

  // verifica se já existe um item com esse id no carrinho
  const itemExistente = carrinho.find(function(i) { return i.id === id; });

  if (itemExistente) {
    itemExistente.quantidade += 1; // produto já está no carrinho — apenas aumenta a quantidade em 1
  } else {
    // produto ainda não está no carrinho — cria um novo objeto e adiciona ao array
    carrinho.push({
      id:         produto.id,    // id do produto (para encontrar depois no carrinho)
      nome:       produto.nome,  // nome para exibição no painel do carrinho
      preco:      produto.preco, // preço unitário para calcular subtotal e total
      quantidade: 1              // quantidade inicial sempre começa em 1
    });
  }

  renderizarCarrinho(); // atualiza a exibição do carrinho com a nova situação
}


/* ── 13. FUNÇÃO: alterarQuantidade ───────────────────────── */
/*
   Incrementa ou decrementa a quantidade de um item já no carrinho.
   Se a quantidade chegar a zero ao diminuir, o item é removido.
   Parâmetros:
     id   — id do item no carrinho
     acao — string "aumentar" ou "diminuir"
*/
function alterarQuantidade(id, acao) {

  // localiza o item no carrinho pelo id
  const item = carrinho.find(function(i) { return i.id === id; });
  if (!item) return; // item não encontrado no carrinho — encerra sem fazer nada

  if (acao === "aumentar") {
    item.quantidade += 1; // incrementa a quantidade em 1 unidade

  } else if (acao === "diminuir") {
    item.quantidade -= 1; // decrementa a quantidade em 1 unidade

    // se a quantidade chegou a zero (ou menos), remove o item completamente
    if (item.quantidade <= 0) {
      removerDoCarrinho(id); // chama a função de remoção passando o id
      return;                // encerra esta função após delegar a remoção
    }
  }

  renderizarCarrinho(); // atualiza a exibição do carrinho com a quantidade nova
}


/* ── 14. FUNÇÃO: removerDoCarrinho ───────────────────────── */
/*
   Remove completamente um item do carrinho pelo seu id.
   Parâmetro:
     id — id do item a ser removido
*/
function removerDoCarrinho(id) {

  // .filter() cria um novo array contendo apenas os itens cujo id é DIFERENTE do informado
  // o item com o id informado é excluído por não passar no teste i.id !== id
  carrinho = carrinho.filter(function(i) { return i.id !== id; });

  renderizarCarrinho(); // atualiza a exibição do carrinho após a remoção
}


/* ── 15. EVENTO: cliques nos botões "Adicionar" da vitrine ── */
/*
   Delegação de eventos no container da vitrine.
   Captura cliques nos botões "Adicionar" gerados dinamicamente,
   pois esses botões não existiam quando a página carregou.
*/
elVitrine.addEventListener("click", function(evento) {

  // sobe na árvore do DOM a partir do elemento clicado procurando um botão com classe .btn-adicionar
  const btn = evento.target.closest(".btn-adicionar");
  if (!btn) return; // clique em outra área do card (imagem, nome, etc.) — ignora

  // lê o id do produto no atributo data-id do botão e converte para número
  // Number() é obrigatório porque dataset sempre retorna strings, e o id nos produtos é número
  adicionarAoCarrinho(Number(btn.dataset.id));
});


/* ── 16. EVENTO: cliques nos controles do carrinho ─────────── */
/*
   Delegação de eventos na lista do carrinho.
   Captura cliques nos botões + / − (quantidade) e no botão "Remover",
   todos gerados dinamicamente pelo renderizarCarrinho().
*/
elListaCarrinho.addEventListener("click", function(evento) {

  // verifica se o clique foi num botão de ajuste de quantidade (+ ou −)
  const btnQtd = evento.target.closest(".item-carrinho__qtd-btn");

  // verifica se o clique foi no botão "Remover" do item
  const btnRemover = evento.target.closest(".btn-remover");

  if (btnQtd) {
    // data-id contém o id do item; data-acao contém "aumentar" ou "diminuir"
    alterarQuantidade(Number(btnQtd.dataset.id), btnQtd.dataset.acao);
    return; // encerra após tratar o clique de quantidade — evita cair no if de remover
  }

  if (btnRemover) {
    removerDoCarrinho(Number(btnRemover.dataset.id)); // remove o item pelo id lido do data-id
  }
});


/* ── 17. EVENTO: botão "Finalizar" — salvar e ir ao checkout ─ */
/*
   Ao clicar no botão de finalizar:
   - Se o carrinho estiver vazio (botão desabilitado), bloqueia a navegação.
   - Se o carrinho tiver itens, converte o array para JSON, salva no
     sessionStorage e permite que o link navegue para checkout.html.
*/
elBtnFinalizar.addEventListener("click", function(evento) {

  // verifica se a classe "desabilitado" está presente (carrinho vazio)
  if (elBtnFinalizar.classList.contains("desabilitado")) {
    evento.preventDefault(); // cancela o comportamento padrão do link (não redireciona)
    return;                  // encerra a função — não há itens para finalizar
  }

  // JSON.stringify() serializa o array de objetos do carrinho para uma string de texto JSON
  // sessionStorage.setItem() grava essa string com a chave "carrinho"
  // sessionStorage persiste enquanto a aba do navegador estiver aberta (apagado ao fechar)
  sessionStorage.setItem("carrinho", JSON.stringify(carrinho));
  // após salvar, o comportamento padrão do link <a> redireciona para checkout.html
});
