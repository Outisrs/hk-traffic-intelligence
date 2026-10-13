import { loadSpeedCameras } from "@/lib/speed-cam"

export const dynamic = "force-dynamic"

export async function GET() {
  const cameras = await loadSpeedCameras()
  if (!cameras) {
    return Response.json({ ok: false, error: "Speed cams did not load.", cameras: { type: "FeatureCollection", features: [] } }, { status: 502 })
  }
  return Response.json({ ok: true, cameras })
}
