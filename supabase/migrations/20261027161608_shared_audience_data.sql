-- Stores audience data by creator while accounts share a seeded demo source by default.

create table public.audience_creators (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  dataset_version text not null,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

insert into public.audience_creators (id, display_name, dataset_version, is_demo)
values ('00000000-0000-4000-8000-000000000001', 'Sample creator', 'sample-2026-10-v3', true);

create table public.audience_posts (
  creator_id uuid not null references public.audience_creators(id),
  id text not null,
  title text not null,
  caption text not null,
  published_at timestamptz not null,
  thumbnail text not null,
  format text not null check (format in ('Photo', 'Video', 'Live')),
  primary key (creator_id, id)
);

create table public.audience_fans (
  creator_id uuid not null references public.audience_creators(id),
  id text not null,
  username text not null,
  display_name text not null,
  primary key (creator_id, id)
);

create table public.audience_comments (
  creator_id uuid not null references public.audience_creators(id),
  id text not null,
  post_id text not null,
  fan_id text not null,
  text text not null check (length(text) > 0),
  created_at timestamptz not null,
  primary key (creator_id, id),
  foreign key (creator_id, post_id) references public.audience_posts(creator_id, id),
  foreign key (creator_id, fan_id) references public.audience_fans(creator_id, id)
);

create index on public.audience_comments (creator_id, post_id);
create index on public.audience_comments (creator_id, fan_id);

create table public.audience_preview_results (
  creator_id uuid primary key references public.audience_creators(id),
  insights jsonb not null check (jsonb_typeof(insights) = 'array'),
  analysed_at timestamptz not null,
  model text not null,
  prompt_version text not null
);

-- Keep source ownership separate from Fanvue identity and private analysis ownership.
alter table public.app_users add column audience_creator_id uuid not null
  default '00000000-0000-4000-8000-000000000001' references public.audience_creators(id);
alter table public.analysis_jobs add column audience_creator_id uuid not null
  default '00000000-0000-4000-8000-000000000001' references public.audience_creators(id);

create index on public.app_users (audience_creator_id);
create index on public.analysis_jobs (audience_creator_id);

alter table public.audience_creators enable row level security;
alter table public.audience_posts enable row level security;
alter table public.audience_fans enable row level security;
alter table public.audience_comments enable row level security;
alter table public.audience_preview_results enable row level security;

revoke all on public.audience_creators, public.audience_posts, public.audience_fans,
  public.audience_comments, public.audience_preview_results from public, anon, authenticated;
grant all on public.audience_creators, public.audience_posts, public.audience_fans,
  public.audience_comments, public.audience_preview_results to service_role;

-- Return one consistent snapshot without the REST API's row pagination limit.
create function public.get_audience_dataset(creator_identifier uuid)
returns jsonb
language sql stable security invoker
set search_path = ''
as $$
  select jsonb_build_object(
    'version', creator.dataset_version,
    'posts', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', post.id, 'title', post.title, 'caption', post.caption,
        'publishedAt', to_char(post.published_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
        'thumbnail', post.thumbnail, 'format', post.format
      ) order by post.id)
      from public.audience_posts post where post.creator_id = creator.id
    ), '[]'::jsonb),
    'fans', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', fan.id, 'username', fan.username, 'displayName', fan.display_name
      ) order by fan.id)
      from public.audience_fans fan where fan.creator_id = creator.id
    ), '[]'::jsonb),
    'comments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', comment.id, 'postId', comment.post_id, 'fanId', comment.fan_id, 'text', comment.text,
        'createdAt', to_char(comment.created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
      ) order by comment.id)
      from public.audience_comments comment where comment.creator_id = creator.id
    ), '[]'::jsonb)
  )
  from public.audience_creators creator where creator.id = creator_identifier;
$$;

revoke all on function public.get_audience_dataset(uuid) from public, anon, authenticated;
grant execute on function public.get_audience_dataset(uuid) to service_role;
