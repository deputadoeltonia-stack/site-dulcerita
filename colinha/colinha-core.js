// Logica pura da colinha. Zero DOM, zero fetch — tudo aqui roda no Node
// para que a garantia do campo travado possa ser testada de verdade.

// Ordem da urna em 2026 (Res. TSE 23.751/2026). Os dois primeiros digitos
// de qualquer numero sao o do partido; o resto varia por cargo, o que torna
// colisao entre cargos impossivel dentro de uma UF.
export const CARGOS = [
  { id: 'federal', cargo: 6, rotulo: 'Deputado federal', digitos: 4 },
  { id: 'estadual', cargo: 7, rotulo: 'Deputado estadual', digitos: 5 },
  { id: 'senador1', cargo: 5, rotulo: 'Senador (1º voto)', digitos: 3 },
  { id: 'senador2', cargo: 5, rotulo: 'Senador (2º voto)', digitos: 3 },
  { id: 'governador', cargo: 3, rotulo: 'Governador', digitos: 2 },
  { id: 'presidente', cargo: 1, rotulo: 'Presidente', digitos: 2 },
]

// numero: null = ainda nao saiu da convencao. O campo fica destravado ate
// alguem preencher aqui; nenhuma outra linha de codigo precisa mudar.
export const CANDIDATOS = {
  'colinha.dreltonai.com.br': {
    nome: 'DR. ELTON', cargo: 6, numero: '4412', partido: 'UNIÃO', tema: 'elton',
    // Marcacao legal da propaganda eleitoral (Lei 9.504/97, art. 38 §1o):
    // razao social e CNPJ da campanha, como na lateral do santinho impresso.
    // Vive aqui junto de nome e numero porque e por candidato — a colinha
    // serve tres campanhas no mesmo codigo.
    razao: 'ELEIÇÃO 2026 ELTON ALVES RIBEIRO DE CARVALHO JUNIOR DEPUTADO FEDERAL',
    cnpj: '68.237.359/0001-10',
    foto: 'elton', // fotos/elton.jpg — foto oficial da campanha, nao vem do TSE
    // Sem governador pre-preenchido. A peca impressa dele traz o Tarcisio (10),
    // mas na tela o campo abre VAZIO: o voto de governador e do eleitor, e
    // nem travado (`fixos`) nem sugerido (`sugestao`) cabia aqui.
  },
  // Numero confirmado pelo santinho impresso 7x10 da campanha (15/08/2026).
  'colinhavirtual.dreltonai.com.br': {
    nome: 'PROFESSOR TOZI', cargo: 7, numero: '44447', partido: 'UNIÃO', tema: 'tozi',
    // Marcacao legal da propaganda, como na lateral do santinho impresso.
    razao: 'ELEIÇÃO 2026 LUIZ ANTONIO TOZI DEPUTADO ESTADUAL',
    cnpj: '68.283.009/0001-90',
    foto: 'tozi',
    // A peca conjunta dele traz o Dr. Elton impresso — fixo pelo mesmo
    // motivo da Dulce, o eleitor nao muda esse. Governador destravado.
    fixos: { federal: '4412' },
  },
  // O site do Tozi embute a colinha em /colinha/ (site-tozi, deploy Vercel).
  // Sem estes aliases o hostname dele cairia no PADRAO e abriria a colinha
  // do Dr. Elton dentro do site do Tozi.
  'tozisite.vercel.app': { alias: 'colinhavirtual.dreltonai.com.br' },
  'tozisite-elton8.vercel.app': { alias: 'colinhavirtual.dreltonai.com.br' },
  'tozisite-git-main-elton8.vercel.app': { alias: 'colinhavirtual.dreltonai.com.br' },
  'proftozi.com.br': { alias: 'colinhavirtual.dreltonai.com.br' },
  'www.proftozi.com.br': { alias: 'colinhavirtual.dreltonai.com.br' },
  // Dominios de PRODUCAO 2026 (HostGator) — os que o eleitor recebe no
  // santinho. Ficavam so na copia do servidor, editados a mao la; qualquer
  // deploy a partir do git derrubava os tres e a colinha de cada candidato
  // caia no PADRAO (Dr. Elton) em silencio. Agora vivem aqui.
  'proftozi44447.com.br': { alias: 'colinhavirtual.dreltonai.com.br' },
  'www.proftozi44447.com.br': { alias: 'colinhavirtual.dreltonai.com.br' },
  'drelton4412.com.br': { alias: 'colinha.dreltonai.com.br' },
  'www.drelton4412.com.br': { alias: 'colinha.dreltonai.com.br' },
  // Subdominio proprio da colinha no dominio de campanha. O plano de
  // hospedagem so aceita um dominio, entao colinha.dreltonai.com.br (o do QR
  // impresso em 07/2026) nao pode ser criado nessa conta — este e o link
  // curto que vai no material novo.
  'colinha.drelton4412.com.br': { alias: 'colinha.dreltonai.com.br' },
  'www.colinha.drelton4412.com.br': { alias: 'colinha.dreltonai.com.br' },
  'dulcerita44400.com.br': { alias: 'colinha2026.dreltonai.com.br' },
  'www.dulcerita44400.com.br': { alias: 'colinha2026.dreltonai.com.br' },
  // Site da Dulce Rita (projeto Vercel "dulcesite") tambem embute /colinha/.
  // Dominio de producao e sitedulce.vercel.app — um alias errado aqui abre a
  // colinha do Dr. Elton dentro do site dela, em silencio.
  'sitedulce.vercel.app': { alias: 'colinha2026.dreltonai.com.br' },
  'dulcesite-elton8.vercel.app': { alias: 'colinha2026.dreltonai.com.br' },
  'dulcesite-git-main-elton8.vercel.app': { alias: 'colinha2026.dreltonai.com.br' },
  // Numero confirmado pelo santinho impresso 7x10 da campanha (15/08/2026).
  'colinha2026.dreltonai.com.br': {
    nome: 'DULCE RITA', cargo: 7, numero: '44400', partido: 'UNIÃO', tema: 'dulce',
    // Marcacao legal da propaganda, como na lateral do santinho impresso.
    razao: 'ELEIÇÃO 2026 DULCE RITA CHAVES DE ANDRADE DABKIWIC',
    cnpj: '68.283.179/0001-75',
    foto: 'dulce', rotulo: 'Deputada estadual', // flexao do cargo, so no campo dela
    // O verso do santinho dela vem com o federal (Dr. Elton, peca conjunta)
    // impresso. FIXO, nao sugestao: a garantia e a mesma do campo dela — o
    // slot nao existe no objeto de estado, entao nao ha caminho de escrita
    // nem por URL nem por localStorage.
    //
    // O governador saiu daqui: era o Tarcisio 10, e o campo passa a ser do
    // eleitor.
    fixos: { federal: '4412' },
  },
}

