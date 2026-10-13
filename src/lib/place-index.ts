import { controlName } from "./i18n.ts"
import { controlPlaces } from "./control-points.ts"
import { citybusNamedStops } from "./citybus-network.ts"
import { chargerNames } from "./ev-chargers.ts"
import { ferryPiers } from "./ferry-network.ts"
import { gmbNamedStops } from "./gmb-reach.ts"
import { kmbNamedStops } from "./kmb-network.ts"
import { lrtNamedStations } from "./lrt-network.ts"
import { mtrNamedStations } from "./mtr-network.ts"
import { nlbNamedStops } from "./nlb-network.ts"
import { rankPlaces, type PlaceFind, type PlaceNear } from "./place-find.ts"

let cached: PlaceFind[] | null = null

export function findPlaces(query: string, near?: PlaceNear | null): PlaceFind[] {
  return rankPlaces(query, catalogue(), near)
}

function catalogue(): PlaceFind[] {
  if (cached) return cached
  const places: PlaceFind[] = []
  for (const station of mtrNamedStations()) {
    places.push({ layer: "mtr", id: station.id, nameTc: station.tc, nameEn: station.en, coordinates: [station.lng, station.lat] })
  }
  for (const station of lrtNamedStations()) {
    places.push({ layer: "lrt", id: station.id, nameTc: station.tc, nameEn: station.en, coordinates: [station.lng, station.lat] })
  }
  for (const pier of ferryPiers()) {
    places.push({ layer: "ferry", id: pier.id, nameTc: pier.nameTc, nameEn: pier.nameEn, coordinates: [pier.lng, pier.lat] })
  }
  for (const point of controlPlaces()) {
    places.push({
      layer: "control",
      id: point.code,
      nameTc: controlName("zh-HK", point.code, point.name),
      nameEn: point.name,
      coordinates: point.coordinates,
    })
  }
  for (const stop of kmbNamedStops()) places.push(stopPlace("kmb", stop))
  for (const stop of citybusNamedStops()) places.push(stopPlace("citybus", stop))
  for (const stop of gmbNamedStops()) places.push(stopPlace("gmb", stop))
  for (const stop of nlbNamedStops()) places.push(stopPlace("nlb", stop))
  for (const place of chargerNames()) {
    places.push({ layer: "charger", id: place.id, nameTc: place.nameTc, nameEn: place.nameEn, coordinates: [place.lng, place.lat] })
  }
  cached = places
  return places
}

function stopPlace(layer: "kmb" | "citybus" | "gmb" | "nlb", stop: { id: string; tc: string; en: string; lng: number; lat: number }): PlaceFind {
  return { layer, id: stop.id, nameTc: stop.tc, nameEn: stop.en, coordinates: [stop.lng, stop.lat] }
}
