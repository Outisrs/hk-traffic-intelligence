import type { Favourite } from "@/lib/favourites"

export const STAR_PATH = "M12 1.8 14.9 8l6.8.6-5.2 4.4 1.6 6.6L12 16.2 5.9 19.6 7.5 13 2.3 8.6 9.1 8 12 1.8z"

export function stampPlaceStar(
  root: HTMLElement,
  place: Favourite,
  starred: boolean,
  copy: { star: string; starred: string; placesFull: string },
  onToggle: (place: Favourite) => readonly Favourite[],
): void {
  const title = root.querySelector(".city-card-title")
  const head = title?.parentElement
  if (!title || !head) return
  const button = document.createElement("button")
  button.type = "button"
  button.className = "city-card-head-star"
  paintPlaceStar(button, starred, copy)
  button.addEventListener("click", (event) => {
    event.preventDefault()
    event.stopPropagation()
    const was = button.ariaPressed === "true"
    const places = onToggle(place)
    const now = places.some((item) => item.layer === place.layer && item.id === place.id)
    paintPlaceStar(button, now, copy)
    if (!was && !now) button.title = copy.placesFull
  })
  title.insertAdjacentElement("afterend", button)
}

export function paintPlaceStar(button: HTMLButtonElement, starred: boolean, copy: { star: string; starred: string }): void {
  button.ariaPressed = starred ? "true" : "false"
  button.ariaLabel = starred ? copy.starred : copy.star
  button.title = ""
  button.textContent = ""
  button.replaceChildren(starGlyph(starred))
}

function starGlyph(starred: boolean): SVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svg.setAttribute("viewBox", "0 0 24 24")
  svg.setAttribute("aria-hidden", "true")
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
  path.setAttribute("d", STAR_PATH)
  path.setAttribute("fill", starred ? "currentColor" : "none")
  path.setAttribute("stroke", "currentColor")
  path.setAttribute("stroke-width", starred ? "0" : "1.6")
  path.setAttribute("stroke-linejoin", "round")
  svg.append(path)
  return svg
}