// --- santinhos 9x5 ------------------------------------------------------
// A peca 9x5 e a versao digital do verso impresso: o que ja vem impresso e
// travado, o que vem em branco o eleitor completa. Em geral e uma peca
// conjunta (parceiro estadual + Dr. Elton), mas o Dr. Elton tambem tem a
// dele sozinho — por isso o registro nao se chama mais PARCEIROS.
//
// Cada santinho tem subdominio proprio, e a rota /c/<slug> vale de reserva.
// O slug so ESCOLHE uma entrada daqui: nao carrega nome nem numero. A
// garantia central continua a mesma do resto do produto — numero e nome saem
// da config e so da config, e slot travado nao existe no objeto de estado.
//
// Todos os subdominios vivem em drelton4412.com.br, nunca em
// dreltonai.com.br: o segundo resolve num VPS da Hostinger, e o eleitor que
// aponta a camera bateria naquele servidor antes de chegar na colinha.
export const SANTINHOS = {
  leandro: {
    nome: 'LEANDRO CÉSAR', cargo: 7, numero: '44012', partido: 'UNIÃO',
    tema: 'santinho', rotulo: 'Deputado estadual',
    // Cor das caixas e do disco da foto DELE. Na peca do Leandro e o mesmo
    // lima do Dr. Elton; na do Rogerio, o ambar dele. E o unico eixo que muda
    // de um santinho para o outro.
    cor: '#cddc00',
    // Foto do TSE (SQ_CANDIDATO 250002533739): mesma pessoa e mesmo terno da
    // peca impressa. Nao ha arte de campanha separada para ele, entao nao ha
    // arquivo proprio em fotos/ como o elton.jpg das outras tres.
    foto: '250002533739',
    // Subdominio proprio, como o do Rogerio: a raiz ja abre esta colinha, sem
    // /c/ e sem parametro. Em drelton4412.com.br (HostGator dos nameservers
    // ao IP), nunca em dreltonai.com.br, que passa pela Hostinger.
    hosts: ['leandro.drelton4412.com.br', 'www.leandro.drelton4412.com.br'],
    // Marcacao legal da propaganda (Lei 9.504/97, art. 38 §1o), da lateral do
    // santinho. As outras tres campanhas montam a frase de razao + cnpj; aqui
    // a peca traz os dois CNPJs, e sao eles que a lei pede.
    //
    // A tiragem ("30.000 unidades") fica de FORA: ela e a quantidade de
    // exemplares do impresso, exigida do material grafico. Uma colinha na
    // tela nao tem exemplar nem quantidade — copiada para ca a frase vira
    // informacao falsa sobre o proprio meio em que esta sendo lida.
    legal: [
      'CNPJ Candidato: 68.283.009/0001-90',
      'CNPJ Contratado: 10.386.377/0001-84',
    ],
    // O Dr. Elton vem impresso na peca: FIXO, nao sugestao. Governador e
    // presidente ficam em branco no santinho, entao ficam livres aqui — ao
    // contrario da peca do proprio Dr. Elton, que ja traz o governador.
    fixos: { federal: '4412' },
  },
  rogerio: {
    nome: 'ROGÉRIO FRANCO', cargo: 7, numero: '22999', partido: 'PL',
    tema: 'santinho', rotulo: 'Deputado estadual',
    cor: '#f4be38', // ambar da peca dele, medido na pagina 2 do PDF
    foto: '250002536405',
    // Subdominio proprio: a raiz dele ja abre esta colinha, sem /c/ e sem
    // parametro, o que da o QR mais curto possivel para a peca impressa.
    //
    // Em drelton4412.com.br, NAO em dreltonai.com.br: o segundo tem DNS e IP
    // na Hostinger (o reverso do 187.127.17.18 e srv1779079.hstgr.cloud) e o
    // eleitor que aponta a camera bate naquele servidor antes de chegar na
    // colinha. Este dominio e HostGator dos nameservers ao IP, e o
    // subdominio nasce no proprio cPanel — nada fora dele no caminho.
    hosts: ['rogerio.drelton4412.com.br', 'www.rogerio.drelton4412.com.br'],
    // Os mesmos dois CNPJs da peca do Leandro, como impresso na lateral.
    legal: [
      'CNPJ Candidato: 68.283.009/0001-90',
      'CNPJ Contratado: 10.386.377/0001-84',
    ],
    // SEM `fixos`: esta peca deixou de trazer o Dr. Elton impresso, entao o
    // campo de deputado federal fica livre para o eleitor preencher. As
    // outras pecas conjuntas (Leandro, Anistaldo, Tozi, Dulce) seguem com ele.
  },
  anistaldo: {
    nome: 'PASTOR ANISTALDO', cargo: 7, numero: '20147', partido: 'PODE',
    tema: 'santinho', rotulo: 'Deputado estadual',
    // Roxo da identidade DELE (#5C3583, pagina 11 do manual "Logos, numero e
    // identidade visual"), nao o lima do Dr. Elton: ele e o unico parceiro
    // com manual proprio. O amarelo (#F3E32E) e o verde (#22AE49) da paleta
    // ficam de fora — aqui so entra a cor das caixas e do disco da foto.
    cor: '#5C3583',
    // Foto do TSE (SQ_CANDIDATO 250002545138), ja versionada em fotos/.
    // Nao ha arte de campanha separada para ele.
    foto: '250002545138',
    // Subdominio proprio, como o do Leandro e o do Rogerio: a raiz ja abre
    // esta colinha, sem /c/ e sem parametro. Em drelton4412.com.br, nunca em
    // dreltonai.com.br, que passa pela Hostinger.
    hosts: ['anistaldo.drelton4412.com.br', 'www.anistaldo.drelton4412.com.br'],
    // Os mesmos dois CNPJs das pecas do Leandro e do Rogerio: quem contrata a
    // impressao e a campanha do Dr. Elton, e a marcacao legal segue o
    // contratante, nao o partido do parceiro (ele e do PODE).
    legal: [
      'CNPJ Candidato: 68.283.009/0001-90',
      'CNPJ Contratado: 10.386.377/0001-84',
    ],
    fixos: { federal: '4412' },
  },
  regina: {
    nome: 'REGINA NUNES', cargo: 7, numero: '15115', partido: 'MDB',
    tema: 'santinho', rotulo: 'Deputada estadual', // flexao do cargo, como no da Dulce
    // Laranja da identidade dela (#f9b004, do PDF de cores), que e a cor do
    // NOME na arte. O navy da box (#212c52) e o azul (#14387f) seriam mais
    // fieis a peca, mas o fundo desta tela ja e navy: a caixa sumiria nele
    // (1.18:1 e 1.45:1). O laranja destaca (8.57:1) e cai no mesmo padrao do
    // lima do Elton, do ambar do Rogerio e do mint da Dulce.
    cor: '#f9b004',
    // Foto do TSE (SQ_CANDIDATO 250002534251), ja versionada em fotos/.
    foto: '250002534251',
    hosts: ['regina.drelton4412.com.br', 'www.regina.drelton4412.com.br'],
    // Marcacao legal da propaganda (Lei 9.504/97, art. 38 §1o). O CNPJ e o da
    // CAMPANHA DELA, lido na ficha oficial do DivulgaCandContas (eleicao
    // 20322002026, SQ_CANDIDATO 250002534251) — nao o mesmo das pecas do
    // Leandro, do Rogerio e do Anistaldo, que trazem o da campanha do Tozi.
    //
    // Sem "CNPJ Contratado": aquele e o da grafica que imprime, e esta
    // colinha nao veio de peca impressa nenhuma — o material dela chegou como
    // identidade visual, nao como arte de santinho. Inventar um contratado
    // seria afirmar uma contratacao que ninguem declarou.
    legal: [
      'CNPJ Candidato: 68.293.771/0001-58',
    ],
    // So ela e o Dr. Elton, como nas outras pecas conjuntas. A faixa de
    // aliados que veio no material dela (senador 222 e 111, governador 10,
    // presidente 22) NAO entra: travar os quatro tirava do eleitor os unicos
    // votos que sobravam para ele decidir.
    fixos: { federal: '4412' },
  },
  tozi: {
    nome: 'PROFESSOR TOZI', cargo: 7, numero: '44447', partido: 'UNIÃO',
    tema: 'santinho', rotulo: 'Deputado estadual',
    cor: '#0057c3', // azul da peca dele, medido na pagina 2 do PDF
    foto: 'tozi',
    // Dominio DELE: a campanha do Tozi e outra conta de HostGator, noutro
    // servidor (ns856, 192.185.131.84). Por isso o santinho dele nao mora em
    // drelton4412.com.br como os outros — cada peca vive no dominio da
    // campanha que a imprime.
    // TODOS os enderecos do Tozi abrem esta peca, nao so o subdominio dela.
    // colinhavirtual.dreltonai.com.br (o QR impresso em julho) NAO entra na
    // lista: ele responde 301 para proftozi44447.com.br/colinha/, entao o app
    // nunca roda naquele hostname — quem resolve e o destino, que esta aqui.
    // Duas colinhas diferentes para o mesmo candidato — uma clara no site,
    // outra escura no QR — divergem em silencio: a primeira que alguem
    // esquecer de atualizar vira a que mostra o numero velho. A entrada de
    // tema 'tozi' em CANDIDATOS segue existindo para ?campanha=tozi em
    // localhost, mas nenhum hostname de producao cai mais nela.
    hosts: [
      'santinho.proftozi44447.com.br', 'www.santinho.proftozi44447.com.br',
      'proftozi44447.com.br', 'www.proftozi44447.com.br',
      'proftozi.com.br', 'www.proftozi.com.br',
      'tozisite.vercel.app', 'tozisite-elton8.vercel.app',
      'tozisite-git-main-elton8.vercel.app',
    ],
    legal: [
      'CNPJ Candidato: 68.283.009/0001-90',
      'CNPJ Contratado: 10.386.377/0001-84',
    ],
    fixos: { federal: '4412' },
  },
  dulce: {
    nome: 'DULCE RITA', cargo: 7, numero: '44400', partido: 'UNIÃO',
    tema: 'santinho', rotulo: 'Deputada estadual', // flexao do cargo, so no dela
    cor: '#27d9c4', // mint da peca dela, medido na pagina 2 do PDF
    foto: 'dulce',
    // Terceira conta de HostGator, terceiro servidor (ns815, 50.116.87.219).
    // Como no Tozi: TODOS os enderecos dela abrem esta peca, nao so o
    // subdominio. Duas colinhas do mesmo candidato divergem em silencio — a
    // primeira que alguem esquecer de atualizar vira a que mostra o numero
    // velho. A entrada de tema 'dulce' em CANDIDATOS segue existindo para
    // ?campanha=dulce em localhost.
    //
    // colinha2026.dreltonai.com.br (o QR impresso) fica de fora: responde 301
    // para dulcerita44400.com.br/colinha/, entao o app nunca roda naquele
    // hostname — quem resolve e o destino, que esta aqui.
    hosts: [
      'santinho.dulcerita44400.com.br', 'www.santinho.dulcerita44400.com.br',
      'dulcerita44400.com.br', 'www.dulcerita44400.com.br',
      'sitedulce.vercel.app', 'dulcesite-elton8.vercel.app',
      'dulcesite-git-main-elton8.vercel.app',
    ],
    legal: [
      'CNPJ Candidato: 68.283.009/0001-90',
      'CNPJ Contratado: 10.386.377/0001-84',
    ],
    fixos: { federal: '4412' },
  },
  // A peca 9x5 do Dr. Elton SOZINHO. Nao e a colinha dele que ja existe em
  // colinha.drelton4412.com.br: aquela e a peca antiga, de tema claro e com o
  // governador travado no Tarcisio. Esta deixa TODOS os outros cargos em
  // branco — inclusive o de governador —, e as duas convivem porque o QR
  // impresso em julho aponta para a antiga.
  elton: {
    nome: 'DR. ELTON', cargo: 6, numero: '4412', partido: 'UNIÃO',
    tema: 'santinho', rotulo: 'Deputado federal',
    cor: '#cddc00',
    foto: '250002532326',
    hosts: ['santinho.drelton4412.com.br', 'www.santinho.drelton4412.com.br'],
    legal: [
      'CNPJ Candidato: 68.283.009/0001-90',
      'CNPJ Contratado: 10.386.377/0001-84',
    ],
    // Sem `fixos`: nesta peca o Dr. Elton e o DONO, nao um aliado impresso, e
    // nenhum outro cargo vem preenchido do papel.
  },
  // A "colinha completa" (peca impressa 30/08): a chapa INTEIRA travada, dos
  // deputados ao presidente. E a excecao deliberada a regra das outras pecas
  // — aqui a peca imprime os seis numeros, e a versao digital replica a peca.
  // Quem quiser montar a propria colinha usa a colinha comum.
  colinhacompleta: {
    nome: 'DR. ELTON', cargo: 6, numero: '4412', partido: 'UNIÃO',
    tema: 'santinho', rotulo: 'Deputado federal',
    cor: '#cddc00',
    // Foto de campanha (fotos/elton.jpg), como no circulo verde da peca —
    // nao a do TSE que o santinho solo usa.
    foto: 'elton',
    hosts: [
      'colinhacompleta.drelton4412.com.br',
      'www.colinhacompleta.drelton4412.com.br',
    ],
    // CNPJs lidos na lateral da propria peca (30/08). O candidato e o da
    // campanha do Dr. Elton — e a peca DELE, nao das pecas conjuntas do Tozi.
    // A tiragem ("180.000 unidades") fica de fora, como no Leandro: e do
    // impresso, nao da tela.
    legal: [
      'CNPJ Candidato: 68.237.359/0001-10',
      'CNPJ Contratado: 03.188.474/0001-05',
    ],
    // Na IMAGEM salva a peca sai na diagramacao da arte final: aliados com
    // foto quadrada ao lado das caixas e so o rotulo do cargo, disco + nome
    // grande so do Dr. Elton, QR, tecla CONFIRMA. As pecas conjuntas
    // (Leandro, Dulce...) nao levam a flag: nelas o Elton aliado aparece
    // COM nome, que e como o verso impresso delas e.
    aliadoCompacto: true,
    // O QR da propria peca, dentro do quadro branco. O arquivo ja aponta
    // para colinhacompleta.drelton4412.com.br. Em marca/ porque o deploy
    // (build/enviar_sftp.py) so envia as pastas do rol — arquivo solto na
    // raiz nao sobe.
    qr: 'marca/qr-colinhacompleta.png',
    // Flexao do rotulo na IMAGEM, como impresso na peca (a fileira e da
    // Dulce Rita). So no desenho: na tela o rotulo generico do cargo segue
    // valendo, com o nome resolvido ao lado.
    rotulos: { estadual: 'Deputada estadual' },
    // Os cinco aliados impressos na peca. Numero vem daqui e so daqui; nome,
    // sigla e foto resolvem no dataset do TSE, como em todo `fixos`.
    fixos: {
      estadual: '44400',   // DULCE RITA
      senador1: '222',     // ANDRÉ DO PRADO
      senador2: '111',     // GUILHERME DERRITE
      governador: '10',    // TARCÍSIO
      presidente: '22',    // FLAVIO BOLSONARO
    },
  },
}

