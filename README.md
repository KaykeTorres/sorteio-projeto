# Sorteio · +Esporte −Remédio

Página de sorteio com roleta animada, som e confete. Os participantes
são **buscados automaticamente do mesmo cadastro** usado no formulário
de inscrição (+Esporte −Remédio) — sem precisar copiar e colar nomes.

---

## 📁 Estrutura do projeto

```
sorteio-projeto/
├── index.html                  → Página única do sorteio
│
├── css/
│   ├── style.css                 → Arquivo mestre (só imports, não editar direto)
│   ├── variables.css               → Design System: cores e fontes
│   └── sorteio.css                   → Layout, palco, animações, painéis
│
├── js/
│   ├── audio.js                    → Efeitos sonoros (tensão, fanfarra, etc.)
│   ├── estado.js                     → Estado da urna, parse de nomes, duplicados
│   ├── sorteio-engine.js               → Lógica do sorteio (roleta, revelação)
│   ├── confete.js                         → Animação de confete ao revelar o vencedor
│   ├── historico-extras.js                  → Histórico de ganhadores e botões extras
│   ├── google-sheets.js                       → Busca os nomes do cadastro (Apps Script)
│   └── sync-cadastro.js                         → Liga a busca automática à urna
│
└── img/
    └── logo-mascote.png             → Logo oficial do projeto
```

---

## 🔗 Como conectar ao cadastro (automático)

Este sorteio busca os nomes na **mesma planilha do Google Sheets** já
usada pelo formulário de cadastro. Não duplica dados — só lê o nome de
cada participante.

### Pré-requisito
O `apps-script.gs` da planilha de cadastro precisa ter a ação
`?action=nomes` (que devolve só os nomes, em texto puro, um por linha).
Se você já atualizou o Apps Script do projeto de cadastro com essa
ação, pode seguir os passos abaixo.

### Passo a passo
1. Abra `js/google-sheets.js`.
2. Cole a **mesma URL** do Apps Script já publicada para o cadastro
   (a que termina em `/exec`) na linha:
   ```js
   const SHEET_WEBAPP_URL = "";
   ```
   Exemplo:
   ```js
   const SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycb.../exec";
   ```
3. Salve. A partir de agora:
   - Ao abrir o sorteio, a lista de participantes é preenchida
     automaticamente com quem já se cadastrou.
   - Clicar em **Sortear** também atualiza a lista antes de girar,
     pegando cadastros de última hora.
   - O botão **🔄 Atualizar do cadastro** força uma nova busca manual.

> **Enquanto a URL não for configurada**, o sorteio continua funcionando
> normalmente em modo manual: você pode colar ou digitar os nomes na
> caixa de texto, como antes.

### Testar se a busca está funcionando
Cole isso no navegador (troque pela sua URL real):
```
https://script.google.com/macros/s/SEU_ID/exec?action=nomes
```
Se aparecer uma lista de nomes (um por linha, sem chaves, sem aspas),
a integração está pronta.

---

## 🎨 Como alterar as cores

Tudo está centralizado em `css/variables.css`:

```css
--azul:        #002B82;  /* azul de fundo */
--ouro:        #FFC629;  /* dourado dos destaques e botão Sortear */
--verde:       #27D17C;  /* indicador "ao vivo" e mensagens de sucesso */
```

Troque o valor hexadecimal e a cor muda em todo o site automaticamente.

---

## 🚀 Como publicar o projeto

Qualquer serviço de hospedagem de site estático funciona:

- **Netlify**: arraste a pasta do projeto em [app.netlify.com/drop](https://app.netlify.com/drop)
- **Vercel**: `vercel deploy` na pasta do projeto (via CLI) ou importe pelo site
- **GitHub Pages**: suba os arquivos para um repositório e ative o Pages

Não há necessidade de servidor backend próprio — tudo funciona com
arquivos estáticos + a mesma planilha/Apps Script do cadastro.

---

## ✅ Checklist antes de usar no evento

- [ ] Atualizei o `apps-script.gs` do cadastro com a ação `?action=nomes`
- [ ] Implantei uma **nova versão** do Apps Script depois de atualizar
- [ ] Colei a URL em `js/google-sheets.js` deste projeto
- [ ] Testei abrir o sorteio e vi os nomes aparecerem sozinhos
- [ ] Testei o botão "🔄 Atualizar do cadastro"
- [ ] Testei o sorteio de ponta a ponta (som, confete, histórico)
- [ ] Testei em um celular/tablet real, e em tela cheia
