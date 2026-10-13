import { groundMetres } from "./nearest.ts"

export type PlaceFindLayer = "control" | "mtr" | "lrt" | "kmb" | "citybus" | "gmb" | "nlb" | "ferry" | "charger"

export type PlaceFind = {
  layer: PlaceFindLayer
  id: string
  nameTc: string
  nameEn: string
  coordinates: [number, number]
}

export type PlaceNear = { lng: number; lat: number }

export function placeNear(lng: string | null, lat: string | null): PlaceNear | null {
  if (lng == null || lat == null || lng.trim() === "" || lat.trim() === "") return null
  const parsedLng = Number(lng)
  const parsedLat = Number(lat)
  if (!Number.isFinite(parsedLng) || !Number.isFinite(parsedLat)) return null
  return { lng: parsedLng, lat: parsedLat }
}

const EARLY = new Set<PlaceFindLayer>(["mtr", "lrt", "ferry", "control"])
const LIMIT = 40
const POLE_CODE = /\s*\([A-Za-z]{1,4}\d{2,4}[A-Za-z]?\)\s*$/u

export function placeLabel(name: string): string {
  return name.replace(POLE_CODE, "").replace(/\s+/g, " ").trim()
}

export function rankPlaces(query: string, places: readonly PlaceFind[], near?: PlaceNear | null): PlaceFind[] {
  const needle = query.trim()
  if (needle.length < 2) return []
  const folded = needle.toLowerCase()
  const groups = new Map<string, { place: PlaceFind; band: number; distance: number }>()
  for (const place of places) {
    const labeled = { ...place, nameTc: placeLabel(place.nameTc), nameEn: placeLabel(place.nameEn) }
    const band = matchBand(folded, labeled)
    if (band === null) continue
    const distance = near ? groundMetres(near.lng, near.lat, place.coordinates[0], place.coordinates[1]) : 0
    const key = `${place.layer}\n${labeled.nameTc}`
    const current = groups.get(key)
    if (!current || distance < current.distance) groups.set(key, { place: labeled, band, distance })
  }
  const ranked = [...groups.values()]
  ranked.sort((left, right) =>
    left.band - right.band
    || left.place.nameTc.length - right.place.nameTc.length
    || (EARLY.has(left.place.layer) ? 0 : 1) - (EARLY.has(right.place.layer) ? 0 : 1)
    || left.place.nameTc.localeCompare(right.place.nameTc, "zh-HK")
    || left.place.layer.localeCompare(right.place.layer)
  )
  return ranked.slice(0, LIMIT).map((row) => row.place)
}

function matchBand(folded: string, place: PlaceFind): number | null {
  const names = [place.nameTc, place.nameEn.toLowerCase()].filter((name) => name.length > 0)
  if (names.length === 0) return null
  if (names.some((name) => name === folded || name.toLowerCase() === folded)) return 0
  if (names.some((name) => name.toLowerCase().startsWith(folded))) return 1
  if (names.some((name) => name.toLowerCase().includes(folded))) return 2
  return null
}
