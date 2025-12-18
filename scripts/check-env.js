#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envExample = `NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_BASE_URL=http://localhost:3000`;

console.log('🔍 Verificare configurare...\n');

if (!fs.existsSync(envPath)) {
  console.log('❌ Fișierul .env.local nu există!\n');
  console.log('📝 Creează fișierul .env.local în root-ul proiectului cu următorul conținut:\n');
  console.log(envExample);
  console.log('\n💡 Găsești cheile Supabase în: Dashboard → Settings → API\n');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_BASE_URL'
];

const missing = [];
const needsUpdate = [];

requiredVars.forEach(varName => {
  if (!envContent.includes(varName)) {
    missing.push(varName);
  } else if (envContent.includes(`${varName}=YOUR_`) || envContent.includes(`${varName}=your_`)) {
    needsUpdate.push(varName);
  }
});

if (missing.length > 0) {
  console.log('❌ Variabile lipsă în .env.local:');
  missing.forEach(v => console.log(`   - ${v}`));
  console.log('');
}

if (needsUpdate.length > 0) {
  console.log('⚠️  Variabile care trebuie actualizate:');
  needsUpdate.forEach(v => console.log(`   - ${v}`));
  console.log('');
}

if (missing.length === 0 && needsUpdate.length === 0) {
  console.log('✅ Configurarea .env.local pare corectă!\n');
  console.log('📋 Următorii pași:');
  console.log('   1. Asigură-te că ai creat proiectul Supabase');
  console.log('   2. Creează Storage bucket "ugc" (public)');
  console.log('   3. Rulează SQL-ul din supabase/schema.sql');
  console.log('   4. Rulează: npm run dev\n');
  process.exit(0);
} else {
  process.exit(1);
}

