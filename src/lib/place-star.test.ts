import assert from "node:assert/strict"
import { stampPlaceStar } from "./place-star.ts"

type DomNode = {
  className: string
  textContent: string
  children: DomNode[]
  tag: string
  type: string
  ariaPressed: string
  ariaLabel: string
  title: string
  parentElement: DomNode | null
  append: (...items: DomNode[]) => void
  insertBefore: (child: DomNode, before: DomNode) => void
  replaceChildren: (...items: DomNode[]) => void
  setAttribute: (name: string, value: string) => void
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
  node.ariaLabel = ""
  node.title = ""
  node.parentElement = null
  node.append = (...items) => {
    for (const item of items) {
      if (item.parentElement) item.parentElement.children = item.parentElement.children.filter((child) => child !== item)
      item.parentElement = node
      node.children.push(item)
    }
  }
  node.insertBefore = (child, before) => {
    if (child.parentElement) child.parentElement.children = child.parentElement.children.filter((item) => item !== child)
    const index = node.children.indexOf(before)
    child.parentElement = node
    if (index < 0) node.children.push(child)
    else node.children.splice(index, 0, child)
  }
  node.replaceChildren = (...items) => {
    node.children = [...items]
  }
  node.setAttribute = (name, value) => {
    if (name === "aria-label") node.ariaLabel = value
    if (name === "aria-hidden") return
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
    if (selector === "svg") return find(node, (child) => child.tag === "svg")
    if (selector === ".city-card-head") return find(node, (child) => child.className === "city-card-head")
    if (selector === ".city-card-title") return find(node, (child) => child.className === "city-card-title")
    if (selector === ".city-card-name") return find(node, (child) => child.className === "city-card-name")
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

const documentStub = {
  createElement,
  createElementNS: (_namespace: string, tag: string) => createElement(tag),
}
Object.assign(globalThis, { document: documentStub, HTMLButtonElement: HTMLButtonElementStub })

function card(): DomNode {
  const root = document.createElement("article")
  const head = document.createElement("header")
  const title = document.createElement("h2")
  title.className = "city-card-title"
  head.append(title)
  root.append(head)
  return root
}

const root = card()
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
assert.equal(button.ariaLabel, "Star")
assert.equal(button.textContent, "")
assert.ok(button.querySelector("svg"))
const head = button.parentElement
assert.equal(head?.className, "city-card-head")
assert.equal(head?.children[0]?.className, "city-card-title")
assert.equal(head?.children[1], button)

const lined = card()
const linedHead = lined.querySelector(".city-card-head")
const detail = document.createElement("p")
detail.className = "city-card-detail"
linedHead?.append(detail)
stampPlaceStar(lined, place, false, { star: "Star", starred: "Starred", placesFull: "The place list is full." }, () => [])
const linedKids = linedHead?.children ?? []
assert.equal(linedKids[0]?.className, "city-card-title")
assert.equal(linedKids[1]?.className, "city-card-head-star")
assert.equal(linedKids[2], detail)
button.click()
assert.equal(button.ariaPressed, "true")
assert.equal(button.ariaLabel, "Starred")
assert.equal(button.textContent, "")
button.click()
assert.equal(button.ariaPressed, "false")

const fullRoot = card()
stampPlaceStar(fullRoot, place, false, { star: "Star", starred: "Starred", placesFull: "The place list is full." }, () => [])
const fullButton = fullRoot.querySelector("button")
assert.ok(fullButton instanceof HTMLButtonElement)
fullButton.click()
assert.equal(fullButton.ariaPressed, "false")
assert.equal(fullButton.title, "The place list is full.")

console.log("place star ok")
