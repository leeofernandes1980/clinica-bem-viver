const FUSO_CLINICA = "America/Manaus";

const dataHora = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: FUSO_CLINICA,
});

const dataSimples = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeZone: "UTC",
});

export const formatarDataHora = (valor: string) =>
  dataHora.format(new Date(valor));

// Colunas "date" não têm fuso: tratar como UTC evita mostrar o dia anterior.
export const formatarData = (valor: string) =>
  dataSimples.format(new Date(`${valor}T00:00:00Z`));

// Campo datetime-local digitado pela equipe, sempre no horário de Manaus (UTC-4, sem horário de verão).
export function dataHoraManausParaIso(valor: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(valor)) return null;
  const data = new Date(`${valor}:00-04:00`);
  return Number.isNaN(data.getTime()) ? null : data.toISOString();
}

// Caminho inverso: valor inicial do campo datetime-local, no horário de Manaus.
export function isoParaCampoManaus(valor: string) {
  const quatroHoras = 4 * 60 * 60 * 1000;
  return new Date(new Date(valor).getTime() - quatroHoras)
    .toISOString()
    .slice(0, 16);
}

export function numeroWhatsapp(telefone: string) {
  const digitos = telefone.replace(/\D/g, "");
  if (digitos.startsWith("55") && digitos.length >= 12) return digitos;
  return digitos.length === 10 || digitos.length === 11 ? `55${digitos}` : null;
}
