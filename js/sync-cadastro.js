/* ============================================================
   SYNC-CADASTRO.JS — Preenche a urna sob demanda
   ------------------------------------------------------------
   A urna só é preenchida/atualizada a partir do cadastro quando
   o botão "Atualizar do cadastro" é clicado — não há busca
   automática ao carregar a página nem antes de cada sorteio.

   Requer que js/google-sheets.js seja carregado ANTES deste
   arquivo, e que js/estado.js (que define `parse`, `namesEl`)
   já tenha sido carregado também — ver ordem dos <script> no
   sorteio.html.
   ============================================================ */

(function () {
  const statusEl = document.getElementById("syncStatus");

  function setStatus(state) {
    if (!statusEl) return;

    const messages = {
      loading: { text: "🔄 Buscando participantes do cadastro…", cls: "warn" },
      not_configured: { text: "⚠️ Sincronização automática não configurada — preencha manualmente abaixo.", cls: "warn" },
      connected: { text: "✅ Lista atualizada a partir do cadastro.", cls: "ok" },
      empty: { text: "ℹ️ Nenhum participante cadastrado ainda.", cls: "warn" },
      error: { text: "⚠️ Não foi possível buscar o cadastro agora — você pode colar os nomes manualmente.", cls: "warn" },
    };

    const info = messages[state];
    if (!info) { statusEl.classList.remove("show"); return; }

    statusEl.textContent = info.text;
    statusEl.className = `sync-status show ${info.cls}`;
  }

  /** Busca os nomes do cadastro e preenche a textarea de participantes. */
  async function syncNomesDoCadastro() {
    if (!window.GoogleSheets || !window.GoogleSheets.isGoogleSheetsConfigured()) {
      setStatus("not_configured");
      return;
    }

    setStatus("loading");
    const result = await window.GoogleSheets.fetchNomesParaSorteio();

    if (!result.ok) {
      setStatus("error");
      return;
    }

    if (!result.texto) {
      setStatus("empty");
      return;
    }

    // Preenche a textarea com os nomes vindos do cadastro e
    // reaproveita o parse() já existente em estado.js para
    // recalcular contagem, duplicados e estado da urna.
    namesEl.value = result.texto;
    if (typeof parse === "function") parse();
    setStatus("connected");
  }

  // Exposto para um botão "Atualizar agora" no HTML, se usado.
  window.SyncCadastro = { syncNomesDoCadastro };

  document.addEventListener("DOMContentLoaded", () => {
    const btnAtualizar = document.getElementById("btnAtualizarCadastro");
    if (btnAtualizar) {
      btnAtualizar.addEventListener("click", syncNomesDoCadastro);
    }
  });
})();
