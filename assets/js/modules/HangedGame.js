import { deleteState, getFromState, getRandomInt, redirect, setState } from "../utils.js";
import { CATEGORIES, BODY_PARTS, MAX_ATTEMPTS } from "./constants.js";

const getChars = (currentWord) => {
  const letters = currentWord.split("");
  const chars = letters.map((letter) => ({
    letter: letter,
    visible: false,
  }));

  return chars;
}
export default class HangedGame {
  constructor() {
    this.attempts = 0;
    this.category = CATEGORIES[getFromState("category")];
    this.currentWord = this.category[getRandomInt(0, this.category.length)];
    this.chars = getChars(this.currentWord);
    this.alreadyEntered = [];
    this.isCompleted = false;
    this.currentLetter = null;
  }

  renderChars() {
    const positions = document.querySelector(".letters");
    positions.innerHTML = "";
    for (let index = 0; index < this.chars.length; index++) {
      const char = this.chars[index];
      const underscore = document.createElement("span");
      underscore.className = "underscore";
      underscore.innerText = char.visible ? char.letter : "_";
      positions.appendChild(underscore);
    }
  }

  renderCount() {
    const span = document.querySelector("#tryNumber");
    span.innerText = `Intentos: ${MAX_ATTEMPTS - this.attempts}`;
  }

  renderAlreadyEntered() {
    const container = document.querySelector("#already-entered");
    container.innerHTML = "";

    this.alreadyEntered.forEach((letter) => {
      const span = document.createElement("span");
      span.innerText = letter;
      container.appendChild(span);
    });
  }

  renderResetButton = () => {
    const actions = document.querySelector(".actions");
    const reset = document.querySelector(".reset");

    const button = reset ? reset : document.createElement("button");

    button.className = "btn btn-danger reset";
    button.innerText = this.isCompleted ? "Volver a comenzar" : "Reintentar";

    button.addEventListener(
      "click",
      this.isCompleted ? this.handleRestart : this.handleReset
    );
    actions.prepend(button);
  };

  handleHangedBoy() {
    const visibility = this.attempts > 0 ? "visible" : "hidden";
    const parts = this.attempts > 0 ? this.attempts : BODY_PARTS.length;

    for (let index = 0; index < parts; index++) {
      const element = document.querySelector(`.${BODY_PARTS[index]}`);
      element.style = `visibility: ${visibility}`;
    }
  }

  handleChange = (e) => {
    e.preventDefault();

    if (MAX_ATTEMPTS === this.attempts || this.isCompleted) return;

    const letter = e.key.toUpperCase();

    if (this.alreadyEntered.some((l) => l === letter)) return;

    this.alreadyEntered.push(letter);

    let isValid = false;

    this.chars.forEach((char) => {
      if (char.letter.toUpperCase() === letter) {
        char.visible = true;
        isValid = true;
      }
    });

    if (!isValid) {
      this.attempts += 1;
    }

    this.currentLetter = letter
    this.update();
  };

  handleReset = () => {
    this.attempts = 0;
    this.alreadyEntered = [];
    this.currentLetter = null;

    this.chars.forEach((char) => {
      char.visible = false;
    });

    this.update();
  };

  handleRestart = () => {
    this.isCompleted = false;
    this.handleReset();
  };

  handleGoBack = () => {
    redirect("./categories.html")
  };

  handleExit = () => {
    deleteState();
    redirect("./../../index.html")
  };

  changeWord = () => {
    this.attempts = 0;
    this.currentWord = this.category[getRandomInt(0, this.category.length)];
    this.chars = getChars(this.currentWord);
    this.alreadyEntered = [];
    this.currentLetter = null;
    this.isCompleted = false;

    this.update();
  };

  checkCompleted = () => {
    return !this.chars.some((w) => w.visible === false);
  };

  updateScore = () => {
    const oldScore = getFromState("score");
    const score = oldScore + 10 - this.attempts;
    setState("score", score);
    const category = document.querySelector(".score");
    category.innerHTML = `<b>Puntaje: </b>${score}`;
  };

  handleCompleted() {
    this.updateScore();
    this.showWinMessage(true);
    this.renderResetButton();
  }

  update() {
    if (this.isCompleted) return;

    this.renderChars();
    this.renderCount();
    this.renderAlreadyEntered();

    this.isCompleted = this.checkCompleted();

    if (this.isCompleted) {
      this.handleCompleted()
      return;
    }

    this.handleHangedBoy();
    this.showWinMessage(false);
    this.showLostMessage(false);

    const input = document.querySelector("#letter");
    
    if (MAX_ATTEMPTS === this.attempts) {
      this.showLostMessage(true);
      return;
    }

    input.focus();
    input.value = this.currentLetter;
    input.disabled = false;
  }

  showLostMessage(status) {
    const container = document.querySelector(".game-results");
    const result = document.querySelector("#game-result");

    result.innerText = "¡HAS PERDIDO!"
    result.style = "color: red"
    container.style = `visibility: ${status ? "visible" : "hidden"}`;

    const currentWord = document.querySelector(".current-word");
    const currentWordContainer =  document.querySelector(".current-word-container");

    currentWord.innerText = this.currentWord;
    currentWordContainer.style = `visibility: ${status ? "visible" : "hidden"}`;
  }

  showWinMessage(status) {
    const div = document.querySelector(".game-results");
    const result = document.querySelector("#game-result");
    const currentWord = document.querySelector(".current-word-container");
    
    result.innerText = "¡HAS GANADO!"
    result.style = "color: green"
    
    div.style = `visibility: ${status ? "visible" : "hidden"}`;
    currentWord.style = `visibility: hidden`;
  }

  handleGameEvents() {
    const input = document.querySelector("#letter");
    input.addEventListener("keypress", this.handleChange);
    input.focus();

    const change = document.querySelector("#change");
    change.addEventListener("click", this.changeWord);

    const goback = document.querySelector("#goback");
    goback.addEventListener("click", this.handleGoBack);

    const exit = document.querySelector("#exit");
    exit.addEventListener("click", this.handleExit);
  }

  
  init() {
    this.handleGameEvents()
    this.renderResetButton();
    this.update();
  }
}
