# Clínica Bem Viver

Modelo de site com CRM e área do cliente para clínicas e consultórios. A **clínica é fictícia** e todos os dados são de demonstração: o projeto serve para mostrar o que um negócio sem site, ou sem um sistema de agendamento adequado, pode ter.

**Demonstração:** [clinica-bem-viver.vercel.app](https://clinica-bem-viver.vercel.app). As áreas restritas são apresentadas mediante acesso de demonstração.

## O que o sistema faz

**Site público**
- Página responsiva com especialidades, passo a passo, equipe e depoimentos ilustrativos
- Botões de WhatsApp e formulário de contato
- Cada contato enviado entra automaticamente no CRM e gera um aviso por e-mail

**CRM da equipe (`/crm`)**
- Lista de clientes com busca e filtros por status
- Cadastro manual e edição de dados
- Mensagens prontas e editáveis para WhatsApp e e-mail
- Agendamento e remarcação de consultas, no horário de Manaus
- Histórico de cada cliente, com anotações
- Envio de exames em PDF, com publicação controlada pela equipe

**Área do cliente (`/minha-area`)**
- Acesso por link enviado ao e-mail, sem senha
- Próximas consultas, consultas anteriores e resultados de exames
- Busca por data, especialidade, profissional ou exame

## Segurança

As permissões ficam no banco de dados, por meio de Row Level Security, e valem mesmo que alguém tente acessar os dados sem passar pelas telas:

- O cliente só lê as próprias consultas e os próprios exames publicados
- Só um e-mail confirmado dá acesso aos dados
- Os PDFs ficam em área privada e abrem por links que expiram em 60 segundos
- O formulário público cria contatos novos, mas nunca altera um cliente existente

## Tecnologias

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Supabase (Postgres, autenticação e armazenamento), Formspree e Vercel.

## Como rodar

1. Crie um projeto no [Supabase](https://supabase.com) e aplique as migrações de `supabase/migrations`.
2. Copie `.env.example` para `.env.local` e preencha os valores. Nunca coloque a chave `service_role` em variáveis `NEXT_PUBLIC_`.
3. Instale as dependências e inicie o site:

```bash
npm install
npm run dev
```

4. Crie um usuário no painel do Supabase e torne-o administrador com o SQL abaixo:

```sql
insert into public.administradores (user_id)
select id from auth.users where email = 'seu-email@exemplo.com';
```

5. Para carregar clientes, consultas e exames fictícios, com datas relativas a hoje:

```bash
npm run demo:seed
```

## Antes de usar com uma clínica real

Este projeto é uma demonstração. Para receber dados reais de pacientes, ainda é preciso:

- Tratar a LGPD com orientação jurídica: exames são dados sensíveis e exigem base legal, registro de acessos e prazo de guarda
- Conferir as regras do conselho profissional sobre publicidade e depoimentos
- Limitar a quantidade de envios do formulário público, contra spam
- Usar um serviço de e-mail próprio, porque o envio padrão do Supabase tem limite baixo
- Remover o `noindex` de `app/layout.tsx` e o aviso de clínica fictícia do rodapé
