/* ============================================================
   CADASTRO — Validação e envio do formulário de criação de conta
   Responsabilidades deste arquivo:
     1. Selecionar os campos e elementos do formulário
     2. Exibir / ocultar mensagens de erro inline
     3. Validar nome, e-mail, senha e confirmação de senha
     4. Salvar o usuário no localStorage
     5. Redirecionar para o login após cadastro bem-sucedido
   ============================================================ */


/* ── 1. SELEÇÃO DE ELEMENTOS ──────────────────────────────── */
// Armazena referências aos elementos do formulário para evitar
// buscas repetidas no DOM durante a validação.

const formCadastro   = document.getElementById("form-cadastro");    // o elemento <form> principal
const inputNome      = document.getElementById("nome");              // campo de texto: nome completo
const inputEmail     = document.getElementById("email");             // campo de texto: e-mail
const inputSenha     = document.getElementById("senha");             // campo de senha
const inputConfirmar = document.getElementById("confirmar-senha");   // campo de confirmação de senha
const mensagemErro   = document.getElementById("mensagem-erro");     // parágrafo onde o erro é exibido


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
  mensagemErro.textContent = ""; // apaga o texto da mensagem
  mensagemErro.hidden      = true; // oculta o parágrafo de erro
}


/* ── 4. FUNÇÃO: validarFormulario ─────────────────────────── */
/*
   Verifica cada campo do formulário em sequência.
   Retorna true se tudo estiver válido, ou false após
   exibir a primeira mensagem de erro encontrada.
*/
function validarFormulario() {

  const nome      = inputNome.value.trim();      // lê o valor do campo nome e remove espaços das bordas
  const email     = inputEmail.value.trim();     // lê e limpa o e-mail digitado
  const senha     = inputSenha.value;            // lê a senha (sem .trim() para preservar espaços intencionais)
  const confirmar = inputConfirmar.value;        // lê a confirmação de senha

  // valida se o nome foi preenchido (não pode ser vazio após o trim)
  if (!nome) {
    mostrarErro("Por favor, informe seu nome completo."); // exibe mensagem de erro específica
    inputNome.focus();                                    // move o foco para o campo com problema
    return false;                                          // retorna false indicando validação falhou
  }

  // valida se o e-mail foi preenchido e contém "@" (verificação básica de formato)
  if (!email || !email.includes("@")) {
    mostrarErro("Por favor, informe um e-mail válido."); // exibe mensagem de erro de e-mail
    inputEmail.focus();                                  // move o foco para o campo de e-mail
    return false;
  }

  // valida se a senha tem ao menos 8 caracteres (regra mínima de segurança)
  if (senha.length < 8) {
    mostrarErro("A senha deve ter no mínimo 8 caracteres."); // informa o requisito mínimo
    inputSenha.focus();                                       // move o foco para o campo de senha
    return false;
  }

  // valida se os dois campos de senha são idênticos
  if (senha !== confirmar) {
    mostrarErro("As senhas não coincidem. Verifique e tente novamente."); // informa a divergência
    inputConfirmar.focus();                                                // foco no campo de confirmação
    return false;
  }

  return true; // todos os campos passaram nas validações — formulário válido
}


/* ── 5. FUNÇÃO: salvarUsuario ────────────────────────────── */
/*
   Salva o novo usuário na lista de usuários cadastrados no localStorage.
   A lista é um array JSON identificado pela chave "usuarios".
   Etapas:
     a) Carrega a lista existente (ou cria um array vazio se não existir)
     b) Verifica se o e-mail já está cadastrado para evitar duplicatas
     c) Adiciona o novo objeto { nome, email, senha } ao array
     d) Serializa e salva o array atualizado no localStorage
   Retorna true se salvo com sucesso, ou false se o e-mail já existe.
*/
function salvarUsuario(nome, email, senha) {

  // a) Recupera o array de usuários já cadastrados; se não existir, usa array vazio
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

  // b) Verifica se já existe um usuário com o mesmo e-mail (case-insensitive)
  const jaExiste = usuarios.some(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (jaExiste) {
    mostrarErro("Este e-mail já está cadastrado. Faça login ou use outro e-mail.");
    inputEmail.focus(); // leva o foco de volta ao campo de e-mail
    return false;       // retorna false para interromper o cadastro
  }

  // c) Cria o objeto do novo usuário e o adiciona ao array
  usuarios.push({ nome, email, senha });

  // d) Serializa o array atualizado e persiste no localStorage
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  return true; // usuário salvo com sucesso
}


/* ── 6. EVENTO: submit do formulário de cadastro ─────────── */
/*
   Escuta o evento "submit" do formulário (acionado ao clicar em "Criar Conta").
   Impede o envio padrão do HTML, valida os campos e,
   se tudo estiver correto, salva o usuário e redireciona para o login.
*/
formCadastro.addEventListener("submit", function (evento) {

  evento.preventDefault(); // cancela o envio padrão do formulário (que recarregaria a página)

  limparErro(); // apaga qualquer mensagem de erro exibida em tentativas anteriores

  // executa a validação — se retornar false, algum campo está inválido e a função encerra
  if (!validarFormulario()) return;

  // lê os valores finais dos campos após a validação ter passado
  const nome  = inputNome.value.trim();
  const email = inputEmail.value.trim();
  const senha = inputSenha.value;

  // tenta salvar o usuário no localStorage; se retornar false (e-mail duplicado), encerra
  if (!salvarUsuario(nome, email, senha)) return;

  // feedback visual de sucesso e redirecionamento para o login
  alert("Conta criada com sucesso! Faça login para continuar.");
  window.location.href = "login.html"; // redireciona o usuário para a página de login
});
