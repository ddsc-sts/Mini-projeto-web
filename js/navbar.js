/* ============================================================
   NAVBAR — Controle de estado de autenticação na barra de navegação
   Responsabilidades deste arquivo:
     1. Verificar se há um usuário logado no localStorage
     2. Se logado: substituir os botões de login/cadastro pelo painel do usuário
     3. Se não logado: manter os botões originais (já estão no HTML)
     4. Implementar a função de logout (limpar sessão e redirecionar)
   Uso: inclua este script em TODAS as páginas, antes dos scripts específicos.
   ============================================================ */


/* ── 1. AGUARDAR O DOM ESTAR PRONTO ──────────────────────── */
/*
   DOMContentLoaded garante que o script só executa após o HTML
   ser completamente analisado. Evita erros de "elemento não encontrado".
*/
document.addEventListener("DOMContentLoaded", function () {

  /* ── 2. LER O USUÁRIO LOGADO DO localStorage ─────────── */
  /*
     A chave "usuarioLogado" é salva pelo login.js quando a
     autenticação é bem-sucedida. Contém { nome, email, senha }.
     Se a chave não existir, getItem retorna null.
  */
  const dadosSalvos  = localStorage.getItem("usuarioLogado"); // tenta ler a sessão do usuário
  const navAction    = document.querySelector(".nav-action");  // div que contém os botões da navbar

  // se não há nenhum dos dois, não há nada a fazer — encerra
  if (!navAction) return;


  /* ── 3. EXIBIR PAINEL DO USUÁRIO (logado) ────────────── */
  if (dadosSalvos) {

    const usuario = JSON.parse(dadosSalvos); // converte a string JSON de volta para objeto

    // pega apenas o primeiro nome para exibição compacta na navbar
    const primeiroNome = usuario.nome.split(" ")[0];

    /*
       Substitui os botões "Entrar" e "Criar conta" por:
         - saudação com o primeiro nome do usuário
         - link "Meu Perfil" → perfil.html
         - botão "Sair" que chama logout()
    */
    navAction.innerHTML = `
      <span class="nav-usuario__saudacao">Olá, ${primeiroNome}</span>
      <a href="perfil.html" class="btn-login nav-usuario__perfil">Meu Perfil</a>
      <button class="btn-cadastro nav-usuario__sair" onclick="logout()">Sair</button>
    `;
  }

  /* Se dadosSalvos for null (não logado), o HTML original com
     os botões "Entrar" e "Criar conta" permanece intacto. */

}); // fim do DOMContentLoaded


/* ── 4. FUNÇÃO GLOBAL: logout ────────────────────────────── */
/*
   Remove a sessão do usuário do localStorage e redireciona para a
   página de login. Declarada fora do DOMContentLoaded para que o
   atributo onclick="logout()" do botão consiga acessá-la no escopo global.
*/
function logout() {
  localStorage.removeItem("usuarioLogado"); // apaga a chave de sessão — usuário deslogado
  window.location.href = "login.html";       // redireciona para a tela de login
}
