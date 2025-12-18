import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getDeviceId } from "@/lib/device";

export async function POST(req: Request) {
  try {
    const deviceId = getDeviceId();
    const body = await req.json();
    const participantId = String(body.participantId || "");

    if (!participantId) return NextResponse.json({ error: "participantId required" }, { status: 400 });

    // Check if Supabase is configured
    const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                        process.env.SUPABASE_SERVICE_ROLE_KEY &&
                        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("YOUR_") &&
                        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your_") &&
                        process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith("http");

    // Demo mode: allow voting on demo participants
    if (!isConfigured || participantId.startsWith("demo-")) {
      // In demo mode, we simulate voting
      // Store vote in localStorage on client side (handled by the page)
      return NextResponse.json({ ok: true, demo: true });
    }

    const { data: state, error: stateErr } = await supabaseAdmin
      .from("device_state")
      .upsert({ device_id: deviceId }, { onConflict: "device_id" })
      .select()
      .single();

    if (stateErr) throw stateErr;
    if (state.has_voted) return NextResponse.json({ error: "Already voted" }, { status: 403 });

    const { error: voteErr } = await supabaseAdmin
      .from("votes")
      .insert({ device_id: deviceId, participant_id: participantId });

    if (voteErr) return NextResponse.json({ error: "Vote blocked" }, { status: 403 });

    const { error: updErr } = await supabaseAdmin
      .from("device_state")
      .update({ has_voted: true })
      .eq("device_id", deviceId);

    if (updErr) throw updErr;

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    // In case of error, allow demo voting
    const body = await req.json().catch(() => ({}));
    const participantId = String(body.participantId || "");
    if (participantId.startsWith("demo-")) {
      return NextResponse.json({ ok: true, demo: true });
    }
    return NextResponse.json({ error: e?.message || "Vote failed" }, { status: 500 });
  }
}

