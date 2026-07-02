/* ============================================================
   GOOGLE-SHEETS.JS — Integração automática com o Cadastro
   ------------------------------------------------------------
   Este arquivo busca, na mesma planilha do Google Sheets usada
   pelo formulário de cadastro (+Esporte −Remédio), a lista de
   participantes — e preenche a urna do sorteio automaticamente,
   sem precisar copiar e colar nada.

   COMO CONFIGURAR:
   1. Use a MESMA URL do Apps Script já publicada para o
      formulário de cadastro (a que termina em /exec).
   2. Cole essa URL abaixo, em SHEET_WEBAPP_URL.
   3. Garanta que o apps-script.gs publicado já tenha a ação
      "?action=nomes" devolvendo "Nome;AAAA-MM-DD" por linha
      (ver apps-script.gs do projeto de cadastro).

   Enquanto SHEET_WEBAPP_URL não for configurada, o sorteio
   continua funcionando normalmente em modo manual: a pessoa
   pode colar os nomes na caixa de texto como antes.
   ============================================================ */

// 🔗 Cole aqui a MESMA URL do Apps Script usada no formulário de cadastro (termina em /exec)
const SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbwPAKJjSU0kojLS9qeZkS4FhWcmvmJmPsc_ja1w0z_QCtYloV2JqP2VoXI9Ief8rcOn/exec";




/**
 * Busca a lista de participantes (nome + data de cadastro) direto da
 * planilha de cadastro, através do Apps Script. Cada linha devolvida
 * pelo Apps Script vem no formato "Nome Completo;AAAA-MM-DD".
 * @returns {Promise<{ok: boolean, participantes: {nome:string, data:string}[], message?: string}>}
 */
async function fetchNomesParaSorteio() {
  if (!SHEET_WEBAPP_URL) {
    return { ok: false, participantes: [], message: "not_configured" };
  }

  try {
    const response = await fetch(`${SHEET_WEBAPP_URL}?action=nomes`, { method: "GET" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const texto = await response.text();
    const participantes = texto.trim().split("\n").filter(Boolean).map(linha => {
      const [nome, data] = linha.split(";");
      return { nome: (nome || "").trim(), data: (data || "").trim() };
    });
    return { ok: true, participantes };
  } catch (err) {
    console.error("[google-sheets.js] Falha ao buscar nomes do cadastro:", err);
    return { ok: false, participantes: [], message: "fetch_error" };
  }
}

function isGoogleSheetsConfigured() {
  return Boolean(SHEET_WEBAPP_URL);
}

window.GoogleSheets = {
  fetchNomesParaSorteio,
  isGoogleSheetsConfigured,
};
