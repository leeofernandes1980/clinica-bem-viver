// Recria os dados fictícios de demonstração, com datas relativas a hoje.
// Uso: npm run demo:seed
// Entra como administrador, sem chave secreta, e só apaga os e-mails listados aqui.

const {
  NEXT_PUBLIC_SUPABASE_URL: URL_BASE,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: CHAVE,
  DEMO_ADMIN_EMAIL,
  DEMO_ADMIN_SENHA,
  DEMO_PACIENTE_EMAIL,
} = process.env;

if (!URL_BASE || !CHAVE || !DEMO_ADMIN_EMAIL || !DEMO_ADMIN_SENHA || !DEMO_PACIENTE_EMAIL) {
  console.error("Defina as variáveis listadas no .env.example antes de rodar.");
  process.exit(1);
}

const CLIENTES = [
  {
    nome: "Ana Rocha",
    email: DEMO_PACIENTE_EMAIL.toLowerCase(),
    telefone: "(92) 90000-0001",
    especialidade: "Nutrição",
    status: "paciente",
    origem: "manual",
    nota: "Prefere contato pela manhã.",
    consultas: [
      ["Nutrição", "Rafael Monteiro", 7, "confirmada"],
      ["Fisioterapia", "Equipe de Fisioterapia", 21, "agendada"],
      ["Clínica Geral", "Dra. Helena Tavares", -30, "realizada"],
    ],
    exames: [
      ["Hemograma completo (fictício)", -5, true],
      ["Colesterol e triglicerídeos (fictício)", -32, true],
      ["Glicemia em jejum (rascunho fictício)", -1, false],
    ],
  },
  {
    nome: "Bruno Costa",
    email: "bruno.ficticio@example.com",
    telefone: "(92) 90000-0002",
    especialidade: "Psicologia",
    status: "paciente",
    origem: "manual",
    nota: "Acompanhamento quinzenal.",
    consultas: [["Psicologia", "Camila Andrade", 3, "agendada"]],
    exames: [["Avaliação inicial (fictício)", -10, true]],
  },
  {
    nome: "Carla Mendes",
    email: "carla.ficticia@example.com",
    telefone: "(92) 90000-0003",
    especialidade: "Fisioterapia",
    status: "novo",
    origem: "site",
    nota: "Contato pelo site: quer avaliação para dor no ombro.",
  },
  {
    nome: "Diego Farias",
    email: "diego.ficticio@example.com",
    telefone: "(92) 90000-0004",
    especialidade: "Clínica Geral",
    status: "em_contato",
    origem: "site",
    nota: "Pediu retorno no fim da tarde.",
  },
  {
    nome: "Elisa Nunes",
    email: "elisa.ficticia@example.com",
    telefone: "(92) 90000-0005",
    especialidade: "Nutrição",
    status: "agendado",
    origem: "manual",
    nota: "Cadastrada na recepção.",
    consultas: [["Nutrição", "Rafael Monteiro", 5, "agendada"]],
  },
  {
    nome: "Fábio Lima",
    email: "fabio.ficticio@example.com",
    telefone: "(92) 90000-0006",
    especialidade: "Fisioterapia",
    status: "inativo",
    origem: "manual",
    nota: "Concluiu o tratamento.",
    consultas: [["Fisioterapia", "Equipe de Fisioterapia", -60, "realizada"]],
  },
];

const DIA = 24 * 60 * 60 * 1000;

function dataHora(dias) {
  const dia = new Date(Date.now() + dias * DIA).toISOString().slice(0, 10);
  return `${dia}T10:00:00-04:00`;
}

const data = (dias) => new Date(Date.now() + dias * DIA).toISOString().slice(0, 10);

function criarPdf(titulo) {
  const texto = titulo.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[()\\]/g, "");
  const conteudo = `BT /F1 16 Tf 50 740 Td (${texto}) Tj 0 -28 Td /F1 12 Tf (Documento ficticio de demonstracao, sem valor clinico.) Tj ET`;
  const objetos = [
    "<</Type/Catalog/Pages 2 0 R>>",
    "<</Type/Pages/Count 1/Kids[3 0 R]>>",
    "<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>",
    `<</Length ${conteudo.length}>>\nstream\n${conteudo}\nendstream`,
    "<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>",
  ];

  let pdf = "%PDF-1.4\n";
  const posicoes = objetos.map((objeto, indice) => {
    const posicao = pdf.length;
    pdf += `${indice + 1} 0 obj\n${objeto}\nendobj\n`;
    return posicao;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objetos.length + 1}\n0000000000 65535 f \n`;
  pdf += posicoes.map((p) => `${String(p).padStart(10, "0")} 00000 n \n`).join("");
  pdf += `trailer<</Size ${objetos.length + 1}/Root 1 0 R>>\nstartxref\n${xref}\n%%EOF\n`;
  return pdf;
}

const login = await fetch(`${URL_BASE}/auth/v1/token?grant_type=password`, {
  method: "POST",
  headers: { apikey: CHAVE, "Content-Type": "application/json" },
  body: JSON.stringify({ email: DEMO_ADMIN_EMAIL, password: DEMO_ADMIN_SENHA }),
});

if (!login.ok) {
  console.error(`Não foi possível entrar como administrador (HTTP ${login.status}).`);
  process.exit(1);
}

const { access_token: token } = await login.json();
const cabecalhos = { apikey: CHAVE, Authorization: `Bearer ${token}` };

async function banco(caminho, metodo = "GET", corpo) {
  const resposta = await fetch(`${URL_BASE}/rest/v1/${caminho}`, {
    method: metodo,
    headers: {
      ...cabecalhos,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: corpo && JSON.stringify(corpo),
  });
  if (!resposta.ok) {
    throw new Error(`${metodo} ${caminho}: HTTP ${resposta.status} ${await resposta.text()}`);
  }
  return resposta.json();
}

const arquivo = (caminho, opcoes) =>
  fetch(`${URL_BASE}/storage/v1/object/exames/${caminho}`, {
    ...opcoes,
    headers: { ...cabecalhos, ...opcoes.headers },
  });

for (const cliente of CLIENTES) {
  const antigos = await banco(`clientes?email=eq.${encodeURIComponent(cliente.email)}&select=id`);
  for (const { id } of antigos) {
    const exames = await banco(`exames?cliente_id=eq.${id}&select=arquivo_path`);
    for (const exame of exames) {
      await arquivo(exame.arquivo_path, { method: "DELETE" });
    }
    await banco(`clientes?id=eq.${id}`, "DELETE");
  }

  const { nota, consultas = [], exames = [], ...dados } = cliente;
  const [{ id }] = await banco("clientes", "POST", dados);

  await banco("interacoes", "POST", { cliente_id: id, canal: "nota", descricao: nota });

  for (const [especialidade, profissional, dias, status] of consultas) {
    await banco("consultas", "POST", {
      cliente_id: id,
      especialidade,
      profissional,
      data_hora: dataHora(dias),
      status,
    });
  }

  for (const [titulo, dias, publicado] of exames) {
    const caminho = `${id}/${crypto.randomUUID()}.pdf`;
    const envio = await arquivo(caminho, {
      method: "POST",
      headers: { "Content-Type": "application/pdf" },
      body: criarPdf(titulo),
    });
    if (!envio.ok) throw new Error(`Envio do PDF: HTTP ${envio.status}`);

    await banco("exames", "POST", {
      cliente_id: id,
      titulo,
      data_exame: data(dias),
      arquivo_path: caminho,
      publicado,
    });
  }

  console.log(`ok: ${cliente.nome}`);
}

console.log(`\nDados de demonstração recriados: ${CLIENTES.length} clientes.`);
