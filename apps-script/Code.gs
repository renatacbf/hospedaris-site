// Hospedaris: recebe o pedido de avaliação do site, grava na planilha e avisa por e-mail.
const EMAIL_DESTINO = 'contato@hospedaris.com.br';
const ABA = 'Pedidos';

function limpa_(v) {
  v = String(v || '').trim().slice(0, 1000);
  // evita que um texto vire fórmula na planilha
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function doPost(e) {
  const p = e.parameter || {};
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(ABA) || ss.insertSheet(ABA);
  if (sh.getLastRow() === 0) {
    sh.appendRow(['Data', 'Nome', 'Telefone/WhatsApp', 'E-mail', 'Cidade', 'Bairro/praia', 'Situação do imóvel', 'Observações', 'Autorizou contato']);
  }
  const linha = [new Date(), p.nome, p.tel, p.mail, p.cidade, p.bairro, p.situ, p.msg, p.consent].map(limpa_);
  sh.appendRow(linha);

  MailApp.sendEmail({
    to: EMAIL_DESTINO,
    subject: 'Novo pedido de avaliação: ' + limpa_(p.nome) + ' (' + limpa_(p.cidade) + ')',
    body: 'Novo pedido de avaliação pelo site.\n\n' +
      'Nome: ' + limpa_(p.nome) + '\nTelefone/WhatsApp: ' + limpa_(p.tel) + '\nE-mail: ' + limpa_(p.mail) +
      '\nCidade: ' + limpa_(p.cidade) + '\nBairro/praia: ' + limpa_(p.bairro) +
      '\nSituação do imóvel: ' + limpa_(p.situ) + '\nObservações: ' + limpa_(p.msg) +
      '\n\nTodos os pedidos ficam na aba "' + ABA + '" da planilha.'
  });
  return ContentService.createTextOutput('ok');
}
