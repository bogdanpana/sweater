import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getDeviceId } from "@/lib/device";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const deviceId = getDeviceId();
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) return NextResponse.json({ error: "Photo required" }, { status: 400 });

    // Check if user has uploaded
    const { data: state, error: stateErr } = await supabaseAdmin
      .from("device_state")
      .select("has_uploaded")
      .eq("device_id", deviceId)
      .single();

    if (stateErr || !state?.has_uploaded) {
      return NextResponse.json({ error: "No upload found" }, { status: 403 });
    }

    // Find participant by device_id (check votes table)
    const { data: vote } = await supabaseAdmin
      .from("votes")
      .select("participant_id")
      .eq("device_id", deviceId)
      .limit(1)
      .single();

    if (!vote?.participant_id) {
      // Try to find by storage path pattern
      const { data: participants } = await supabaseAdmin
        .from("participants")
        .select("id,photo_url")
        .order("created_at", { ascending: false })
        .limit(100);

      // Find participant whose photo_url contains device_id
      const participant = participants?.find((p) => p.photo_url.includes(deviceId));
      
      if (!participant) {
        return NextResponse.json({ error: "Participant not found" }, { status: 404 });
      }

      // Update photo
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

      const { error: updErr } = await supabaseAdmin
        .from("participants")
        .update({ photo_url: photoUrl })
        .eq("id", participant.id);

      if (updErr) throw updErr;

      return NextResponse.json({ ok: true, photo_url: photoUrl });
    }

    // Update existing participant photo
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

    const { error: updErr } = await supabaseAdmin
      .from("participants")
      .update({ photo_url: photoUrl })
      .eq("id", vote.participant_id);

    if (updErr) throw updErr;

    return NextResponse.json({ ok: true, photo_url: photoUrl });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Update failed" }, { status: 500 });
  }
}

