import { redirect, setState } from "./utils.js"

function login() {
  const input = $("#username")
  setState("user", input.val())
  setState("score", 0)
  redirect("./pages/categories.html")
}

function init() {
  const button = $("#login")
  button.on("click", login)
 
  const input = $("#username")
  input.on("keydown", function(e) {
    if (e.keyCode === 13) login()
  })
  input.trigger("focus")
}

init()

