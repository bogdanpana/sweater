import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Check if env vars are properly configured (not placeholder values)
const isConfigured = supabaseUrl && 
                    supabaseKey && 
                    !supabaseUrl.includes("YOUR_") && 
                    !supabaseUrl.includes("your_") &&
                    !supabaseKey.includes("YOUR_") &&
                    !supabaseKey.includes("your_") &&
                    supabaseUrl.startsWith("http");

// Create client only if properly configured
export const supabaseAdmin = isConfigured
  ? createClient(supabaseUrl!, supabaseKey!, { auth: { persistSession: false } })
  : createClient("https://placeholder.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY0NTk5OTk5OSwiZXhwIjoxOTYxNTc1OTk5fQ.placeholder", { auth: { persistSession: false } });

