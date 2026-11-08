-- CRM da Clínica Bem Viver: clientes, histórico, consultas e exames.
-- Regra geral: o administrador acessa tudo; o paciente só lê as próprias consultas
-- e os próprios exames publicados; visitantes só podem enviar o formulário do site.

-- ---------------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------------

create table public.administradores (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(nome) between 1 and 200),
  email text not null check (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' and email = lower(email)),
  telefone text not null check (char_length(telefone) between 1 and 30),
  especialidade text check (char_length(especialidade) <= 100),
  status text not null default 'novo'
    check (status in ('novo', 'em_contato', 'agendado', 'paciente', 'inativo')),
  origem text not null default 'manual' check (origem in ('site', 'manual')),
  observacoes text,
  created_at timestamptz not null default now()
);

-- O e-mail identifica o cliente e dá acesso ao portal, por isso é único.
create unique index clientes_email_unico on public.clientes (email);

create table public.interacoes (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.clientes (id) on delete cascade,
  canal text not null check (canal in ('site', 'whatsapp', 'email', 'telefone', 'nota')),
  descricao text not null check (char_length(descricao) between 1 and 5000),
  criado_por uuid default auth.uid() references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index interacoes_cliente_idx on public.interacoes (cliente_id, created_at desc);

-- Sem campo de observações: o paciente lê a linha inteira. Anotações internas ficam em interacoes.
create table public.consultas (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.clientes (id) on delete cascade,
  especialidade text not null check (char_length(especialidade) between 1 and 100),
  profissional text not null check (char_length(profissional) between 1 and 200),
  data_hora timestamptz not null,
  status text not null default 'agendada'
    check (status in ('agendada', 'confirmada', 'realizada', 'cancelada')),
  created_at timestamptz not null default now()
);

create index consultas_cliente_idx on public.consultas (cliente_id, data_hora desc);

create table public.exames (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.clientes (id) on delete cascade,
  titulo text not null check (char_length(titulo) between 1 and 200),
  data_exame date not null,
  arquivo_path text not null unique,
  -- O paciente só enxerga o exame depois que a equipe o publica.
  publicado boolean not null default false,
  criado_por uuid default auth.uid() references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index exames_cliente_idx on public.exames (cliente_id, data_exame desc);

-- ---------------------------------------------------------------------------
-- Funções de acesso
-- ---------------------------------------------------------------------------

create function public.e_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.administradores where user_id = auth.uid()
  );
$$;

-- Só e-mails confirmados dão acesso: criar conta com o e-mail de outra pessoa não libera nada.
create function public.meu_cliente_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select c.id
  from public.clientes c
  join auth.users u on lower(u.email) = c.email
  where u.id = auth.uid()
    and u.email_confirmed_at is not null;
$$;

-- Entrada do formulário público. Não retorna nada, para não revelar quem já é cliente,
-- e não altera clientes existentes, para um visitante não sobrescrever dados de terceiros.
create function public.registrar_contato(
  p_nome text,
  p_email text,
  p_telefone text,
  p_especialidade text default null,
  p_mensagem text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(trim(p_email));
  v_nome text := trim(p_nome);
  v_telefone text := trim(p_telefone);
  v_cliente_id uuid;
begin
  if char_length(p_mensagem) > 2000 then
    raise exception 'Mensagem muito longa';
  end if;

  insert into public.clientes (nome, email, telefone, especialidade, origem)
  values (v_nome, v_email, v_telefone, p_especialidade, 'site')
  on conflict (email) do nothing
  returning id into v_cliente_id;

  if v_cliente_id is null then
    select id into v_cliente_id from public.clientes where email = v_email;
  end if;

  insert into public.interacoes (cliente_id, canal, descricao)
  values (
    v_cliente_id,
    'site',
    format(
      E'Contato pelo site\nNome informado: %s\nTelefone informado: %s\nEspecialidade: %s\nMensagem: %s',
      v_nome, v_telefone, coalesce(p_especialidade, '-'), coalesce(p_mensagem, '-')
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Permissões
-- ---------------------------------------------------------------------------

revoke all on function public.e_admin() from public, anon;
revoke all on function public.meu_cliente_id() from public, anon;
revoke all on function public.registrar_contato(text, text, text, text, text) from public;

grant execute on function public.e_admin() to authenticated;
grant execute on function public.meu_cliente_id() to authenticated;
grant execute on function public.registrar_contato(text, text, text, text, text) to anon, authenticated;

revoke all on public.administradores, public.clientes, public.interacoes, public.consultas, public.exames
  from public, anon, authenticated;

grant select, insert, update, delete
  on public.clientes, public.interacoes, public.consultas, public.exames
  to authenticated;

alter table public.administradores enable row level security;
alter table public.clientes enable row level security;
alter table public.interacoes enable row level security;
alter table public.consultas enable row level security;
alter table public.exames enable row level security;

create policy "admin acessa clientes" on public.clientes
  for all to authenticated
  using (public.e_admin()) with check (public.e_admin());

create policy "admin acessa interacoes" on public.interacoes
  for all to authenticated
  using (public.e_admin()) with check (public.e_admin());

create policy "admin acessa consultas" on public.consultas
  for all to authenticated
  using (public.e_admin()) with check (public.e_admin());

create policy "paciente le as proprias consultas" on public.consultas
  for select to authenticated
  using (cliente_id = public.meu_cliente_id());

create policy "admin acessa exames" on public.exames
  for all to authenticated
  using (public.e_admin()) with check (public.e_admin());

create policy "paciente le os proprios exames publicados" on public.exames
  for select to authenticated
  using (publicado and cliente_id = public.meu_cliente_id());

-- ---------------------------------------------------------------------------
-- Arquivos dos exames: área privada, somente PDF, até 10 MB
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('exames', 'exames', false, 10485760, array['application/pdf'])
on conflict (id) do nothing;

create policy "admin acessa arquivos de exames" on storage.objects
  for all to authenticated
  using (bucket_id = 'exames' and public.e_admin())
  with check (bucket_id = 'exames' and public.e_admin());

create policy "paciente baixa os proprios exames publicados" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'exames'
    and exists (
      select 1
      from public.exames e
      where e.arquivo_path = storage.objects.name
        and e.publicado
        and e.cliente_id = public.meu_cliente_id()
    )
  );
