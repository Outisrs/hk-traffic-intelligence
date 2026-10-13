import assert from "node:assert/strict"
import { rankPlaces, type PlaceFind } from "./place-find.ts"

const station: PlaceFind = { layer: "mtr", id: "MOK", nameTc: "旺角", nameEn: "Mong Kok", coordinates: [114.17, 22.32] }
const street: PlaceFind = { layer: "kmb", id: "MK515", nameTc: "旺角奶路臣街", nameEn: "Nelson Street Mong Kok", coordinates: [114.17, 22.32] }
const market: PlaceFind = { layer: "kmb", id: "CEN", nameTc: "中環街市", nameEn: "Central Market", coordinates: [114.15, 22.28] }
const pole: PlaceFind = { layer: "kmb", id: "A", nameTc: "皇后像廣場", nameEn: "Statue Square", coordinates: [114.16, 22.28] }
const poleAgain: PlaceFind = { layer: "kmb", id: "B", nameTc: "皇后像廣場", nameEn: "Statue Square", coordinates: [114.16, 22.281] }

const found = rankPlaces("旺角", [street, market, station])
assert.deepEqual(found.map((place) => place.id), ["MOK", "MK515"])
assert.equal(rankPlaces("旺", [station]).length, 0)
assert.equal(rankPlaces("  ", [station]).length, 0)
assert.equal(rankPlaces("mong", [station, street])[0]?.id, "MOK")
assert.equal(rankPlaces("皇后像廣場", [pole, poleAgain, station]).length, 1)
assert.equal(rankPlaces("xxxx", [station, street, market]).length, 0)

const coded = { layer: "kmb" as const, id: "MK515", nameTc: "旺角奶路臣街 (MK515)", nameEn: "Nelson (MK515)", coordinates: [114.17, 22.32] as [number, number] }
const codedAgain = { layer: "kmb" as const, id: "MK174", nameTc: "旺角奶路臣街 (MK174)", nameEn: "Nelson (MK174)", coordinates: [114.2, 22.32] as [number, number] }
const stop = { layer: "kmb" as const, id: "MK621", nameTc: "旺角站", nameEn: "Mong Kok Station", coordinates: [114.17, 22.319] as [number, number] }
const named = rankPlaces("旺角", [coded, codedAgain, stop])
assert.deepEqual(named.map((place) => place.nameTc), ["旺角站", "旺角奶路臣街"])
assert.equal(rankPlaces("旺角", [coded, codedAgain], { lng: 114.2, lat: 22.32 })[0]?.id, "MK174")

const many = Array.from({ length: 12 }, (_, index): PlaceFind => ({
  layer: "kmb",
  id: String(index),
  nameTc: `旺角${index}`,
  nameEn: `Mong Kok ${index}`,
  coordinates: [114.17, 22.32],
}))
assert.equal(rankPlaces("旺角", many).length, 12)

console.log("place find ok")
