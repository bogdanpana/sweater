#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');

if (fs.existsSync(envPath)) {
  console.log('⚠️  Fișierul .env.local există deja!');
  console.log('   Dacă vrei să-l regenerezi, șterge-l mai întâi.\n');
  process.exit(1);
}

const template = `NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_BASE_URL=http://localhost:3000
`;

fs.writeFileSync(envPath, template);
console.log('✅ Fișierul .env.local a fost creat!\n');
console.log('📝 Următorii pași:');
console.log('   1. Deschide .env.local în editor');
console.log('   2. Înlocuiește valorile cu cheile tale Supabase');
console.log('   3. Găsești cheile în: Supabase Dashboard → Settings → API');
console.log('   4. Rulează: npm run check-env pentru verificare\n');

