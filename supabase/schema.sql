create table if not exists participants (
  id uuid primary key default gen_random_uuid(),
  nickname text not null,
  photo_url text not null,
  approved boolean not null default true,
  votes_count int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_participants_votes on participants (votes_count desc);
create index if not exists idx_participants_created on participants (created_at desc);

create table if not exists device_state (
  device_id text primary key,
  has_uploaded boolean not null default false,
  has_voted boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists votes (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  participant_id uuid not null references participants(id) on delete cascade,
  created_at timestamptz not null default now()
);

create unique index if not exists ux_votes_device on votes (device_id);
create index if not exists idx_votes_participant on votes (participant_id);

create or replace function inc_vote_count()
returns trigger as $$
begin
  update participants
  set votes_count = votes_count + 1
  where id = new.participant_id;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_inc_vote_count on votes;
create trigger trg_inc_vote_count
after insert on votes
for each row execute function inc_vote_count();

