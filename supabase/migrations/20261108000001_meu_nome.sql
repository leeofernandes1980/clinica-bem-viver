-- O paciente não lê a tabela de clientes, que tem observações internas.
-- Esta função devolve apenas o nome dele, para a saudação da área do cliente.
create function public.meu_nome()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select nome from public.clientes where id = public.meu_cliente_id();
$$;

revoke all on function public.meu_nome() from public, anon;
grant execute on function public.meu_nome() to authenticated;
