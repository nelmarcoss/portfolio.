-- Tramo: independent project; no Atlas tables or credentials.
create table public.packages (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 alias text not null check (char_length(alias) between 1 and 80),
 tracking_number text not null check (tracking_number ~ '^[A-Za-z0-9-]{5,80}$'),
 carrier text not null check (carrier in ('correos','correos-express','seur','mrw','dhl','ups','gls','fedex')),
 status text not null default 'pending' check (status in ('pending','transit','delivery','delivered','exception')),
 eta text, events jsonb not null default '[]', route jsonb not null default '[]',
 updated_at timestamptz, created_at timestamptz not null default now(),
 unique(user_id,carrier,tracking_number)
);
create table public.notification_preferences (
 user_id uuid primary key references auth.users(id) on delete cascade,
 email_enabled boolean not null default false,
 events text[] not null default array['delivery','delivered','exception']::text[]
 check (events <@ array['delivery','delivered','exception','transit']::text[])
);
create table public.push_subscriptions (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 endpoint text not null unique, subscription jsonb not null,
 created_at timestamptz not null default now()
);
create index push_subscriptions_owner on public.push_subscriptions(user_id);
create table public.notification_outbox (
 id uuid primary key default gen_random_uuid(),
 package_id uuid not null references public.packages(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 status text not null, fingerprint text not null,
 email_sent boolean not null default false, push_sent boolean not null default false,
 created_at timestamptz not null default now(), unique(package_id,fingerprint)
);
create index notification_outbox_owner on public.notification_outbox(user_id);
create index notification_outbox_pending on public.notification_outbox(created_at) where not email_sent or not push_sent;
alter table public.packages enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.push_subscriptions enable row level security;
alter table public.notification_outbox enable row level security;
revoke all on public.packages,public.notification_preferences,public.push_subscriptions,public.notification_outbox from anon,authenticated;
grant select,delete on public.packages to authenticated;
grant insert(user_id,alias,tracking_number,carrier) on public.packages to authenticated;
grant update(alias) on public.packages to authenticated;
grant select,insert,update on public.notification_preferences to authenticated;
grant select,delete on public.push_subscriptions to authenticated;
grant all on public.packages,public.notification_preferences,public.push_subscriptions,public.notification_outbox to service_role;
create policy packages_read on public.packages for select to authenticated using ((select auth.uid())=user_id);
create policy packages_add on public.packages for insert to authenticated with check ((select auth.uid())=user_id);
create policy packages_edit on public.packages for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy packages_remove on public.packages for delete to authenticated using ((select auth.uid())=user_id);
create policy preferences_read on public.notification_preferences for select to authenticated using ((select auth.uid())=user_id);
create policy preferences_add on public.notification_preferences for insert to authenticated with check ((select auth.uid())=user_id);
create policy preferences_edit on public.notification_preferences for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy subscriptions_read on public.push_subscriptions for select to authenticated using ((select auth.uid())=user_id);
create policy subscriptions_remove on public.push_subscriptions for delete to authenticated using ((select auth.uid())=user_id);
-- Outbox is server-only: no client privileges and no client policies.
