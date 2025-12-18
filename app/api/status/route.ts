import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getDeviceId } from "@/lib/device";

export async function GET() {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ has_uploaded: false, has_voted: false });
    }

    const deviceId = getDeviceId();

    const { data, error } = await supabaseAdmin
      .from("device_state")
      .upsert({ device_id: deviceId }, { onConflict: "device_id" })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      has_uploaded: data.has_uploaded,
      has_voted: data.has_voted,
    });
  } catch (error) {
    // Return default values if anything fails
    return NextResponse.json({ has_uploaded: false, has_voted: false });
  }
}

