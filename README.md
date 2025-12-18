# Ugliest Christmas Sweater - MVP

Aplicație Next.js pentru un concurs de votare "Ugliest Christmas Sweater" 🎄

## Caracteristici

- ✅ Un upload per device (tracking via httpOnly cookie)
- ✅ Un vot per device (server-enforced)
- ✅ Leaderboard live cu polling la 2 secunde
- ✅ Upload direct din camera telefonului
- ✅ Interfață în română

## Setup

### 1. Instalează dependențele

```bash
npm install
```

### 2. Configurează Supabase

1. Creează un proiect nou pe [Supabase](https://supabase.com)
2. Creează un Storage bucket numit `ugc` (public)
3. Rulează SQL-ul din `supabase/schema.sql` în SQL Editor

### 3. Configurează variabilele de mediu

Editează `.env.local` și adaugă:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Găsești cheile în:** Supabase Dashboard → Settings → API

### 4. Rulează aplicația

```bash
npm run dev
```

Aplicația va rula pe [http://localhost:3000](http://localhost:3000)

## Structura proiectului

```
├── app/
│   ├── api/
│   │   ├── status/route.ts       # Verifică status upload/vote
│   │   ├── leaderboard/route.ts # Returnează participanții
│   │   ├── upload/route.ts      # Procesează upload-ul
│   │   └── vote/route.ts         # Procesează votul
│   ├── upload/page.tsx          # Pagina de upload
│   ├── vote/page.tsx            # Pagina de votare
│   ├── tv/page.tsx              # Leaderboard TV
│   ├── page.tsx                 # Home page
│   ├── layout.tsx                # Root layout
│   └── globals.css              # Stiluri globale
├── lib/
│   ├── supabaseAdmin.ts         # Client Supabase (Service Role)
│   ├── device.ts                # Helper pentru device_id
│   └── types.ts                 # TypeScript types
├── middleware.ts                # Gestionează device_id cookie
└── supabase/
    └── schema.sql               # Schema bazei de date
```

## Cum funcționează

1. **Device tracking**: Middleware-ul setează un cookie `device_id` httpOnly la prima vizită
2. **Upload**: Utilizatorul poate încărca o singură poză cu un nickname
3. **Vote**: Utilizatorul poate vota o singură dată
4. **Leaderboard**: Se actualizează automat la fiecare 2 secunde pe `/tv`

## Notițe

- Toate verificările de duplicate sunt făcute server-side
- Service Role key este folosit doar în API routes (nu pe client)
- Pozele sunt stocate în Supabase Storage bucket `ugc`
- Trigger-ul SQL actualizează automat `votes_count` la vot nou

## Deployment

Pentru production, actualizează `NEXT_PUBLIC_BASE_URL` în `.env.local` cu URL-ul tău de production.

