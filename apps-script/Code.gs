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
  var rot = [['Nome','nome'],['WhatsApp','tel'],['Cidade','cidade'],['Bairro/condomínio','bairro'],['Situação do imóvel','situ'],['Pacote de interesse','pacote'],['E-mail','mail'],['Observações','msg'],['Origem','origem']];
  var tr = rot.filter(function (r) { return p[r[1]]; }).map(function (r) {
    return '<tr><td style="padding:9px 14px;color:#4E8F8B;font-size:13px;width:38%;border-bottom:1px solid #E9D5B8">' + r[0] +
      '</td><td style="padding:9px 14px;color:#0F3D47;font-size:15px;border-bottom:1px solid #E9D5B8">' + esc_(limpa_(p[r[1]])) + '</td></tr>';
  }).join('');
  var tel = String(p.tel || '').replace(/\D/g, '');
  var html = '<div style="background:#F4ECDD;padding:24px;font-family:Arial,sans-serif">' +
    '<div style="max-width:560px;margin:auto;background:#fff;border-radius:10px;overflow:hidden">' +
    '<div style="background:#0F3D47;color:#F4ECDD;padding:18px 20px;font-size:18px">Hospedaris · Novo pedido de avaliação</div>' +
    '<table style="width:100%;border-collapse:collapse">' + tr + '</table>' +
    '<div style="padding:18px 20px"><a href="https://wa.me/55' + tel + '" style="background:#D9663F;color:#fff;text-decoration:none;padding:11px 18px;border-radius:6px;font-size:15px">Responder no WhatsApp</a></div>' +
    '<div style="padding:0 20px 18px;color:#6b7b7f;font-size:12px">Todos os pedidos ficam na aba "' + ABA + '" da planilha. Use a coluna Status para acompanhar.</div>' +
    '</div></div>';
  MailApp.sendEmail({
    to: EMAIL_DESTINO,
    subject: 'Novo pedido de avaliação: ' + limpa_(p.nome) + ' (' + limpa_(p.cidade) + ')',
    htmlBody: html,
    body: 'Novo pedido de avaliação pelo site.\n\n' + linhas.join('\n')
  });
  return ContentService.createTextOutput('ok');
}

function esc_(t) {
  return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
