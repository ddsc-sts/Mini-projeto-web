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
   Adicione ou remova objetos aqui para atualizar o cardápio.
   Campos obrigatórios: id, nome, descricao, preco, categoria, imagem.
   O campo "imagem" deve ser o caminho a partir da raiz do projeto.
*/
const produtos = [
    {
      id: 1,
      nome: "Pizza Calabresa Defumada",
      descricao: "Mussarela, calabresa defumada fatiada e cebola.",
      preco: 54.90,
      categoria: "pizzas",
      imagem: "img/produtos/pizza-calabresa.jpg"
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
     Mapeia o valor interno (data-categoria) para o texto
     que aparece nos botões de filtro.
  */
  const nomesCategorias = {
    pizzas:          "Pizzas",
    sobremesas:      "Pizzas Doces / Sobremesas",
    bebidas:         "Drinks e Bebidas",
    acompanhamentos: "Acompanhamentos"
  };
  
  
  /* ── 3. SELEÇÃO DE ELEMENTOS DO DOM ───────────────────────── */
  const elFiltros      = document.getElementById("filtros-categorias");
  const elVitrine      = document.getElementById("vitrine-produtos");
  const elVitrineVazia = document.getElementById("vitrine-vazia");
  
  
  /* ── 4. FORMATAR PREÇO ────────────────────────────────────── */
  /*
     Converte número (54.9) para string no formato "R$ 54,90".
  */
  function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }
  
  
  /* ── 5. RENDERIZAR VITRINE ────────────────────────────────── */
  /*
     Recebe um array de produtos e injeta os cards no DOM.
     Exibe a mensagem de vazio se o array estiver vazio.
  */
  function renderizarVitrine(lista) {
    elVitrine.innerHTML = "";
  
    if (lista.length === 0) {
      elVitrineVazia.hidden = false;
      return;
    }
  
    elVitrineVazia.hidden = true;
  
    lista.forEach(function(produto) {
      const card = document.createElement("article");
      card.className = "card-produto";
      card.dataset.id        = produto.id;
      card.dataset.categoria = produto.categoria;
  
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
  
      elVitrine.appendChild(card);
    });
  }
  
  
  /* ── 6. GERAR FILTROS ─────────────────────────────────────── */
  /*
     Coleta as categorias únicas da lista de produtos,
     cria o botão "Todos" mais um botão por categoria
     e injeta no #filtros-categorias.
  */
  function gerarFiltros() {
    const categoriasUnicas = [...new Set(produtos.map(function(p) {
      return p.categoria;
    }))];
  
    elFiltros.innerHTML = "";
  
    // botão "Todos"
    const btnTodos = document.createElement("button");
    btnTodos.className       = "filtro-btn filtro-btn--ativo";
    btnTodos.dataset.categoria = "todos";
    btnTodos.textContent     = "Todos";
    elFiltros.appendChild(btnTodos);
  
    // um botão por categoria encontrada na lista
    categoriasUnicas.forEach(function(categoria) {
      const btn = document.createElement("button");
      btn.className          = "filtro-btn";
      btn.dataset.categoria  = categoria;
      btn.textContent        = nomesCategorias[categoria] || categoria;
      elFiltros.appendChild(btn);
    });
  }
  
  
  /* ── 7. LÓGICA DE FILTRO ──────────────────────────────────── */
  /*
     Ao clicar em qualquer botão de filtro:
       - move a classe ativo para o botão clicado
       - filtra o array de produtos pela categoria
       - re-renderiza a vitrine com o resultado
  */
  elFiltros.addEventListener("click", function(evento) {
    const btn = evento.target.closest(".filtro-btn");
    if (!btn) return;
  
    // atualiza botão ativo
    elFiltros.querySelectorAll(".filtro-btn").forEach(function(b) {
      b.classList.remove("filtro-btn--ativo");
    });
    btn.classList.add("filtro-btn--ativo");
  
    const categoria = btn.dataset.categoria;
  
    const listafiltrada = categoria === "todos"
      ? produtos
      : produtos.filter(function(p) { return p.categoria === categoria; });
  
    renderizarVitrine(listafiltrada);
  });
  
  
  /* ── 8. INICIALIZAÇÃO ─────────────────────────────────────── */
  gerarFiltros();
  renderizarVitrine(produtos);
  
  
  /* ── 9. ESTADO DO CARRINHO ────────────────────────────────── */
  /*
     Array em memória. Cada item: { id, nome, preco, quantidade }
  */
  let carrinho = [];
  
  
  /* ── 10. ELEMENTOS DO CARRINHO ────────────────────────────── */
  const elListaCarrinho = document.getElementById("lista-carrinho");
  const elCarrinhoVazio = document.getElementById("carrinho-vazio");
  const elValorTotal    = document.getElementById("valor-total");
  const elBtnFinalizar  = document.getElementById("btn-finalizar");
  
  
  /* ── 11. RENDERIZAR CARRINHO ──────────────────────────────── */
  /*
     Limpa a lista e re-injeta um <li> por item do carrinho.
     Atualiza o total e o estado do botão finalizar.
  */
  function renderizarCarrinho() {
    elListaCarrinho.innerHTML = "";
  
    if (carrinho.length === 0) {
      elCarrinhoVazio.hidden    = false;
      elBtnFinalizar.classList.add("desabilitado");
      elValorTotal.textContent  = formatarPreco(0);
      return;
    }
  
    elCarrinhoVazio.hidden = true;
    elBtnFinalizar.classList.remove("desabilitado");
  
    carrinho.forEach(function(item) {
      const li = document.createElement("li");
      li.className   = "item-carrinho";
      li.dataset.id  = item.id;
  
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
  
      elListaCarrinho.appendChild(li);
    });
  
    // recalcula e exibe total
    const total = carrinho.reduce(function(soma, item) {
      return soma + item.preco * item.quantidade;
    }, 0);
  
    elValorTotal.textContent = formatarPreco(total);
  }
  
  
  /* ── 12. ADICIONAR AO CARRINHO ────────────────────────────── */
  function adicionarAoCarrinho(id) {
    const produto = produtos.find(function(p) { return p.id === id; });
    if (!produto) return;
  
    const itemExistente = carrinho.find(function(i) { return i.id === id; });
  
    if (itemExistente) {
      itemExistente.quantidade += 1;
    } else {
      carrinho.push({
        id:         produto.id,
        nome:       produto.nome,
        preco:      produto.preco,
        quantidade: 1
      });
    }
  
    renderizarCarrinho();
  }
  
  
  /* ── 13. ALTERAR QUANTIDADE ───────────────────────────────── */
  function alterarQuantidade(id, acao) {
    const item = carrinho.find(function(i) { return i.id === id; });
    if (!item) return;
  
    if (acao === "aumentar") {
      item.quantidade += 1;
    } else if (acao === "diminuir") {
      item.quantidade -= 1;
      // remove o item se quantidade chegar a zero
      if (item.quantidade <= 0) {
        removerDoCarrinho(id);
        return;
      }
    }
  
    renderizarCarrinho();
  }
  
  
  /* ── 14. REMOVER DO CARRINHO ──────────────────────────────── */
  function removerDoCarrinho(id) {
    carrinho = carrinho.filter(function(i) { return i.id !== id; });
    renderizarCarrinho();
  }
  
  
  /* ── 15. DELEGAÇÃO DE EVENTOS — VITRINE ───────────────────── */
  /*
     Escuta cliques nos botões "Adicionar" gerados dinamicamente.
  */
  elVitrine.addEventListener("click", function(evento) {
    const btn = evento.target.closest(".btn-adicionar");
    if (!btn) return;
    adicionarAoCarrinho(Number(btn.dataset.id));
  });
  
  
  /* ── 16. DELEGAÇÃO DE EVENTOS — CARRINHO ──────────────────── */
  /*
     Escuta cliques nos botões de quantidade e remover.
  */
  elListaCarrinho.addEventListener("click", function(evento) {
    const btnQtd     = evento.target.closest(".item-carrinho__qtd-btn");
    const btnRemover = evento.target.closest(".btn-remover");
  
    if (btnQtd) {
      alterarQuantidade(Number(btnQtd.dataset.id), btnQtd.dataset.acao);
      return;
    }
  
    if (btnRemover) {
      removerDoCarrinho(Number(btnRemover.dataset.id));
    }
  });
  
  
  /* ── 17. SALVAR CARRINHO E IR PARA CHECKOUT ───────────────── */
  /*
     Ao clicar em "Avançar para Checkout", salva o carrinho no
     sessionStorage para o checkout.js ler na próxima página.
     O link só funciona se o botão não estiver desabilitado.
  */
  elBtnFinalizar.addEventListener("click", function(evento) {
    if (elBtnFinalizar.classList.contains("desabilitado")) {
      evento.preventDefault();
      return;
    }
    sessionStorage.setItem("carrinho", JSON.stringify(carrinho));
  });