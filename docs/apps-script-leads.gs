/**
 * Recebe os leads do site da Dulce Rita e grava numa planilha.
 * Mesmo padrão do projeto evento-fotos.
 *
 * COMO INSTALAR (5 min):
 *  1. Crie uma planilha nova no Google Sheets.
 *  2. Extensões > Apps Script. Apague o conteúdo e cole este arquivo.
 *  3. Implantar > Nova implantação > tipo "App da Web".
 *       Executar como: Eu
 *       Quem tem acesso: Qualquer pessoa
 *  4. Copie a URL que termina em /exec.
 *  5. Cole essa URL em js/main.js, na linha  const LEAD_ENDPOINT = "";
 *
 * Ao mudar este arquivo depois, é preciso implantar de novo
 * (Implantar > Gerenciar implantações > editar > Nova versão).
 */

var ABA = 'Leads';

function doPost(e) {
  var trava = LockService.getScriptLock();
  // sem a trava, dois envios simultâneos podem escrever na mesma linha
  trava.waitLock(20000);

  try {
    var dados = JSON.parse(e.postData.contents);

    var nome = String(dados.nome || '').trim().slice(0, 120);
    var telefone = String(dados.telefone || '').replace(/\D/g, '').slice(0, 11);

    // Validação no servidor: o navegador é do usuário, não confie nele.
    if (nome.length < 2) return resposta(false, 'nome invalido');
    if (telefone.length < 10 || telefone.length > 11) return resposta(false, 'telefone invalido');
    if (dados.consentimento !== true) return resposta(false, 'sem consentimento');

    var planilha = SpreadsheetApp.getActiveSpreadsheet();
    var aba = planilha.getSheetByName(ABA);
    if (!aba) {
      aba = planilha.insertSheet(ABA);
      aba.appendRow(['Data', 'Nome', 'Telefone', 'Consentimento LGPD', 'Origem']);
      aba.setFrozenRows(1);
    }

    aba.appendRow([
      new Date(),
      protegeFormula(nome),
      protegeFormula(telefone),
      'sim',
      protegeFormula(String(dados.origem || 'site'))
    ]);

    return resposta(true, 'ok');
  } catch (erro) {
    return resposta(false, 'erro interno');
  } finally {
    trava.releaseLock();
  }
}

/**
 * Um nome começando com = vira fórmula ao abrir a planilha.
 * Prefixar com aspa simples faz o Sheets tratar como texto puro.
 */
function protegeFormula(texto) {
  return /^[=+\-@]/.test(texto) ? "'" + texto : texto;
}

function resposta(ok, mensagem) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: ok, mensagem: mensagem }))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Roda uma vez pelo editor pra conferir a validação sem precisar do site. */
function testar() {
  var casos = [
    [{ nome: 'Maria Silva', telefone: '12988776655', consentimento: true }, true],
    [{ nome: 'M', telefone: '12988776655', consentimento: true }, false],
    [{ nome: 'Maria Silva', telefone: '123', consentimento: true }, false],
    [{ nome: 'Maria Silva', telefone: '12988776655', consentimento: false }, false]
  ];

  casos.forEach(function (caso) {
    var r = JSON.parse(doPost({ postData: { contents: JSON.stringify(caso[0]) } }).getContent());
    if (r.ok !== caso[1]) throw new Error('FALHOU: ' + JSON.stringify(caso[0]) + ' -> ' + r.mensagem);
  });

  Logger.log('Todos os casos passaram. Confira a aba ' + ABA + ' e apague a linha de teste.');
}
