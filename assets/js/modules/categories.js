import { getCategories, redirect, setState } from "../utils.js";

export async function render() {
  const categories = await getCategories();

  for (const key in categories) {
    if (Object.hasOwnProperty.call(categories, key)) {
      const card = $(`
      <div class="card text-card">
        <p>${key}</p>
      </div>
    `).on("click", function () {
        setState("category", key);
        redirect("./game.html");
      });

      $("#categories-cards").append(card);
    }
  }
}

render();
