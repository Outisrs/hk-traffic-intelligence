import { findPlaces } from "@/lib/place-index"

export function GET(request: Request) {
  const url = new URL(request.url)
  const query = url.searchParams.get("q") ?? ""
  const lng = Number(url.searchParams.get("lng"))
  const lat = Number(url.searchParams.get("lat"))
  const near = Number.isFinite(lng) && Number.isFinite(lat) ? { lng, lat } : null
  return Response.json(
    { ok: true, places: findPlaces(query, near) },
    { headers: { "Cache-Control": "public, max-age=3600" } },
  )
}
