export function seeded(seed: number) {
  let t = seed
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

export function series(seed: number, length: number, start: number, vol = 0.02) {
  const rand = seeded(seed)
  const out: number[] = [start]
  for (let i = 1; i < length; i++) {
    const prev = out[i - 1]
    out.push(prev * (1 + (rand() - 0.48) * vol))
  }
  return out
}

export type Candle = { o: number; h: number; l: number; c: number }

export function candles(seed: number, length: number, start: number): Candle[] {
  const rand = seeded(seed)
  const out: Candle[] = []
  let price = start
  for (let i = 0; i < length; i++) {
    const o = price
    const c = o * (1 + (rand() - 0.47) * 0.028)
    const h = Math.max(o, c) * (1 + rand() * 0.012)
    const l = Math.min(o, c) * (1 - rand() * 0.012)
    out.push({ o, h, l, c })
    price = c
  }
  return out
}

export type Asset = {
  symbol: string
  name: string
  kind: 'Ação' | 'Índice' | 'Câmbio' | 'Cripto' | 'Commodity'
  price: number
  change: number
  sector: string
  prefix?: string
}

export const assets: Asset[] = [
  { symbol: 'IBOV', name: 'Ibovespa', kind: 'Índice', price: 128452, change: 0.84, sector: 'Brasil' },
  { symbol: 'PETR4', name: 'Petrobras PN', kind: 'Ação', price: 38.72, change: 1.42, sector: 'Petróleo', prefix: 'R$' },
  { symbol: 'VALE3', name: 'Vale ON', kind: 'Ação', price: 61.15, change: -0.93, sector: 'Mineração', prefix: 'R$' },
  { symbol: 'ITUB4', name: 'Itaú Unibanco PN', kind: 'Ação', price: 34.48, change: 0.37, sector: 'Bancos', prefix: 'R$' },
  { symbol: 'BBDC4', name: 'Bradesco PN', kind: 'Ação', price: 13.9, change: -1.21, sector: 'Bancos', prefix: 'R$' },
  { symbol: 'WEGE3', name: 'WEG ON', kind: 'Ação', price: 52.3, change: 2.15, sector: 'Indústria', prefix: 'R$' },
  { symbol: 'MGLU3', name: 'Magazine Luiza ON', kind: 'Ação', price: 9.84, change: -3.4, sector: 'Varejo', prefix: 'R$' },
  { symbol: 'BBAS3', name: 'Banco do Brasil ON', kind: 'Ação', price: 27.61, change: 0.72, sector: 'Bancos', prefix: 'R$' },
  { symbol: 'ABEV3', name: 'Ambev ON', kind: 'Ação', price: 12.55, change: -0.24, sector: 'Bebidas', prefix: 'R$' },
  { symbol: 'USD/BRL', name: 'Dólar comercial', kind: 'Câmbio', price: 5.4321, change: -0.41, sector: 'Moedas', prefix: 'R$' },
  { symbol: 'EUR/BRL', name: 'Euro', kind: 'Câmbio', price: 5.9112, change: 0.18, sector: 'Moedas', prefix: 'R$' },
  { symbol: 'BTC', name: 'Bitcoin', kind: 'Cripto', price: 352840, change: 3.08, sector: 'Cripto', prefix: 'R$' },
  { symbol: 'ETH', name: 'Ethereum', kind: 'Cripto', price: 18420, change: -1.76, sector: 'Cripto', prefix: 'R$' },
  { symbol: 'OURO', name: 'Ouro (onça)', kind: 'Commodity', price: 2412.5, change: 0.55, sector: 'Metais', prefix: 'US$' },
  { symbol: 'BRENT', name: 'Petróleo Brent', kind: 'Commodity', price: 82.4, change: 1.12, sector: 'Energia', prefix: 'US$' },
]

export function formatPrice(asset: Pick<Asset, 'price' | 'kind' | 'prefix'>, price = asset.price) {
  const digits = asset.kind === 'Câmbio' ? 4 : asset.kind === 'Índice' ? 0 : 2
  const value = price.toLocaleString('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits })
  return asset.prefix ? `${asset.prefix} ${value}` : value
}

export const brl = (n: number, digits = 2) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: digits, maximumFractionDigits: digits })

