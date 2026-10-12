import assert from "node:assert/strict"
import { stampPlaceStar } from "./place-star.ts"

type DomNode = {
  className: string
  textContent: string
  children: DomNode[]
  tag: string
  type: string
  ariaPressed: string
  title: string
  append: (...items: DomNode[]) => void
  addEventListener: (type: string, listener: (event: { preventDefault: () => void; stopPropagation: () => void }) => void) => void
  click: () => void
  querySelector: (selector: string) => DomNode | null
}

class HTMLButtonElementStub {}

function createElement(tag?: string): DomNode {
  const listeners: Array<(event: { preventDefault: () => void; stopPropagation: () => void }) => void> = []
  const node = Object.create(tag === "button" ? HTMLButtonElementStub.prototype : Object.prototype) as DomNode
  node.tag = tag ?? "div"
  node.type = tag === "button" ? "button" : ""
  node.className = tag === "header" ? "city-card-head" : ""
  node.textContent = ""
  node.children = []
  node.ariaPressed = "false"
  node.title = ""
  node.append = (...items) => {
    node.children.push(...items)
  }
  node.addEventListener = (type, listener) => {
    if (type === "click") listeners.push(listener)
  }
  node.click = () => {
    const event = { preventDefault() {}, stopPropagation() {} }
    for (const listener of listeners) listener(event)
  }
  node.querySelector = (selector) => {
    if (selector === "button.city-card-head-star" || selector === "button.city-card-star" || selector === "button") {
      const found = find(node, (child) => child.tag === "button" && (child.className.includes("city-card-head-star") || child.className.includes("city-card-star")))
      if (found) return found
      if (selector === "button") return find(node, (child) => child.tag === "button")
    }
    if (selector === ".city-card-head") {
      const head = find(node, (child) => child.className === "city-card-head")
      if (head) return head
    }
    return null
  }
  return node
}

function find(root: DomNode, match: (node: DomNode) => boolean): DomNode | null {
  if (match(root)) return root
  for (const child of root.children) {
    const hit = find(child, match)
    if (hit) return hit
  }
  return null
}

const documentStub = { createElement }
Object.assign(globalThis, { document: documentStub, HTMLButtonElement: HTMLButtonElementStub })

const root = document.createElement("article")
root.append(document.createElement("header"))
const place = {
  layer: "kmb" as const,
  id: "JORDAN",
  nameTc: "佐敦",
  nameEn: "Jordan",
  coordinates: [114.17, 22.3] as [number, number],
}
let nextStarred = false
stampPlaceStar(root, place, false, { star: "Star", starred: "Starred", placesFull: "The place list is full." }, () => {
  nextStarred = !nextStarred
  return nextStarred ? [place] : []
})
const button = root.querySelector("button.city-card-head-star")
assert.ok(button instanceof HTMLButtonElement)
assert.equal(button.ariaPressed, "false")
assert.equal(button.textContent, "Star")
button.click()
assert.equal(button.ariaPressed, "true")
assert.equal(button.textContent, "Starred")
button.click()
assert.equal(button.ariaPressed, "false")

const fullRoot = document.createElement("article")
fullRoot.append(document.createElement("header"))
stampPlaceStar(fullRoot, place, false, { star: "Star", starred: "Starred", placesFull: "The place list is full." }, () => [])
const fullButton = fullRoot.querySelector("button")
assert.ok(fullButton instanceof HTMLButtonElement)
fullButton.click()
assert.equal(fullButton.ariaPressed, "false")
assert.equal(fullButton.title, "The place list is full.")

console.log("place star ok")
