// Ajuste NEXT_PUBLIC_SITE_URL na Vercel se o domínio final for diferente.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://clinica-bem-viver.vercel.app";

export const SEO = {
  titulo: "Clínica Bem Viver em Manaus | Clínica Geral, Nutrição, Psicologia e Fisioterapia",
  descricao:
    "Atendimento integral em Manaus-AM: clínica geral, nutrição, psicologia e fisioterapia na Av. Djalma Batista. Agende sua consulta pelo WhatsApp.",
} as const;

// O número real fica só no .env.local. Sem a variável, o site usa o número fictício.
const WHATSAPP_NUMERO =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMERO || "5592999990000";

export const CLINICA = {
  nome: "Clínica Bem Viver",
  slogan: "Cuidando de você com atenção integral",
  endereco: {
    logradouro: "Av. Djalma Batista, 1200",
    bairro: "Chapada",
    cidade: "Manaus",
    estado: "AM",
    completo: "Av. Djalma Batista, 1200 – Chapada, Manaus-AM",
  },
  whatsapp: {
    exibicao: WHATSAPP_NUMERO.replace(/^55(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3"),
    link: `https://wa.me/${WHATSAPP_NUMERO}`,
  },
  horarios: [
    { dias: "Seg–Sex", horas: "7h–19h" },
    { dias: "Sáb", horas: "8h–13h" },
  ],
} as const;

export const HERO = {
  selo: "Clínica multidisciplinar em Manaus-AM",
  subtitulo:
    "Clínica geral, nutrição, psicologia e fisioterapia em um só lugar, com um cuidado próximo e pensado para a sua rotina.",
} as const;

export const NAV_LINKS = [
  { label: "Especialidades", href: "#especialidades" },
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Equipe", href: "#equipe" },
  { label: "Contato", href: "#contato" },
] as const;

export const ESPECIALIDADES_SECAO = {
  titulo: "Nossas especialidades",
  subtitulo:
    "Profissionais de diferentes áreas para cuidar da sua saúde de forma completa.",
} as const;

export const ESPECIALIDADES = [
  {
    nome: "Clínica Geral",
    icone: "estetoscopio",
    descricao:
      "Consultas, check-ups e acompanhamento contínuo para cuidar da sua saúde em todas as fases da vida.",
  },
  {
    nome: "Nutrição",
    icone: "maca",
    descricao:
      "Planos alimentares individualizados, alinhados à sua rotina, aos seus objetivos e às suas necessidades.",
  },
  {
    nome: "Psicologia",
    icone: "cerebro",
    descricao:
      "Atendimento acolhedor e sigiloso para fortalecer sua saúde emocional e seu bem-estar.",
  },
  {
    nome: "Fisioterapia",
    icone: "movimento",
    descricao:
      "Reabilitação e prevenção de lesões para você recuperar mobilidade e qualidade de vida.",
  },
] as const;

export const COMO_FUNCIONA_SECAO = {
  titulo: "Como funciona",
  subtitulo: "Agendar sua consulta é simples e leva poucos minutos.",
} as const;

export const PASSOS = [
  {
    titulo: "Escolha",
    descricao: "Selecione a especialidade que atende à sua necessidade.",
  },
  {
    titulo: "Agende",
    descricao: "Fale conosco pelo WhatsApp ou formulário e escolha o melhor horário.",
  },
  {
    titulo: "Consulte",
    descricao: "Venha à clínica e receba um atendimento atencioso e integral.",
  },
] as const;

export const DEPOIMENTOS_SECAO = {
  titulo: "O que dizem nossos pacientes",
  subtitulo: "Histórias de quem escolheu cuidar da saúde com a gente.",
  aviso: "Depoimentos ilustrativos, criados para este projeto de portfólio.",
} as const;

export const DEPOIMENTOS = [
  {
    nome: "Mariana Souza",
    estrelas: 5,
    texto:
      "Fui muito bem recebida desde o agendamento. A equipe é atenciosa e explica tudo com calma.",
  },
  {
    nome: "Carlos Almeida",
    estrelas: 5,
    texto:
      "Depois de meses com dores nas costas, a fisioterapia fez toda a diferença na minha rotina.",
  },
  {
    nome: "Fernanda Lima",
    estrelas: 5,
    texto:
      "O acompanhamento nutricional foi feito para a minha realidade. Ambiente tranquilo e acolhedor.",
  },
] as const;

export const EQUIPE_SECAO = {
  titulo: "Conheça nossa equipe",
  subtitulo: "Profissionais dedicados a oferecer um atendimento próximo e humano.",
} as const;

export const EQUIPE = [
  {
    nome: "Dra. Helena Tavares",
    especialidade: "Clínica Geral",
    foto: "/images/equipe-helena.svg",
  },
  {
    nome: "Rafael Monteiro",
    especialidade: "Nutrição",
    foto: "/images/equipe-rafael.svg",
  },
  {
    nome: "Camila Andrade",
    especialidade: "Psicologia",
    foto: "/images/equipe-camila.svg",
  },
] as const;

// Perfis fictícios: os links ficam em "#" para não apontar para contas reais de terceiros.
export const REDES_SOCIAIS = [
  { nome: "Instagram", href: "#" },
  { nome: "Facebook", href: "#" },
  { nome: "LinkedIn", href: "#" },
] as const;

export const FORMULARIO_SECAO = {
  titulo: "Agende sua consulta",
  subtitulo:
    "Preencha o formulário e nossa equipe retorna o contato para confirmar o melhor horário.",
  privacidade: "Seus dados serão usados apenas para retornarmos o contato.",
} as const;

export const STATUS_CLIENTE = {
  novo: "Novo",
  em_contato: "Em contato",
  agendado: "Agendado",
  paciente: "Paciente",
  inativo: "Inativo",
} as const;

export type StatusCliente = keyof typeof STATUS_CLIENTE;

export const STATUS_CONSULTA = {
  agendada: "Agendada",
  confirmada: "Confirmada",
  realizada: "Realizada",
  cancelada: "Cancelada",
} as const;

export const CANAIS_INTERACAO = {
  nota: "Anotação",
  telefone: "Telefone",
  whatsapp: "WhatsApp",
  email: "E-mail",
  site: "Site",
} as const;

export const RODAPE = {
  aviso:
    "Clínica fictícia: site demonstrativo de portfólio. Não realizamos atendimentos reais.",
} as const;

export const FORMSPREE_ENDPOINT =`https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`;
