# 🎄 Ghid de Setup - Ugliest Christmas Sweater

## Pasul 1: ✅ Dependențele sunt instalate

```bash
npm install  # ✅ DEJA FĂCUT
```

## Pasul 2: 🔧 Configurează Supabase

### 2.1 Creează proiect Supabase

1. Mergi pe [https://supabase.com](https://supabase.com)
2. Creează un cont (dacă nu ai deja)
3. Click pe **"New Project"**
4. Completează:
   - **Name**: `ugliest-sweater` (sau orice nume vrei)
   - **Database Password**: alege o parolă puternică (salveaz-o!)
   - **Region**: alege cea mai apropiată regiune
5. Click **"Create new project"** și așteaptă ~2 minute

### 2.2 Creează Storage Bucket

1. În Supabase Dashboard, mergi la **Storage** (în sidebar)
2. Click pe **"New bucket"**
3. Completează:
   - **Name**: `ugc` (exact așa, fără spații)
   - **Public bucket**: ✅ **Bifează** (important!)
4. Click **"Create bucket"**

### 2.3 Rulează Schema SQL

1. În Supabase Dashboard, mergi la **SQL Editor** (în sidebar)
2. Click pe **"New query"**
3. Deschide fișierul `supabase/schema.sql` din proiect
4. Copiază tot conținutul și lipește-l în SQL Editor
5. Click **"Run"** sau apasă `Ctrl+Enter` (sau `Cmd+Enter` pe Mac)
6. Ar trebui să vezi mesajul "Success. No rows returned"

### 2.4 Obține cheile API

1. În Supabase Dashboard, mergi la **Settings** → **API**
2. Vei vedea:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** key (o cheie lungă)
   - **service_role** key (o altă cheie lungă) - ⚠️ **SECRETĂ!**

## Pasul 3: 📝 Configurează .env.local

1. Creează fișierul `.env.local` în root-ul proiectului:

```bash
# În terminal, în folderul proiectului:
touch .env.local
```

2. Deschide `.env.local` și adaugă:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Înlocuiește:**
- `https://xxxxx.supabase.co` cu **Project URL** din Supabase
- `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (anon) cu **anon public** key
- `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (service_role) cu **service_role** key

### Verifică configurarea

```bash
npm run check-env
```

Dacă vezi ✅, ești gata!

## Pasul 4: 🚀 Rulează aplicația

```bash
npm run dev
```

Deschide [http://localhost:3000](http://localhost:3000) în browser.

## ✅ Verificare finală

1. ✅ Aplicația se deschide pe localhost:3000
2. ✅ Poți accesa `/upload` și vezi formularul
3. ✅ Poți accesa `/vote` și vezi lista (goală pentru moment)
4. ✅ Poți accesa `/tv` și vezi leaderboard-ul (goal pentru moment)

## 🐛 Probleme comune

### Eroare: "Missing device_id"
- Normal la prima rulare, middleware-ul va crea cookie-ul automat

### Eroare: "Failed to fetch" la API calls
- Verifică că `.env.local` este configurat corect
- Verifică că cheile Supabase sunt corecte
- Rulează `npm run check-env`

### Eroare la upload: "Storage bucket not found"
- Verifică că bucket-ul `ugc` există în Supabase Storage
- Verifică că bucket-ul este **public**

### Eroare SQL: "relation already exists"
- Normal dacă ai rulat deja SQL-ul, poți ignora

## 📚 Resurse utile

- [Documentația Supabase](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