const PADRAO = 'colinha.dreltonai.com.br'

export function configPara(hostname) {
  const cfg = CANDIDATOS[hostname] ?? CANDIDATOS[PADRAO]
  return cfg.alias ? CANDIDATOS[cfg.alias] : cfg
}

// Em localhost o hostname nao diz qual campanha e, entao ?campanha=tozi
// escolhe. Fora de localhost o parametro e ignorado de proposito: se a URL
// pudesse trocar a campanha, daria pra abrir o site do Elton mostrando outro
// candidato travado no topo.
const LOCAIS = new Set(['localhost', '127.0.0.1', '[::1]', ''])

export function hostDeDev(hostname, busca) {
  if (!LOCAIS.has(hostname)) return hostname
  const tema = new URLSearchParams(busca ?? '').get('campanha')
  const achado = Object.entries(CANDIDATOS).find(([, c]) => c.tema === tema)
  return achado ? achado[0] : PADRAO
}

// Ponto unico de resolucao da pagina: santinho de parceiro primeiro, senao a
// campanha pelo hostname. O QR impresso aponta para /c/<slug>, que redireciona
// para a raiz com ?p=<slug> — na raiz os caminhos relativos de fotos/, fonts/
// e do dataset continuam valendo, o que nao seria verdade servindo o app de
// dentro de /c/.
//
// Um ?p= desconhecido cai na resolucao normal, calada: o parametro escolhe
// entre entradas aprovadas do registro, nunca inventa uma. E o mesmo motivo
// pelo qual ?campanha= so vale em localhost.
export function configDaRota(hostname, busca) {
  // O hostname vem PRIMEIRO, e por isso o ?p= nao vale num subdominio de
  // parceiro: senao rogerio.dreltonai.com.br/?p=leandro abriria a colinha do
  // Leandro dentro do site do Rogerio. Mesmo motivo pelo qual ?campanha= so
  // funciona em localhost — endereco proprio mostra o dono dele, e ponto.
  const dono = Object.values(SANTINHOS).find((c) => c.hosts?.includes(hostname))
  if (dono) return dono

  const slug = new URLSearchParams(busca ?? '').get('p')
  // hasOwn, nao SANTINHOS[slug]: ?p=__proto__ devolve Object.prototype, que e
  // um objeto truthy — a pagina abriria sem nome, sem numero e sem tema.
  if (slug && Object.hasOwn(SANTINHOS, slug)) return SANTINHOS[slug]
  return configPara(hostDeDev(hostname, busca))
}

