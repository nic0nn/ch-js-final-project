import { redirect, setState } from "./utils.js"

function login() {
  const input = document.querySelector("#username");
  setState("user", input.value)
  setState("score", 0)
  redirect("./pages/categories.html")
}

function init() {
  const button = document.querySelector("#login");
  button.addEventListener("click", login);

  const input = document.querySelector("#username")
  input.onkeydown = function(e) {
    if (e.keyCode === 13) login()
  }
  input.focus()
}

init()