export type Category = 'Mercado' | 'Economia' | 'Política' | 'Empresas' | 'Cripto' | 'Educação'

export type Article = {
  slug: string
  title: string
  dek: string
  category: Category
  author: string
  time: string
  read: number
  image: string
  body: string[]
}

export const articles: Article[] = [
  {
    slug: 'copom-mantem-selic',
    title: 'Copom mantém Selic e sinaliza cautela com inflação de serviços',
    dek: 'Comitê manteve a taxa básica e reforçou que o ciclo dependerá das expectativas e do câmbio nas próximas reuniões.',
    category: 'Economia',
    author: 'Marina Albuquerque',
    time: 'há 12 min',
    read: 6,
    image: '/images/copom.png',
    body: [
      'O Comitê de Política Monetária do Banco Central decidiu, por unanimidade, manter a taxa Selic no patamar atual. Em comunicado, o colegiado destacou que a inflação de serviços segue resiliente e que as expectativas ainda estão acima da meta.',
      'Para analistas, o tom do comunicado foi mais duro do que o esperado. "O BC deixou claro que não há pressa para cortar juros enquanto o mercado de trabalho continuar aquecido", avalia uma economista-chefe ouvida pela reportagem.',
      'A curva de juros futuros reagiu com leve alta nos vértices mais curtos, enquanto o dólar recuou frente ao real. O Ibovespa, que operava em alta, ampliou ganhos puxado por bancos.',
      'Na prática, para quem investe, a manutenção da Selic em nível elevado mantém atrativos os títulos pós-fixados, como o Tesouro Selic e CDBs que pagam um percentual do CDI.',
      'A próxima reunião do Copom acontece em seis semanas. Até lá, o mercado vai acompanhar de perto a divulgação do IPCA e os dados de atividade econômica.',
    ],
  },
  {
    slug: 'ibovespa-renova-maxima',
    title: 'Ibovespa sobe puxado por commodities e renova máxima do mês',
    dek: 'Petrobras e Vale lideram ganhos com alta do minério e do petróleo no exterior; giro financeiro supera a média.',
    category: 'Mercado',
    author: 'Rafael Tanaka',
    time: 'há 34 min',
    read: 4,
    image: '/images/b3.png',
    body: [
      'O principal índice da bolsa brasileira fechou em alta, renovando a máxima do mês. O movimento foi sustentado por empresas ligadas a commodities, que se beneficiaram da alta do petróleo e do minério de ferro no mercado internacional.',
      'O volume financeiro negociado superou a média dos últimos 30 dias, sinal de que investidores estrangeiros voltaram a ampliar posições no país.',
      'Entre as maiores altas do dia estiveram empresas do setor industrial e de energia. Na ponta negativa, varejistas sofreram com a perspectiva de juros altos por mais tempo.',
      'Para os próximos pregões, analistas técnicos apontam a região dos 130 mil pontos como resistência relevante.',
    ],
  },
  {
    slug: 'arcabouco-fiscal-meta',
    title: 'Governo revisa projeções e reafirma meta do arcabouço fiscal',
    dek: 'Relatório bimestral traz contingenciamento menor do que o previsto; mercado vê credibilidade em xeque.',
    category: 'Política',
    author: 'Beatriz Correia',
    time: 'há 1 h',
    read: 7,
    image: '/images/brasilia.png',
    body: [
      'O Ministério da Fazenda divulgou o relatório bimestral de receitas e despesas, reafirmando o compromisso com a meta de resultado primário prevista no arcabouço fiscal.',
      'O contingenciamento anunciado ficou abaixo das estimativas de mercado, o que gerou dúvidas entre economistas sobre a capacidade de cumprir a meta sem medidas adicionais de arrecadação.',
      'A questão fiscal é um dos principais fatores que influenciam o prêmio de risco do país, afetando juros longos, câmbio e, indiretamente, o preço das ações.',
      'Entender esse cenário ajuda o investidor a avaliar o risco de títulos prefixados e atrelados à inflação de longo prazo.',
    ],
  },
  {
    slug: 'weg-resultado-trimestre',
    title: 'WEG supera estimativas e ações disparam após balanço',
    dek: 'Receita com exportações e margem recorde surpreendem; analistas revisam preço-alvo para cima.',
    category: 'Empresas',
    author: 'Lucas Ferreira',
    time: 'há 2 h',
    read: 5,
    image: '/images/fabrica.png',
    body: [
      'A fabricante de motores elétricos reportou lucro líquido acima do consenso de mercado, impulsionado pela receita externa e por ganhos de eficiência operacional.',
      'A margem EBITDA atingiu o maior nível da série histórica, o que levou bancos a revisarem para cima seus preços-alvo para o papel.',
      'Segundo a companhia, a demanda por equipamentos ligados à transição energética segue forte, com carteira de pedidos robusta para os próximos trimestres.',
    ],
  },
  {
    slug: 'bitcoin-fluxo-etfs',
    title: 'Bitcoin avança com fluxo recorde para ETFs no exterior',
    dek: 'Criptomoeda acumula alta semanal; especialistas recomendam exposição pequena e diversificada.',
    category: 'Cripto',
    author: 'Ana Ribeiro',
    time: 'há 3 h',
    read: 4,
    image: '/images/cripto.png',
    body: [
      'O bitcoin voltou a subir impulsionado por entradas expressivas em fundos de índice negociados nos Estados Unidos.',
      'Apesar do otimismo, gestores lembram que a volatilidade do ativo segue elevada. A recomendação mais comum é limitar a exposição a uma pequena fatia da carteira.',
      'No Brasil, investidores podem acessar o ativo por meio de ETFs listados na B3, sem a necessidade de custodiar as moedas diretamente.',
    ],
  },
  {
    slug: 'reserva-de-emergencia',
    title: 'Reserva de emergência: quanto guardar e onde deixar o dinheiro',
    dek: 'O primeiro passo de qualquer planejamento financeiro explicado sem jargão, com exemplos práticos.',
    category: 'Educação',
    author: 'Equipe Tostão',
    time: 'há 5 h',
    read: 8,
    image: '/images/cofre.png',
    body: [
      'A reserva de emergência é o colchão que protege você de imprevistos: perda de emprego, problema de saúde, conserto do carro. Sem ela, qualquer susto vira dívida.',
      'A regra mais usada é guardar entre 6 e 12 meses do seu custo de vida mensal. Quem tem renda variável deve mirar no topo dessa faixa.',
      'O dinheiro precisa estar em um investimento seguro e com liquidez diária, como o Tesouro Selic ou CDBs de liquidez diária que paguem pelo menos 100% do CDI.',
      'Evite deixar a reserva na poupança: ela costuma render menos que as alternativas citadas. E nunca use a reserva para investir em ações ou cripto.',
      'Comece com o que for possível. Guardar 5% da renda todo mês já cria o hábito — e o hábito é o que transforma o planejamento em realidade.',
    ],
  },
  {
    slug: 'dolar-recua-fluxo',
    title: 'Dólar recua com fluxo estrangeiro e diferencial de juros',
    dek: 'Moeda americana opera abaixo de R$ 5,45; exportadores aproveitam para internalizar recursos.',
    category: 'Mercado',
    author: 'Rafael Tanaka',
    time: 'há 6 h',
    read: 3,
    image: '/images/cambio.png',
    body: [
      'O dólar comercial recuou frente ao real em um dia de apetite por risco nos mercados globais.',
      'O diferencial de juros entre Brasil e Estados Unidos segue atraindo capital estrangeiro para a renda fixa local, o que favorece a moeda brasileira.',
      'Para quem planeja viagens ou compras em dólar, especialistas sugerem comprar a moeda de forma escalonada, diluindo o risco de oscilações.',
    ],
  },
  {
    slug: 'ipca-desacelera',
    title: 'IPCA desacelera, mas núcleos seguem pressionados',
    dek: 'Alimentos aliviam o índice cheio; serviços subjacentes mantêm alerta para o Banco Central.',
    category: 'Economia',
    author: 'Marina Albuquerque',
    time: 'há 8 h',
    read: 5,
    image: '/images/mercado.png',
    body: [
      'O Índice Nacional de Preços ao Consumidor Amplo (IPCA) desacelerou no último mês, ajudado pela queda nos preços de alimentos.',
      'Os núcleos de inflação, que excluem itens mais voláteis, mostraram resistência, especialmente no grupo de serviços.',
      'Para o investidor, títulos atrelados ao IPCA seguem sendo uma forma de proteger o poder de compra no longo prazo.',
    ],
  },
]

