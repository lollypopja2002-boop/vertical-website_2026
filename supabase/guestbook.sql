-- Supabase SQL Editor에서 실행합니다. 방문자는 기록을 읽고 자신의 기록만 삭제할 수 있습니다.
create table if not exists public.guestbook_stamps (
 id uuid primary key,
 owner_id uuid not null references auth.users(id),
 payload jsonb not null,
 created_at timestamptz not null default now(),
 constraint stamp_shape check (
  jsonb_typeof(payload) = 'object'
  and payload ?& array['name','x','y','angle','scale']
  and jsonb_typeof(payload->'name') = 'string'
  and char_length(payload->>'name') between 1 and 12
  and coalesce(char_length(payload->>'message'),0) <= 200
  and jsonb_typeof(payload->'x') = 'number'
  and (payload->>'x')::numeric between 0 and 99999
  and jsonb_typeof(payload->'y') = 'number'
  and (payload->>'y')::numeric between 0 and 1
  and jsonb_typeof(payload->'angle') = 'number'
  and abs((payload->>'angle')::numeric) <= 10
  and jsonb_typeof(payload->'scale') = 'number'
  and (payload->>'scale')::numeric between 0.5 and 2
 )
);
alter table public.guestbook_stamps enable row level security;
revoke all on public.guestbook_stamps from anon, authenticated;
grant select on public.guestbook_stamps to anon, authenticated;
grant insert, delete on public.guestbook_stamps to authenticated;
drop policy if exists "public can read stamps" on public.guestbook_stamps;
create policy "public can read stamps" on public.guestbook_stamps for select to anon, authenticated using (true);
drop policy if exists "visitors insert own stamps" on public.guestbook_stamps;
create policy "visitors insert own stamps" on public.guestbook_stamps for insert to authenticated with check (owner_id = (select auth.uid()));
drop policy if exists "visitors remove own stamps" on public.guestbook_stamps;
create policy "visitors remove own stamps" on public.guestbook_stamps for delete to authenticated using (owner_id = (select auth.uid()));
create index if not exists guestbook_stamps_created on public.guestbook_stamps(created_at,id);
