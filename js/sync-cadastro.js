/* ============================================================
   SYNC-CADASTRO.JS — Preenche a urna sob demanda, só com quem se
   cadastrou HOJE
   ------------------------------------------------------------
   A urna só é preenchida/atualizada a partir do cadastro quando
   o botão "Atualizar participantes" é clicado — não há busca
   automática ao carregar a página nem antes de cada sorteio.

   Cada sorteio é por data: das pessoas que vêm do cadastro, só
   entram na urna as que se cadastraram no dia de hoje (comparado
   com a data do computador rodando o sorteio). Cadastros de dias
   anteriores ficam de fora automaticamente.

   Requer que js/google-sheets.js seja carregado ANTES deste
   arquivo, e que js/estado.js (que define `parse`, `namesEl`,
   `dataDeHojeISO`) já tenha sido carregado também — ver ordem
   dos <script> no sorteio.html.
   ============================================================ */

(function () {
  const statusEl = document.getElementById("syncStatus");

  function setStatus(state) {
    if (!statusEl) return;

    const messages = {
      loading: { text: "🔄 Buscando participantes de hoje no cadastro…", cls: "warn" },
      not_configured: { text: "⚠️ Sincronização automática não configurada — preencha manualmente abaixo.", cls: "warn" },
      connected: { text: "✅ Lista atualizada com os participantes de hoje.", cls: "ok" },
      empty: { text: "ℹ️ Nenhum participante cadastrado hoje ainda.", cls: "warn" },
      error: { text: "⚠️ Não foi possível buscar o cadastro agora — você pode colar os nomes manualmente.", cls: "warn" },
    };

    const info = messages[state];
    if (!info) { statusEl.classList.remove("show"); return; }

    statusEl.textContent = info.text;
    statusEl.className = `sync-status show ${info.cls}`;
  }

  /** Busca os participantes do cadastro e preenche a urna só com quem se cadastrou hoje. */
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

    const hoje = dataDeHojeISO();
    const nomesDeHoje = result.participantes
      .filter(p => p.data === hoje)
      .map(p => p.nome);

    if (nomesDeHoje.length === 0) {
      namesEl.value = "";
      if (typeof parse === "function") parse();
      setStatus("empty");
      return;
    }

    // Preenche a textarea só com quem se cadastrou hoje e reaproveita
    // o parse() já existente em estado.js para recalcular contagem,
    // duplicados e estado da urna.
    namesEl.value = nomesDeHoje.join("\n");
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
