import { getFromState, redirect, setState } from "../utils.js"
import { CATEGORIES } from "./constants.js";

export function render() {

  const user = getFromState("user")

  const container = document.querySelector("#categories-cards");
  for (const key in CATEGORIES) {
    if (Object.hasOwnProperty.call(CATEGORIES, key)) {
      const card = document.createElement("div")
      card.className = "card text-card"

      card.addEventListener("click", () => {
        setState("category", key )
        redirect("./game.html")
      })
      
      const content = document.createElement("p")
      content.innerText = key
      card.appendChild(content)
      container.appendChild(card)      
    }
  }
}

render()
