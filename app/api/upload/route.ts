import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getDeviceId } from "@/lib/device";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const deviceId = getDeviceId();
    const form = await req.formData();
    const nickname = String(form.get("nickname") || "").trim();
    const file = form.get("file") as File | null;

    if (!nickname) return NextResponse.json({ error: "Nickname required" }, { status: 400 });
    if (!file) return NextResponse.json({ error: "Photo required" }, { status: 400 });

    const { data: state, error: stateErr } = await supabaseAdmin
      .from("device_state")
      .upsert({ device_id: deviceId }, { onConflict: "device_id" })
      .select()
      .single();

    if (stateErr) throw stateErr;
    if (state.has_uploaded) return NextResponse.json({ error: "Already uploaded" }, { status: 403 });

    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `sweaters/${deviceId}-${Date.now()}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadErr } = await supabaseAdmin.storage
      .from("ugc")
      .upload(path, Buffer.from(arrayBuffer), {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

    if (uploadErr) throw uploadErr;

    const { data: pub } = supabaseAdmin.storage.from("ugc").getPublicUrl(path);
    const photoUrl = pub.publicUrl;

    const { data: participant, error: insErr } = await supabaseAdmin
      .from("participants")
      .insert({ nickname, photo_url: photoUrl, approved: true })
      .select()
      .single();

    if (insErr) throw insErr;

    // Store device_id in votes table for tracking (even if not voted yet)
    // This helps us find the participant later
    await supabaseAdmin
      .from("votes")
      .upsert({ device_id: deviceId, participant_id: participant.id }, { onConflict: "device_id" });

    const { error: updErr } = await supabaseAdmin
      .from("device_state")
      .update({ has_uploaded: true })
      .eq("device_id", deviceId);

    if (updErr) throw updErr;

    return NextResponse.json({ ok: true, participant });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Upload failed" }, { status: 500 });
  }
}