export function buscar(dados, cargo, numero) {
  return dados?.[String(cargo)]?.[numero] ?? null
}

// Embutida num site (ex.: /colinha/ dentro do site do Dr. Elton) a pagina
// ganha um link de volta para a raiz do site. Nos subdominios proprios ela
// vive na raiz e o link nao existe.
export function linkDeVolta(pathname) {
  const p = String(pathname ?? '/')
  return p === '/' || p === '/index.html' ? null : '../'
}

// --- estado -----------------------------------------------------------
// O slot travado NAO existe no objeto de estado. Nao e uma validacao que
// pode falhar: e ausencia de caminho de escrita. Toda funcao que produz
// estado passa por criarEstado, entao a exclusao vale para URL, para
// localStorage e para qualquer fonte futura.

// O slot do PROPRIO candidato do site. E o que ganha o selo no topo.
export function slotTravado(config) {
  if (!config?.numero) return null
  return CARGOS.find((c) => c.cargo === config.cargo)?.id ?? null
}

// Todos os slots que o eleitor nao edita: o do proprio candidato mais os
// aliados que a peca ja traz impressos (config.fixos). Os dois casos tem a
// MESMA garantia — nenhum deles entra no objeto de estado, entao nao existe
// caminho de escrita por URL, por localStorage ou por qualquer fonte futura.
export function slotsTravados(config) {
  const proprio = slotTravado(config)
  const aliados = Object.keys(config?.fixos ?? {}).filter(
    (id) => id !== proprio && CARGOS.some((c) => c.id === id),
  )
  return new Set(proprio ? [proprio, ...aliados] : aliados)
}

