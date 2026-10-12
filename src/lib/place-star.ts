import type { Favourite } from "@/lib/favourites"

export function stampPlaceStar(
  root: HTMLElement,
  place: Favourite,
  starred: boolean,
  copy: { star: string; starred: string; placesFull: string },
  onToggle: (place: Favourite) => readonly Favourite[],
): void {
  const head = root.querySelector(".city-card-head")
  if (!head) return
  const button = document.createElement("button")
  button.type = "button"
  button.className = "city-card-star"
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
  head.append(button)
}

export function paintPlaceStar(button: HTMLButtonElement, starred: boolean, copy: { star: string; starred: string }): void {
  button.ariaPressed = starred ? "true" : "false"
  button.textContent = starred ? copy.starred : copy.star
  button.title = ""
}
