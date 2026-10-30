-- ═══════════════════════════════════════════════════════════════════════════
--  Galería — esquema inicial
--  Ejecútelo una vez en Supabase: Dashboard → SQL Editor → pegar y «Run».
--  Seguridad: Row Level Security en todas las tablas. El público solo puede
--  LEER lo publicado; solo los usuarios registrados en `admins` pueden escribir.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Administradores ─────────────────────────────────────────────────────────
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Cada usuario puede comprobar si él mismo es administrador (lo usa el servidor)
drop policy if exists "admins: leer propia fila" on public.admins;
create policy "admins: leer propia fila" on public.admins
  for select to authenticated using (user_id = auth.uid());

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ── Utilidad: updated_at automático ─────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── Colecciones ─────────────────────────────────────────────────────────────
create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  description text not null default '',
  period text not null default '',
  cover_artwork_id uuid,
  sort_order integer not null default 0,
  status text not null default 'publicada' check (status in ('publicada', 'borrador')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Obras ───────────────────────────────────────────────────────────────────
create table if not exists public.artworks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  author text not null default '',
  year integer not null check (year between 1900 and 2100),
  technique text not null,
  materials text not null default '',
  support text not null default '',
  height_cm numeric(7, 2) not null check (height_cm > 0),
  width_cm numeric(7, 2) not null check (width_cm > 0),
  depth_cm numeric(7, 2) check (depth_cm is null or depth_cm >= 0),
  collection_id uuid references public.collections (id) on delete set null,
  style text not null default '',
  concept text not null default '',
  story text not null default '',
  availability text not null default 'disponible'
    check (availability in ('disponible', 'reservada', 'vendida', 'coleccion-privada', 'no-disponible')),
  inventory_number text not null default '',
  certificate_included boolean not null default true,
  certificate_note text,
  price_amount numeric(12, 2) check (price_amount is null or price_amount >= 0),
  price_currency char(3) not null default 'MXN',
  price_visible boolean not null default false,
  image jsonb,
  gallery jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  status text not null default 'borrador' check (status in ('publicada', 'borrador')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists artworks_status_order_idx on public.artworks (status, sort_order);
create index if not exists artworks_collection_idx on public.artworks (collection_id);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'collections_cover_fk') then
    alter table public.collections
      add constraint collections_cover_fk foreign key (cover_artwork_id) references public.artworks (id) on delete set null;
  end if;
end $$;

drop trigger if exists artworks_touch on public.artworks;
create trigger artworks_touch before update on public.artworks for each row execute function public.touch_updated_at();
drop trigger if exists collections_touch on public.collections;
create trigger collections_touch before update on public.collections for each row execute function public.touch_updated_at();

alter table public.artworks enable row level security;
alter table public.collections enable row level security;

drop policy if exists "obras: lectura pública de publicadas" on public.artworks;
create policy "obras: lectura pública de publicadas" on public.artworks
  for select to anon, authenticated using (status = 'publicada' or public.is_admin());

drop policy if exists "obras: escritura admin" on public.artworks;
create policy "obras: escritura admin" on public.artworks
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "colecciones: lectura pública de publicadas" on public.collections;
create policy "colecciones: lectura pública de publicadas" on public.collections
  for select to anon, authenticated using (status = 'publicada' or public.is_admin());

drop policy if exists "colecciones: escritura admin" on public.collections;
create policy "colecciones: escritura admin" on public.collections
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ── Perfil del artista (una sola fila) ──────────────────────────────────────
create table if not exists public.artist_profile (
  id integer primary key default 1 check (id = 1),
  data jsonb not null,
  updated_at timestamptz not null default now()
);

drop trigger if exists artist_touch on public.artist_profile;
create trigger artist_touch before update on public.artist_profile for each row execute function public.touch_updated_at();

alter table public.artist_profile enable row level security;

drop policy if exists "perfil: lectura pública" on public.artist_profile;
create policy "perfil: lectura pública" on public.artist_profile
  for select to anon, authenticated using (true);

drop policy if exists "perfil: escritura admin" on public.artist_profile;
create policy "perfil: escritura admin" on public.artist_profile
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ── Consultas del formulario de contacto ────────────────────────────────────
-- Se insertan desde el servidor con la clave de servicio (no hay política de
-- inserción pública, así nadie puede escribir directamente con la clave anónima).
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  reason text not null,
  artwork_slug text,
  artwork_title text,
  message text not null,
  status text not null default 'nueva' check (status in ('nueva', 'atendida'))
);

alter table public.inquiries enable row level security;

drop policy if exists "consultas: lectura admin" on public.inquiries;
create policy "consultas: lectura admin" on public.inquiries
  for select to authenticated using (public.is_admin());

drop policy if exists "consultas: actualización admin" on public.inquiries;
create policy "consultas: actualización admin" on public.inquiries
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- ── Almacenamiento de fotografías ───────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('obras', 'obras', true, 31457280, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "fotos: subir admin" on storage.objects;
create policy "fotos: subir admin" on storage.objects
  for insert to authenticated with check (bucket_id = 'obras' and public.is_admin());

drop policy if exists "fotos: modificar admin" on storage.objects;
create policy "fotos: modificar admin" on storage.objects
  for update to authenticated using (bucket_id = 'obras' and public.is_admin());

drop policy if exists "fotos: borrar admin" on storage.objects;
create policy "fotos: borrar admin" on storage.objects
  for delete to authenticated using (bucket_id = 'obras' and public.is_admin());

-- La lectura es pública porque el bucket es público (URLs /storage/v1/object/public/obras/...).

-- ═══════════════════════════════════════════════════════════════════════════
--  DESPUÉS de crear el usuario del artista (Authentication → Users → Add user),
--  conviértalo en administrador cambiando el correo y ejecutando:
--
--    insert into public.admins (user_id)
--    select id from auth.users where email = 'correo-del-artista@ejemplo.com';
-- ═══════════════════════════════════════════════════════════════════════════