export const indicators = [
  { label: 'Selic', value: 10.5, unit: '% a.a.', note: 'Taxa básica de juros', history: series(11, 24, 13.75, 0.015).reverse() },
  { label: 'IPCA 12m', value: 4.23, unit: '%', note: 'Inflação oficial', history: series(12, 24, 5.8, 0.03) },
  { label: 'PIB', value: 2.9, unit: '% a.a.', note: 'Crescimento anual', history: series(13, 24, 2.1, 0.04) },
  { label: 'Desemprego', value: 6.9, unit: '%', note: 'Taxa de desocupação', history: series(14, 24, 8.4, 0.02).reverse() },
  { label: 'Dólar', value: 5.43, unit: 'R$', note: 'Câmbio comercial', history: series(15, 24, 5.0, 0.015) },
  { label: 'CDI', value: 10.4, unit: '% a.a.', note: 'Referência da renda fixa', history: series(16, 24, 13.65, 0.015).reverse() },
]

export const copomMeetings = [
  { date: 'Jan', decision: 'Corte', bps: -50, rate: 11.25 },
  { date: 'Mar', decision: 'Corte', bps: -50, rate: 10.75 },
  { date: 'Mai', decision: 'Corte', bps: -25, rate: 10.5 },
  { date: 'Jun', decision: 'Manutenção', bps: 0, rate: 10.5 },
  { date: 'Jul', decision: 'Manutenção', bps: 0, rate: 10.5 },
  { date: 'Set', decision: 'Próxima', bps: null, rate: null },
]

