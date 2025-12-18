import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { Participant } from "@/lib/types";

// Demo data for testing
const DEMO_PARTICIPANTS: Participant[] = [
  {
    id: "demo-1",
    nickname: "Maria 🎄",
    photo_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop",
    votes_count: 42,
    approved: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-2",
    nickname: "Ion 🎅",
    photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    votes_count: 38,
    approved: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-3",
    nickname: "Ana ⛄",
    photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    votes_count: 35,
    approved: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-4",
    nickname: "Alex 🦌",
    photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    votes_count: 28,
    approved: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-5",
    nickname: "Elena 🎁",
    photo_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    votes_count: 25,
    approved: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-6",
    nickname: "Mihai 🎄",
    photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    votes_count: 22,
    approved: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-7",
    nickname: "Ioana 🎅",
    photo_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    votes_count: 18,
    approved: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-8",
    nickname: "Andrei ⛄",
    photo_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    votes_count: 15,
    approved: true,
    created_at: new Date().toISOString(),
  },
];

export async function GET(req: Request) {
  try {
    // Check if Supabase is configured
    const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                        process.env.SUPABASE_SERVICE_ROLE_KEY &&
                        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("YOUR_") &&
                        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your_") &&
                        process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith("http");

    // If not configured, return demo data
    if (!isConfigured) {
      const { searchParams } = new URL(req.url);
      const limit = Math.min(Number(searchParams.get("limit") || 10), 500);
      return NextResponse.json({ items: DEMO_PARTICIPANTS.slice(0, limit) });
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit") || 10), 500);

    const { data, error } = await supabaseAdmin
      .from("participants")
      .select("id,nickname,photo_url,votes_count,approved,created_at")
      .eq("approved", true)
      .order("votes_count", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      // Fallback to demo data on error
      return NextResponse.json({ items: DEMO_PARTICIPANTS.slice(0, limit) });
    }

    // If no real data, return demo data
    if (!data || data.length === 0) {
      return NextResponse.json({ items: DEMO_PARTICIPANTS.slice(0, limit) });
    }

    return NextResponse.json({ items: data || [] });
  } catch (error) {
    // Fallback to demo data on any error
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit") || 10), 500);
    return NextResponse.json({ items: DEMO_PARTICIPANTS.slice(0, limit) });
  }
}

