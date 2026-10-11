import assert from "node:assert/strict"
import { CHANGELOG, changelogIsFresh, changelogText } from "./changelog.ts"

const hidden = ["token", "cache", "429", "html", "worker", "isolate", "oauth"]
assert.ok(CHANGELOG.length > 0)
for (const entry of CHANGELOG) {
  assert.match(entry.date, /^\d{4}-\d{2}-\d{2}$/)
  assert.ok(entry.en.length > 12)
  assert.ok(entry.tc.length > 8)
  assert.ok(entry.sc.length > 8)
  assert.equal(changelogText(entry, "en"), entry.en)
  assert.equal(changelogText(entry, "zh-HK"), entry.tc)
  assert.equal(changelogText(entry, "zh-CN"), entry.sc)
  const blob = `${entry.en} ${entry.tc} ${entry.sc}`.toLowerCase()
  for (const word of hidden) assert.equal(blob.includes(word), false, `${entry.id} ${word}`)
}

const today = [{ date: "2026-10-11" }]
assert.equal(changelogIsFresh(today, new Date("2026-10-11T04:00:00Z")), true)
assert.equal(changelogIsFresh(today, new Date("2026-10-11T16:00:00Z")), false)
assert.equal(changelogIsFresh(today, new Date("2026-10-10T16:00:00Z")), true)
assert.equal(changelogIsFresh([], new Date("2026-10-11T04:00:00Z")), false)

console.log("changelog ok")