export function criarEstado(config) {
  const travados = slotsTravados(config)
  const livres = CARGOS.filter((c) => !travados.has(c.id))
  // Sugestao da config preenche o valor inicial de um campo livre (na peca do
  // Dr. Elton, o governador). lerURL/lerSalvo sobrescrevem depois: o que o
  // eleitor apagou de proposito continua apagado ao restaurar.
  return Object.fromEntries(
    livres.map((c) => [c.id, limpar(config?.sugestao?.[c.id], c.digitos)]),
  )
}

export function limpar(valor, digitos) {
  return String(valor ?? '').replace(/\D/g, '').slice(0, digitos)
}

function preencher(estado, fonte) {
  for (const id of Object.keys(estado)) {
    const { digitos } = CARGOS.find((c) => c.id === id)
    estado[id] = limpar(fonte(id), digitos)
  }
  return estado
}

export function lerURL(search, config) {
  const params = new URLSearchParams(search ?? '')
  return preencher(criarEstado(config), (id) => params.get(id))
}

export function lerSalvo(raw, config) {
  let obj = {}
  try {
    obj = JSON.parse(raw ?? '{}') ?? {}
  } catch {
    obj = {}
  }
  if (typeof obj !== 'object' || Array.isArray(obj)) obj = {}
  return preencher(criarEstado(config), (id) => obj[id])
}

