import { placeNear } from "@/lib/place-find"
import { findPlaces } from "@/lib/place-index"

export function GET(request: Request) {
  const url = new URL(request.url)
  const query = url.searchParams.get("q") ?? ""
  const near = placeNear(url.searchParams.get("lng"), url.searchParams.get("lat"))
  return Response.json(
    { ok: true, places: findPlaces(query, near) },
    { headers: { "Cache-Control": "public, max-age=3600" } },
  )
}
