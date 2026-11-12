// Hospedaris: recebe os pedidos de avaliação do site, grava na planilha e avisa por e-mail.
const EMAIL_DESTINO = 'contato@hospedaris.com.br';
const ABA = 'Pedidos';
const CABECALHO = ['Data', 'Status', 'Nome', 'WhatsApp', 'Cidade', 'Bairro/condomínio', 'Situação do imóvel',
  'Pacote de interesse', 'E-mail', 'Observações', 'Origem do pedido', 'utm_source', 'utm_medium', 'utm_campaign',
  'Página', 'Referrer', 'Autorização'];

function limpa_(v) {
  v = String(v || '').trim().slice(0, 1000);
  return /^[=+\-@]/.test(v) ? "'" + v : v; // evita que o texto vire fórmula na planilha
}

function doPost(e) {
  const p = e.parameter || {};
  if (!p.nome || !p.tel) return ContentService.createTextOutput('dados incompletos');

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(ABA) || ss.insertSheet(ABA);
    if (sh.getLastRow() === 0) {
      sh.appendRow(CABECALHO);
      sh.setFrozenRows(1);
      sh.getRange(1, 1, 1, CABECALHO.length).setFontWeight('bold');
    }
    sh.appendRow([new Date(), 'Novo', p.nome, p.tel, p.cidade, p.bairro, p.situ, p.pacote, p.mail, p.msg,
      p.origem, p.utm_source, p.utm_medium, p.utm_campaign, p.pagina, p.referrer, p.consent].map(limpa_));
  } finally {
    lock.releaseLock();
  }

  const linhas = [
    'Nome: ' + limpa_(p.nome), 'WhatsApp: ' + limpa_(p.tel), 'Cidade: ' + limpa_(p.cidade),
    p.bairro ? 'Bairro/condomínio: ' + limpa_(p.bairro) : '',
    p.situ ? 'Situação do imóvel: ' + limpa_(p.situ) : '',
    p.pacote ? 'Pacote de interesse: ' + limpa_(p.pacote) : '',
    p.mail ? 'E-mail: ' + limpa_(p.mail) : '',
    p.msg ? 'Observações: ' + limpa_(p.msg) : '',
    'Origem do pedido: ' + limpa_(p.origem) + (p.utm_source ? ' (' + limpa_(p.utm_source) + ')' : '')
  ].filter(Boolean);
  MailApp.sendEmail({
    to: EMAIL_DESTINO,
    subject: 'Novo pedido de avaliação: ' + limpa_(p.nome) + ' (' + limpa_(p.cidade) + ')',
    body: 'Novo pedido de avaliação pelo site.\n\n' + linhas.join('\n') +
      '\n\nResponda pelo WhatsApp. Todos os pedidos ficam na aba "' + ABA + '" da planilha; use a coluna Status para acompanhar (Novo, Em contato, Avaliação agendada, Proposta enviada, Fechado, Sem interesse).'
  });
  return ContentService.createTextOutput('ok');
}
