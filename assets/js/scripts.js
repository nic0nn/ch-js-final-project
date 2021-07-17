import { getFromState, setState, getRandomInt, deleteState } from "./utils.js"

const MAX_ATTEMPTS = 6
const WORDS = [ "canelones", "batman", "computadora", "botella"]

function init() {
  const button = document.querySelector("#login");
  button.addEventListener("click", startGame);

  const input = document.querySelector("#username")
  input.onkeydown = function(e) {
    if (e.keyCode === 13) startGame()
  }
}

function startGame() {  
  const input = document.querySelector("#username");
  const user = input.value

  setState("user", user)
  setState("attempts", 0)
  setState("score", 0)

  alert(`${user} he elegido una palabra. Deberás ingresar letra por letra hasta adivinar que palabra es`);
  alert(`Si logras adivinarla en menos de 6 intentos ganarás 10 puntos`)
  alert(`Empecemos...`)

  game()
}

function game() {
  const word = randomWord()
  console.log(`[+] Palabra seleccionada: ${word}`);

  const chars = word.split("").map(char => ({ visible: false, value: char.toUpperCase() }))
  
  while (checkGameStatus(chars)) {
    handleGame(chars)
  }

  if (chars.some(char => !char.visible)) {
    return handleGameLost(word)
  }

  handleGameWin()
}

function checkGameStatus(chars) {
  const attempts = getFromState("attempts")
  if (attempts === MAX_ATTEMPTS) return false
  if (!chars.some(char => !char.visible)) return false
  return true
}

function handleGame(chars) {
  let input = prompt(`${generatePrompt(chars)}`)
  if (!input) { return setState("attempts", 6)}
  input = input.toLocaleUpperCase()

  const isValid = chars.some(char => char.value === input)

  if (isValid) {
    chars.forEach((char, index) => {
      if (char.value === input) {
        chars[index].visible = true 
      }
    })
  } else {
    increaseAttempts()
  }
}

function handleGameEnd() {
  deleteState()
  alert("¡Gracias por jugar!")
}

function handleResponse(response) {
  if (!response) {
    return handleGameEnd()
  }
  if (response.toUpperCase() === "SI") {
    setState("attempts", 0)
    return game()
  }
  return handleGameEnd()
}

function handleGameLost(word) {
  const str = `¡Has perdido! La palabra correcta era: ${word}. ¿Volver a empezar? Ingrese "si" para continuar`
  const response = prompt(str)
  return handleResponse(response)
}

function handleGameWin() {
  increaseScore()
  const str = `
  ¡Has ganado!
  Puntaje actual: ${getFromState("score")}
  ¿Deseas continuar? Ingresa "si" para confirmar
  
  `
   const response = prompt(str)
   return handleResponse(response)   
}


function generatePrompt(chars) {
  const attempts = getFromState("attempts")

  let str = `Intentos: ${attempts}
Ingresa una letra: `

  chars.forEach(char => {
    if (char.visible) str += ` ${char.value}`
    else str += ` _`
  });

  return str
}

function randomWord() {
  return WORDS[getRandomInt(0, WORDS.length)]
}

function increaseScore() {
  const score = getFromState("score")
  setState("score", score + 10)
}

function increaseAttempts() {
  const attempts = getFromState("attempts")
  setState("attempts", attempts + 1)
}

init()

