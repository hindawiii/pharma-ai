create schema if not exists extensions;
grant usage on schema extensions to postgres, anon, authenticated, service_role;
alter extension pg_trgm set schema extensions;