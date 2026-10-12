import { findPlaces } from "@/lib/place-index"

export function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q") ?? ""
  return Response.json(
    { ok: true, places: findPlaces(query) },
    { headers: { "Cache-Control": "public, max-age=3600" } },
  )
}