export function paraSalvar(estado) {
  return JSON.stringify(estado)
}

// --- montagem ---------------------------------------------------------

export function montarColinha(estado, config, dados) {
  const travado = slotTravado(config)
  return CARGOS.map((c) => {
    if (c.id === travado) {
      // Le da config e so da config. O estado nao e consultado nem que
      // tenha a chave; os dados do TSE nao sao consultados nem que tenham
      // o numero. Esta e a garantia central do produto. A foto tambem: vem
      // do config (config.foto), nunca do dataset.
      return {
        ...c,
        rotulo: config.rotulo ?? c.rotulo,
        numero: String(config.numero),
        nome: config.nome,
        partido: config.partido,
        foto: config.foto ?? null,
        travado: true,
        proprio: true, // o campo do candidato do site — o unico azul no Tozi
        erro: null,
      }
    }
    // Aliado impresso na peca (Dr. Elton e o governador, na colinha da Dulce).
    // O NUMERO vem da config e so da config, como no campo do proprio
    // candidato: o estado nao e consultado nem que tenha a chave. Nome, sigla
    // e foto seguem saindo do dataset do TSE — a config guarda so o que a
    // peca imprime, que e o numero.
    if (c.id in (config?.fixos ?? {})) {
      const numero = limpar(config.fixos[c.id], c.digitos)
      const achado = numero.length === c.digitos ? buscar(dados, c.cargo, numero) : null
      return {
        ...c,
        numero,
        nome: achado?.[0] ?? null,
        partido: achado?.[1] ?? null,
        foto: achado?.[2] || null,
        travado: true,
        proprio: false, // aliado impresso: travado, mas sem a cor do candidato
        erro: null,
      }
    }
    const numero = estado?.[c.id] ?? ''
    const completo = numero.length === c.digitos
    const achado = completo ? buscar(dados, c.cargo, numero) : null
    return {
      ...c,
      numero,
      nome: achado?.[0] ?? null,
      partido: achado?.[1] ?? null,
      foto: achado?.[2] || null, // SQ_CANDIDATO -> fotos/{sq}.jpg
      travado: false,
      erro: completo && !achado ? 'Número não encontrado. Confira na urna.' : null,
    }
  })
}

