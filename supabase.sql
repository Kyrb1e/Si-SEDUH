-- Jalankan di Supabase Dashboard → SQL Editor → New query → Run

-- 1) Tabel: satu baris per pengguna, isinya seluruh data seduh.* (JSON teks)
create table if not exists public.user_data (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  json       text not null default '{}',
  updated_at timestamptz not null default now()
);

-- 2) Row Level Security: WAJIB. Tanpa ini siapa pun yang punya anon key bisa membaca semua data.
alter table public.user_data enable row level security;

create policy "baca data sendiri"   on public.user_data for select using (auth.uid() = user_id);
create policy "tambah data sendiri" on public.user_data for insert with check (auth.uid() = user_id);
create policy "ubah data sendiri"   on public.user_data for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "hapus data sendiri"  on public.user_data for delete using (auth.uid() = user_id);

-- 3) Aktifkan Realtime untuk tabel ini (sinkron antar perangkat)
alter publication supabase_realtime add table public.user_data;
