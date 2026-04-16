/* ============================================================
   LOGIN — Validação e autenticação do formulário de login
   Responsabilidades deste arquivo:
     1. Selecionar os campos e elementos do formulário
     2. Exibir / ocultar mensagens de erro inline
     3. Validar formato do e-mail e preenchimento da senha
     4. Verificar as credenciais contra os usuários salvos no localStorage
     5. Salvar o usuário logado na sessão e redirecionar para o cardápio
   ============================================================ */


/* ── 1. SELEÇÃO DE ELEMENTOS ──────────────────────────────── */
// Armazena referências aos elementos do formulário para evitar
// buscas repetidas no DOM durante a validação.

const formLogin    = document.getElementById("form-login");    // o elemento <form> de login
const inputEmail   = document.getElementById("email");         // campo de texto: e-mail
const inputSenha   = document.getElementById("senha");         // campo de senha
const mensagemErro = document.getElementById("mensagem-erro"); // parágrafo onde o erro é exibido


/* ── 2. FUNÇÃO: mostrarErro ───────────────────────────────── */
/*
   Exibe uma mensagem de erro no parágrafo #mensagem-erro.
   Parâmetro:
     texto — string com a mensagem a ser exibida ao usuário
*/
function mostrarErro(texto) {
  mensagemErro.textContent = texto;  // define o texto da mensagem de erro
  mensagemErro.hidden      = false;  // torna o parágrafo visível (remove o atributo hidden)
}


/* ── 3. FUNÇÃO: limparErro ────────────────────────────────── */
/*
   Oculta e apaga a mensagem de erro.
   Chamada no início de cada tentativa de envio para
   limpar erros de tentativas anteriores.
*/
function limparErro() {
  mensagemErro.textContent = "";   // apaga o texto da mensagem
  mensagemErro.hidden      = true; // oculta o parágrafo de erro
}


/* ── 4. FUNÇÃO: validarFormulario ─────────────────────────── */
/*
   Verifica se os campos de e-mail e senha foram preenchidos corretamente.
   Esta função valida apenas o FORMATO dos campos (não autentica o usuário).
   Retorna true se tudo estiver válido, ou false após
   exibir a primeira mensagem de erro encontrada.
*/
function validarFormulario() {

  const email = inputEmail.value.trim(); // lê o e-mail e remove espaços das bordas
  const senha = inputSenha.value;        // lê a senha (sem .trim() para não alterar o valor digitado)

  // valida se o e-mail foi preenchido e contém "@" (verificação básica de formato)
  if (!email || !email.includes("@")) {
    mostrarErro("Por favor, informe um e-mail válido."); // exibe mensagem de erro de e-mail
    inputEmail.focus();                                  // move o foco para o campo de e-mail
    return false;                                         // retorna false indicando validação falhou
  }

  // valida se o campo de senha não está vazio
  if (!senha) {
    mostrarErro("Por favor, informe sua senha."); // exibe mensagem de erro de senha
    inputSenha.focus();                            // move o foco para o campo de senha
    return false;
  }

  return true; // ambos os campos passaram na validação — formulário válido
}


/* ── 5. FUNÇÃO: autenticarUsuario ────────────────────────── */
/*
   Verifica se as credenciais digitadas (e-mail + senha) correspondem
   a algum usuário cadastrado no localStorage.
   Etapas:
     a) Recupera o array de usuários salvos pelo cadastro.js
     b) Busca um usuário com e-mail E senha iguais ao digitado
     c) Se encontrado, salva o usuário logado na chave "usuarioLogado"
        para que outras páginas (cardápio, checkout) possam usar o nome
     d) Retorna true se autenticado, false se as credenciais não baterem
*/
function autenticarUsuario(email, senha) {

  // a) Carrega o array de usuários cadastrados; se não existir, usa array vazio
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

  // b) Procura um usuário cujo e-mail (case-insensitive) e senha sejam idênticos
  const usuarioEncontrado = usuarios.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && // compara e-mail ignorando maiúsculas
      u.senha === senha                                  // compara senha (sensível a maiúsculas)
  );

  // Se nenhum usuário foi encontrado, as credenciais são inválidas
  if (!usuarioEncontrado) {
    mostrarErro("E-mail ou senha incorretos. Verifique e tente novamente."); // mensagem genérica por segurança
    inputEmail.focus(); // volta o foco para o campo de e-mail
    return false;       // retorna false indicando autenticação falhou
  }

  // c) Persiste o usuário logado no localStorage para uso nas outras páginas
  //    (ex.: exibir "Olá, João" no cardápio ou preencher nome no checkout)
  localStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));

  return true; // autenticação bem-sucedida
}


/* ── 6. EVENTO: submit do formulário de login ─────────────── */
/*
   Escuta o evento "submit" do formulário (acionado ao clicar em "Entrar").
   Impede o envio padrão do HTML, valida o formato dos campos e,
   em seguida, verifica as credenciais no localStorage.
   Se tudo estiver correto, redireciona para o cardápio.
*/
formLogin.addEventListener("submit", function (evento) {

  evento.preventDefault(); // cancela o comportamento padrão que recarregaria a página

  limparErro(); // apaga qualquer mensagem de erro de tentativas anteriores

  // 1ª barreira: valida o formato dos campos — se falhar, encerra aqui
  if (!validarFormulario()) return;

  // lê os valores para passar à autenticação
  const email = inputEmail.value.trim();
  const senha = inputSenha.value;

  // 2ª barreira: confere as credenciais no localStorage — se falhar, encerra aqui
  if (!autenticarUsuario(email, senha)) return;

  // Credenciais válidas: redireciona o usuário para a página do cardápio
  window.location.href = "cardapio.html";
});
