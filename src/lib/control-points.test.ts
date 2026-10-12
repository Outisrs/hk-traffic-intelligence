import assert from "node:assert/strict"
import { controlPointFeatures, isQueueFile } from "./control-points.ts"
import { controlName } from "./i18n.ts"

const codes = ["HGP", "HYW", "HZM", "LSC", "LWS", "MKT", "SBC", "STK"]
const live = Object.fromEntries(codes.map((code) => [code, { arrQueue: 0, depQueue: 0 }]))
assert.equal(isQueueFile(live), true)
const withOldLokMaChau = { ...live, LMC: { arrQueue: 0, depQueue: 0 } }
delete (withOldLokMaChau as { HGP?: unknown }).HGP
assert.equal(isQueueFile(withOldLokMaChau), false)

const features = controlPointFeatures(live, live)
const names = features.map((feature) => feature.properties?.code)
assert.equal(names.includes("HGP"), true)
assert.equal(names.includes("LMC"), false)
assert.equal(names.includes("LSC"), true)
assert.equal(controlName("zh-HK", "HGP", "Huanggang"), "皇崗")
assert.equal(controlName("zh-HK", "LSC", "Lok Ma Chau Spur Line"), "落馬洲支線")
assert.equal(controlName("en", "HGP", "Huanggang"), "Huanggang")

console.log("control points ok")