// Remove acentos e caixa, para busca tolerante ("tarcisio" acha "TARCÍSIO").
function normalizar(s) {
  return String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

// Busca candidatos de um cargo cujo nome de urna contem o termo. Devolve
// ate `limite` resultados {numero, nome, partido, foto}, ordenados por quem
// comeca com o termo primeiro. So opera sobre slots livres — o cargo do
// campo travado nunca chega aqui (o app nao abre busca no travado).
export function buscarPorNome(dados, cargo, termo, limite = 40) {
  const t = normalizar(termo).trim()
  if (t.length < 2) return []
  const balde = dados?.[String(cargo)] ?? {}
  const achados = []
  for (const [numero, reg] of Object.entries(balde)) {
    const alvo = normalizar(reg[0])
    const pos = alvo.indexOf(t)
    if (pos === -1) continue
    achados.push({ numero, nome: reg[0], partido: reg[1], foto: reg[2] || null, pos })
  }
  achados.sort((a, b) => a.pos - b.pos || a.nome.localeCompare(b.nome))
  return achados.slice(0, limite).map(({ pos, ...r }) => r)
}

// Busca do topo da pagina: UM termo, procurado em todos os cargos LIVRES de
// uma vez. Digitos casam por PREFIXO de numero; letras caem na busca por
// nome. O eleitor nao precisa saber em qual cargo o numero se encaixa — o
// tamanho do numero ja diz (4=federal, 5=estadual...), entao quem responde
// isso e a colinha, nao ele.
// Devolve {cargoId, rotulo, digitos, numero, nome, partido, foto, exato}.
// exato = o numero completo de um cargo, achado no dataset. Os travados
// (proprio candidato e aliados impressos) ficam de fora: nada os preenche.
export function buscarGlobal(dados, config, termo, limite = 12) {
  const travados = slotsTravados(config)
  const livres = CARGOS.filter((c) => !travados.has(c.id))
  const t = String(termo ?? '').trim()
  if (t.length < 2) return []
  const soDigitos = /^\d+$/.test(t)
  const achados = []
  const cargosVistos = new Set() // senador1/senador2 dividem o cargo 5: sem isto cada nome sairia em dobro
  for (const c of livres) {
    if (cargosVistos.has(c.cargo)) continue
    cargosVistos.add(c.cargo)
    // "Senador (1º voto)" no resultado confundiria: qual voto e decisao da
    // hora do preenchimento (o primeiro vazio), nao da busca.
    const rotulo = c.id.startsWith('senador') ? 'Senador' : c.rotulo
    if (soDigitos) {
      if (t.length > c.digitos) continue
      for (const [numero, reg] of Object.entries(dados?.[String(c.cargo)] ?? {})) {
        if (!numero.startsWith(t)) continue
        achados.push({
          cargoId: c.id, rotulo, digitos: c.digitos, numero,
          nome: reg[0], partido: reg[1], foto: reg[2] || null,
          exato: numero === t,
        })
      }
    } else {
      for (const r of buscarPorNome(dados, c.cargo, t, limite)) {
        achados.push({ cargoId: c.id, rotulo, digitos: c.digitos, ...r, exato: false })
      }
    }
  }
  // Exato na frente; depois o cargo cujo tamanho bate com o que foi digitado
  // (quem digitou 3 digitos quase sempre quer senador, nao um estadual que
  // comeca igual); o resto na ordem da urna, e numero baixo primeiro.
  const ordem = new Map(CARGOS.map((c, i) => [c.id, i]))
  achados.sort((a, b) =>
    (b.exato - a.exato) ||
    ((b.digitos === t.length) - (a.digitos === t.length)) ||
    (ordem.get(a.cargoId) - ordem.get(b.cargoId)) ||
    // Numero baixo primeiro so na busca por digito. Na busca por nome a
    // relevancia ja veio de buscarPorNome (comeca-com antes de contem) e o
    // sort estavel a preserva.
    (soDigitos ? a.numero.localeCompare(b.numero) : 0),
  )
  return achados.slice(0, limite)
}

export function erroSenadores(colinha) {
  const s1 = colinha.find((s) => s.id === 'senador1')
  const s2 = colinha.find((s) => s.id === 'senador2')
  if (s1?.numero && s1.numero === s2?.numero) {
    return 'A urna anula o 2º voto se os números forem iguais.'
  }
  return null
}

export function estaCompleta(colinha) {
  return colinha.every((s) => s.nome) && !erroSenadores(colinha)
}
