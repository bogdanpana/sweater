import { cookies } from "next/headers";

export function getDeviceId(): string {
  const id = cookies().get("device_id")?.value;
  if (!id) throw new Error("Missing device_id");
  return id;
}