export type Track = {
  slug: string
  title: string
  level: 'Iniciante' | 'Intermediário' | 'Avançado'
  lessons: { title: string; minutes: number }[]
  blurb: string
}

export const tracks: Track[] = [
  {
    slug: 'primeiros-passos',
    title: 'Primeiros passos com o dinheiro',
    level: 'Iniciante',
    blurb: 'Organize o orçamento, saia das dívidas e monte sua reserva de emergência.',
    lessons: [
      { title: 'Para onde vai o seu salário?', minutes: 6 },
      { title: 'O método 50/30/20', minutes: 8 },
      { title: 'Dívidas: qual pagar primeiro', minutes: 10 },
      { title: 'Reserva de emergência na prática', minutes: 7 },
    ],
  },
  {
    slug: 'renda-fixa',
    title: 'Renda fixa sem mistério',
    level: 'Iniciante',
    blurb: 'Tesouro Direto, CDB, LCI e LCA: entenda riscos, impostos e liquidez.',
    lessons: [
      { title: 'O que é CDI e por que importa', minutes: 5 },
      { title: 'Tesouro Selic, Prefixado e IPCA+', minutes: 12 },
      { title: 'CDB, LCI e LCA comparados', minutes: 9 },
      { title: 'Imposto de renda regressivo', minutes: 6 },
      { title: 'FGC: sua rede de proteção', minutes: 4 },
    ],
  },
  {
    slug: 'acoes',
    title: 'Ações e a bolsa de valores',
    level: 'Intermediário',
    blurb: 'Como funciona a B3, como ler um balanço e montar uma carteira diversificada.',
    lessons: [
      { title: 'O que é ser sócio de uma empresa', minutes: 7 },
      { title: 'Indicadores: P/L, ROE e dividend yield', minutes: 14 },
      { title: 'Diversificação e setores', minutes: 9 },
      { title: 'Dividendos e JCP', minutes: 8 },
    ],
  },
  {
    slug: 'fiis',
    title: 'Fundos imobiliários',
    level: 'Intermediário',
    blurb: 'Renda mensal com imóveis: tijolo, papel, vacância e P/VP.',
    lessons: [
      { title: 'Como um FII gera renda', minutes: 6 },
      { title: 'Tijolo x papel', minutes: 9 },
      { title: 'Lendo um relatório gerencial', minutes: 11 },
    ],
  },
  {
    slug: 'macro',
    title: 'Macroeconomia para investidores',
    level: 'Avançado',
    blurb: 'Juros, inflação, câmbio e fiscal: como o cenário mexe com sua carteira.',
    lessons: [
      { title: 'Como o Copom decide os juros', minutes: 10 },
      { title: 'Curva de juros explicada', minutes: 13 },
      { title: 'Risco fiscal e prêmio de risco', minutes: 12 },
      { title: 'Ciclos econômicos e alocação', minutes: 15 },
    ],
  },
  {
    slug: 'previdencia',
    title: 'Aposentadoria e longo prazo',
    level: 'Avançado',
    blurb: 'PGBL, VGBL, juros compostos e o número da sua independência financeira.',
    lessons: [
      { title: 'O poder dos juros compostos', minutes: 6 },
      { title: 'PGBL ou VGBL?', minutes: 9 },
      { title: 'Calculando sua independência', minutes: 11 },
    ],
  },
]

