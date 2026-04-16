/* ============================================================
   NAVBAR — Autenticação + Menu Mobile Hamburguer
   Responsabilidades deste arquivo:
     1. Verificar se há um usuário logado no localStorage
     2. Se logado: substituir os botões de login/cadastro pelo painel do usuário
     3. Se não logado: manter os botões originais (já estão no HTML)
     4. Implementar a função de logout (limpar sessão e redirecionar)
     5. Controlar abertura/fechamento do menu mobile (hamburguer)
   Uso: inclua este script em TODAS as páginas, antes do </body>.
   ============================================================ */


/* ── 1. AGUARDAR O DOM ESTAR PRONTO ──────────────────────── */
document.addEventListener("DOMContentLoaded", function () {


  /* ══════════════════════════════════════════════════════════
     BLOCO A — AUTENTICAÇÃO
     Verifica localStorage e troca botões se usuário estiver logado
     ══════════════════════════════════════════════════════════ */

  const dadosSalvos = localStorage.getItem("usuarioLogado");

  // Seleciona TANTO o container do desktop quanto o do mobile
  const navActions = document.querySelectorAll(".nav-action, .nav-mobile__action");

  if (navActions.length > 0 && dadosSalvos) {

    const usuario      = JSON.parse(dadosSalvos);
    const primeiroNome = usuario.nome.split(" ")[0];

    const painelLogadoHTML = `
      <span class="nav-usuario__saudacao">Olá, ${primeiroNome}</span>
      <a href="perfil.html" class="btn-login nav-usuario__perfil">Meu Perfil</a>
      <button class="btn-cadastro nav-usuario__sair" onclick="logout()">Sair</button>
    `;

    navActions.forEach(nav => {
      nav.innerHTML = painelLogadoHTML;
    });
  }


  /* ══════════════════════════════════════════════════════════
     BLOCO B — MENU MOBILE (hamburguer)
     Só executa se os elementos existirem na página
     ══════════════════════════════════════════════════════════ */

  const toggle    = document.querySelector(".nav-toggle");
  const navMobile = document.querySelector(".nav-mobile");
  const overlay   = document.querySelector(".nav-mobile__overlay");

  // Se não há menu mobile nesta página, encerra aqui
  if (!toggle || !navMobile) return;

  /* Abre / fecha a gaveta lateral */
  toggle.addEventListener("click", function () {
    const aberto = navMobile.classList.toggle("aberto");
    toggle.classList.toggle("aberto", aberto);
    toggle.setAttribute("aria-expanded", aberto);
    document.body.style.overflow = aberto ? "hidden" : ""; // trava scroll do fundo
  });

  /* Fecha ao clicar no overlay escuro */
  if (overlay) {
    overlay.addEventListener("click", fecharMenu);
  }

  /* Fecha ao clicar em qualquer link do menu */
  document.querySelectorAll(".nav-mobile__links a").forEach(function (link) {
    link.addEventListener("click", fecharMenu);
  });

  /* Fecha ao clicar nos botões de auth do menu mobile */
  document.querySelectorAll(".nav-mobile__action a, .nav-mobile__action button").forEach(function (btn) {
    btn.addEventListener("click", fecharMenu);
  });

  /* Fecha com a tecla Escape */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") fecharMenu();
  });

  /* Função auxiliar: fecha e limpa tudo */
  function fecharMenu() {
    navMobile.classList.remove("aberto");
    toggle.classList.remove("aberto");
    toggle.setAttribute("aria-expanded", false);
    document.body.style.overflow = "";
  }

}); // fim do DOMContentLoaded


/* ── FUNÇÃO GLOBAL: logout ───────────────────────────────── */
function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "login.html";
}