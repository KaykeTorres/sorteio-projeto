/* ============================================================
   GOOGLE-SHEETS.JS — Integração automática com o Cadastro
   ------------------------------------------------------------
   Este arquivo busca, na mesma planilha do Google Sheets usada
   pelo formulário de cadastro (+Esporte −Remédio), a lista de
   nomes dos participantes — e preenche a urna do sorteio
   automaticamente, sem precisar copiar e colar nada.

   COMO CONFIGURAR:
   1. Use a MESMA URL do Apps Script já publicada para o
      formulário de cadastro (a que termina em /exec).
   2. Cole essa URL abaixo, em SHEET_WEBAPP_URL.
   3. Garanta que o apps-script.gs publicado já tenha a ação
      "?action=nomes" (ver apps-script.gs do projeto de cadastro).

   Enquanto SHEET_WEBAPP_URL não for configurada, o sorteio
   continua funcionando normalmente em modo manual: a pessoa
   pode colar os nomes na caixa de texto como antes.
   ============================================================ */

// 🔗 Cole aqui a MESMA URL do Apps Script usada no formulário de cadastro (termina em /exec)
const SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzTfFDsq6CqwmdTUTO7pQPf0fMhbPDX9eL0EUcY7WgdA83z-sYxKRppw2xgwuiGVeMR/exec";




/**
 * Busca a lista de nomes (texto puro, um por linha) direto da
 * planilha de cadastro, através do Apps Script.
 * @returns {Promise<{ok: boolean, texto: string, message?: string}>}
 */
async function fetchNomesParaSorteio() {
  if (!SHEET_WEBAPP_URL) {
    return { ok: false, texto: "", message: "not_configured" };
  }

  try {
    const response = await fetch(`${SHEET_WEBAPP_URL}?action=nomes`, { method: "GET" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const texto = await response.text();
    return { ok: true, texto: texto.trim() };
  } catch (err) {
    console.error("[google-sheets.js] Falha ao buscar nomes do cadastro:", err);
    return { ok: false, texto: "", message: "fetch_error" };
  }
}

function isGoogleSheetsConfigured() {
  return Boolean(SHEET_WEBAPP_URL);
}

window.GoogleSheets = {
  fetchNomesParaSorteio,
  isGoogleSheetsConfigured,
};
