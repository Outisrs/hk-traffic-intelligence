export type PlaceFindLayer = "control" | "mtr" | "lrt" | "kmb" | "citybus" | "gmb" | "nlb" | "ferry" | "charger"

export type PlaceFind = {
  layer: PlaceFindLayer
  id: string
  nameTc: string
  nameEn: string
  coordinates: [number, number]
}

const EARLY = new Set<PlaceFindLayer>(["mtr", "lrt", "ferry", "control"])
const LIMIT = 8

export function rankPlaces(query: string, places: readonly PlaceFind[]): PlaceFind[] {
  const needle = query.trim()
  if (needle.length < 2) return []
  const folded = needle.toLowerCase()
  const ranked = places.flatMap((place) => {
    const band = matchBand(folded, place)
    if (band === null) return []
    return [{ place, band, early: EARLY.has(place.layer) ? 0 : 1 }]
  })
  ranked.sort((left, right) => left.band - right.band || left.early - right.early || left.place.nameTc.localeCompare(right.place.nameTc, "zh-HK"))
  return ranked.slice(0, LIMIT).map((row) => row.place)
}

function matchBand(folded: string, place: PlaceFind): number | null {
  const names = [place.nameTc, place.nameEn.toLowerCase()]
  if (names.some((name) => name === folded || name.toLowerCase() === folded)) return 0
  if (names.some((name) => name.toLowerCase().startsWith(folded))) return 1
  if (names.some((name) => name.toLowerCase().includes(folded))) return 2
  return null
}
