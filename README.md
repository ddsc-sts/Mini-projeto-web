# 🍕 Pizzaria Dalegé - Cardápio Digital

> Projeto desenvolvido para a disciplina de Desenvolvimento de Sistemas do curso de ADS.

A **Pizzaria Dalegé** é um sistema de cardápio digital interativo projetado para modernizar o atendimento em restaurantes. O cliente escaneia o QR Code na mesa, acessa o cardápio, monta seu pedido e finaliza o cadastro, gerando um número de pedido para atendimento no balcão.

O nome **Dalegé** é uma homenagem aos sócios fundadores: **Da**niel, **Le**onardo e **Ge**der.

---

## 🚀 Funcionalidades (Requisitos Atendidos)

O sistema cumpre todos os requisitos técnicos exigidos, com foco em lógica de programação e manipulação do DOM:

- [x] **Cardápio Dinâmico:** Listagem de produtos gerada via JavaScript.
- [x] **CRUD do Carrinho:** Adição e remoção de itens em tempo real.
- [x] **Cálculo Automático:** Atualização instantânea do valor total do pedido.
- [x] **Persistência de Dados:** Uso de `localStorage` para manter o carrinho ativo mesmo após atualizar a página.
- [x] **Validação de Formulário:** Verificação rigorosa de e-mail, campos obrigatórios e mesa na página de checkout.
- [x] **UX/UI Profissional:** Layout responsivo utilizando Flexbox.
- [x] **Geração de Protocolo:** Sistema gera um número aleatório de pedido para o cliente.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído "raiz", utilizando as tecnologias base da web, sem frameworks externos:

* **HTML5:** Estrutura semântica das 4 páginas (Home, Cardápio, Checkout, Confirmação).
* **CSS3:** Estilização personalizada, layouts com Flexbox e design responsivo.
* **JavaScript (ES6):** Toda a lógica do carrinho, validações e armazenamento local.

---

## 📁 Estrutura do Projeto

```bash
MINI-PROJETO-WEB/
├── css/
│   └── style.css
├── img/
│   ├── banners/
│   │   ├── banner-acompanhamentos.png
│   │   ├── banner-bebida.png
│   │   ├── banner-catPizza.png
│   │   ├── banner-principal.png
│   │   └── banner-sobremesa.png
│   └── icons/
├── js/
│   ├── cadastro.js
│   ├── cardapio.js
│   ├── checkout.js
│   ├── confirmacao.js
│   ├── login.js
│   ├── navbar.js
│   └── perfil.js
├── cadastro.html
├── cardapio.html
├── checkout.html
├── confirmacao.html
├── index.html
├── login.html
├── perfil.html
├── README.md
└── sobre.html