export const glossary = [
  { term: 'Ação', def: 'Pequena fração do capital de uma empresa. Quem compra se torna sócio e participa dos lucros e riscos.' },
  { term: 'Amortização', def: 'Pagamento de parte do valor principal de uma dívida, reduzindo o saldo devedor.' },
  { term: 'Benchmark', def: 'Indicador usado como referência de desempenho, como o CDI na renda fixa ou o Ibovespa nas ações.' },
  { term: 'CDB', def: 'Certificado de Depósito Bancário: você empresta dinheiro ao banco e recebe juros. Protegido pelo FGC.' },
  { term: 'CDI', def: 'Taxa de empréstimos entre bancos. É a principal referência de rentabilidade da renda fixa.' },
  { term: 'Copom', def: 'Comitê de Política Monetária do Banco Central, que define a taxa Selic a cada 45 dias.' },
  { term: 'Dividendos', def: 'Parte do lucro de uma empresa distribuída aos acionistas, geralmente isenta de IR no Brasil.' },
  { term: 'Dividend Yield', def: 'Quanto uma ação pagou de dividendos em relação ao seu preço, em percentual.' },
  { term: 'ETF', def: 'Fundo de índice negociado na bolsa que replica uma cesta de ativos, como o Ibovespa.' },
  { term: 'FGC', def: 'Fundo Garantidor de Créditos: protege até R$ 250 mil por CPF e instituição em caso de quebra do banco.' },
  { term: 'FII', def: 'Fundo de Investimento Imobiliário: investe em imóveis ou títulos do setor e distribui renda mensal.' },
  { term: 'IPCA', def: 'Índice de inflação oficial do Brasil, medido pelo IBGE.' },
  { term: 'Juros compostos', def: 'Juros calculados sobre o valor inicial mais os juros já acumulados — o famoso juros sobre juros.' },
  { term: 'Liquidez', def: 'Facilidade e rapidez com que um investimento pode ser transformado em dinheiro sem perder valor.' },
  { term: 'P/L', def: 'Preço sobre lucro: quantos anos de lucro seriam necessários para pagar o preço atual da ação.' },
  { term: 'Renda variável', def: 'Investimentos cujo retorno não é conhecido no momento da aplicação, como ações e FIIs.' },
  { term: 'Selic', def: 'Taxa básica de juros da economia, usada pelo Banco Central para controlar a inflação.' },
  { term: 'Spread', def: 'Diferença entre o preço de compra e de venda de um ativo, ou entre a taxa de captação e empréstimo.' },
  { term: 'Tesouro Direto', def: 'Programa para pessoas físicas comprarem títulos públicos federais pela internet.' },
  { term: 'Volatilidade', def: 'Intensidade das oscilações de preço de um ativo. Quanto maior, maior o risco no curto prazo.' },
]

export const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/mercado', label: 'Mercado' },
  { href: '/noticias', label: 'Notícias' },
  { href: '/economia', label: 'Economia' },
  { href: '/aprender', label: 'Aprender' },
  { href: '/calculadora', label: 'Calculadora' },
  { href: '/orcamento', label: 'Orçamento' },
  { href: '/glossario', label: 'Glossário' },
  { href: '/perfil', label: 'Perfil' },
]
