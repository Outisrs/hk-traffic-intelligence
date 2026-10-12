import assert from "node:assert/strict"
import {
  loadPlaces,
  PLACES_KEY,
  placesSnapshot,
  replacePlaces,
  subscribePlaces,
  applyExternalPlaces,
  type Favourite,
} from "./favourites.ts"

const jordan: Favourite = {
  layer: "kmb",
  id: "JORDAN",
  nameTc: "佐敦",
  nameEn: "Jordan",
  coordinates: [114.171757, 22.304932],
}

const huanggang: Favourite = {
  layer: "control",
  id: "HGP",
  nameTc: "皇崗",
  nameEn: "Huanggang",
  coordinates: [114.06773, 22.52319],
}

function blockedStorage(): Storage {
  const deny = () => {
    throw new DOMException("The operation is insecure.", "SecurityError")
  }
  return { getItem: deny, setItem: deny, removeItem: deny, clear: deny, key: deny, length: 0 }
}

let listenerRuns = 0
const stop = subscribePlaces(() => {
  listenerRuns += 1
})

Object.assign(globalThis, { window: { localStorage: blockedStorage() } })

replacePlaces([jordan])
assert.deepEqual(placesSnapshot(), [jordan])
assert.equal(listenerRuns, 1)

assert.doesNotThrow(() => {
  assert.deepEqual(placesSnapshot(), [jordan])
})

stop()

const saved = new Map<string, string>()
const workingStorage: Storage = {
  get length() {
    return saved.size
  },
  clear() {
    saved.clear()
  },
  getItem(key: string) {
    return saved.get(key) ?? null
  },
  key(index: number) {
    return [...saved.keys()][index] ?? null
  },
  removeItem(key: string) {
    saved.delete(key)
  },
  setItem(key: string, value: string) {
    saved.set(key, value)
  },
}

Object.assign(globalThis, { window: { localStorage: workingStorage } })
replacePlaces([huanggang])
const raw = saved.get(PLACES_KEY)
assert.ok(raw)
assert.deepEqual(
  loadPlaces({
    getItem: (key) => (key === PLACES_KEY ? raw! : null),
    setItem: () => {},
  }),
  [huanggang],
)

let externalRuns = 0
const stopExternal = subscribePlaces(() => {
  externalRuns += 1
})
applyExternalPlaces(JSON.stringify([jordan]))
assert.equal(externalRuns, 1)
assert.deepEqual(placesSnapshot(), [jordan])
stopExternal()

console.log("favourites store ok")
