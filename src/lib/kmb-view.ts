import type { WatchLayer } from "@/lib/types"

export const KMB_MIN_ZOOM = 13
// One layer on its own can appear from the city view and show more pins than the mixed map.
export const SOLO_PIN_ZOOM = 10
// The flyover ends on the roads, the trains, and the boats. Places with no vehicle wait half a level closer.
export const FLYOVER_END_ZOOM = 13.05
export const MIXED_PLACE_ZOOM = 13.55
export const KMB_POLL_MS = 60_000
export const PLACE_POLL_MS = 12 * 60 * 60 * 1000

const PLACE_LAYERS = new Set<WatchLayer>([
  "cameras",
  "kmb",
  "citybus",
  "gmb",
  "nlb",
  "mtrbus",
  "parking",
  "motorcycle",
  "kerb",
  "meter",
  "charger",
])

export function placePinZoom(layer: WatchLayer, sole: WatchLayer | null): number {
  if (sole === layer) return SOLO_PIN_ZOOM
  if (PLACE_LAYERS.has(layer)) return MIXED_PLACE_ZOOM
  return 0
}

export function mapViewKey(lng: number, lat: number, zoom: number): string {
  if (!Number.isFinite(zoom) || zoom < SOLO_PIN_ZOOM) return "far"
  const band = zoom < KMB_MIN_ZOOM ? "overview" : zoom < 16 ? "wide" : zoom < 17 ? "street" : "close"
  return `${lng.toFixed(3)},${lat.toFixed(3)},${band}`
}
