import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getDeviceId } from "@/lib/device";

export async function GET() {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ participant: null });
    }

    const deviceId = getDeviceId();

    // Get device state
    const { data: state } = await supabaseAdmin
      .from("device_state")
      .select("has_uploaded")
      .eq("device_id", deviceId)
      .single();

    if (!state?.has_uploaded) {
      return NextResponse.json({ participant: null });
    }

    // Find participant by checking storage paths or votes
    // First try votes table
    const { data: vote } = await supabaseAdmin
      .from("votes")
      .select("participant_id")
      .eq("device_id", deviceId)
      .limit(1)
      .single();

    if (vote?.participant_id) {
      const { data: participant } = await supabaseAdmin
        .from("participants")
        .select("id,nickname,photo_url,votes_count")
        .eq("id", vote.participant_id)
        .single();

      return NextResponse.json({ participant });
    }

    // Alternative: find by storage path pattern (device_id in photo_url)
    const { data: participants } = await supabaseAdmin
      .from("participants")
      .select("id,nickname,photo_url,votes_count")
      .order("created_at", { ascending: false })
      .limit(100);

    const participant = participants?.find((p) => p.photo_url.includes(deviceId));

    return NextResponse.json({ participant: participant || null });
  } catch (error) {
    return NextResponse.json({ participant: null });
  }
}
