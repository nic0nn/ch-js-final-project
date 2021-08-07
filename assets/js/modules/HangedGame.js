import {
  deleteState,
  getCategories,
  getFromState,
  getRandomInt,
  redirect,
  setState,
} from "../utils.js";

import { BODY_PARTS, MAX_ATTEMPTS } from "./constants.js";

const getChars = (currentWord) => {
  const letters = currentWord.split("");
  const chars = letters.map((letter) => ({
    letter: letter,
    visible: false,
  }));

  return chars;
};

export default class HangedGame {
  constructor() {
    this.attempts = 0;

    this.alreadyEntered = [];
    this.isCompleted = false;
    this.currentLetter = null;
  }

  renderChars() {
    const position = $(".letters");
    position.html("");
    this.chars.forEach((char) => {
      position.append(
        `<span class='underscore'>${char.visible ? char.letter : "_"}</span>`
      );
    });
  }

  renderCount() {
    $("#tryNumber").val(`Intentos: ${MAX_ATTEMPTS - this.attempts}`);
  }

  renderAlreadyEntered() {
    const container = $("#already-entered");
    container.html("");
    this.alreadyEntered.forEach((letter) => {
      container.append(`<span>${letter}</span>`);
    });
  }

  hideRetryButton = (status) => {
    const reset = $(".reset");
    switch (status) {
      case true:
        reset.hide();
        break;
      case false:
        reset.show()
      default:
        break;
    }
  };

  handleHangedBoy() {
    const visibility = this.attempts > 0 ? "visible" : "hidden";
    const parts = this.attempts > 0 ? this.attempts : BODY_PARTS.length;

    for (let index = 0; index < parts; index++) {
      const element = $(`.${BODY_PARTS[index]}`);
      element.css({ visibility: visibility });
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

    this.currentLetter = letter;
    this.update();
  };

  handleReset = () => {
    this.attempts = 0;
    this.alreadyEntered = [];
    this.currentLetter = null;

    this.chars.forEach((char) => {
      char.visible = false;
    });

    this.hideRetryButton();
    this.update();
  };

  handleRestart = () => {
    this.isCompleted = false;
    this.handleReset();
  };

  handleGoBack = () => {
    redirect("./categories.html");
  };

  handleExit = () => {
    deleteState();
    redirect("./../");
  };

  changeWord = () => {
    this.attempts = 0;
    this.currentWord = this.category[getRandomInt(0, this.category.length)];
    this.chars = getChars(this.currentWord);
    this.alreadyEntered = [];
    this.currentLetter = null;
    this.isCompleted = false;

    this.hideRetryButton(false);
    this.update();
  };

  checkCompleted = () => {
    return !this.chars.some((w) => w.visible === false);
  };

  updateScore = () => {
    const oldScore = getFromState("score");
    const score = oldScore + 10 - this.attempts;
    setState("score", score);

    $(`.score`).html(`<b>Puntaje: </b>${score}`);
  };

  handleCompleted() {
    this.updateScore();
    this.showWinMessage(true);
  }

  update() {
    if (this.isCompleted) return;

    this.renderChars();
    this.renderCount();
    this.renderAlreadyEntered();

    this.isCompleted = this.checkCompleted();

    if (this.isCompleted) {
      this.handleCompleted();
      this.hideRetryButton(true);
      return;
    }

    this.handleHangedBoy();
    this.showWinMessage(false);
    this.showLostMessage(false);

    if (MAX_ATTEMPTS === this.attempts) {
      this.showLostMessage(true);
      this.hideRetryButton(true);
      return;
    }

    $("#letter")
      .val(this.currentLetter)
      .trigger("focus")
      .prop("disabled", false);
  }

  showLostMessage(status) {
    $(".game-results").css({ visibility: status ? "visible" : "hidden" });
    $("#game-result").html("¡HAS PERDIDO!").css({ color: "red" });
    $(".current-word").html(this.currentWord);
    $(".current-word-container").css({
      visibility: status ? "visible" : "hidden",
    });
  }

  showWinMessage(status) {
    $(".game-results").css({ visibility: status ? "visible" : "hidden" });
    $("#game-result").html("¡HAS GANADO!").css({ color: "green" });
    $(".current-word-container").css({ visibility: "hidden" });
  }

  handleGameEvents() {
    const input = $("#letter");
    input.on("keypress", this.handleChange);
    input.trigger("focus");

    const change = $("#change");
    change.on("click", this.changeWord);

    const goback = $("#goback");
    goback.on("click", this.handleGoBack);

    const exit = $("#exit");
    exit.on("click", this.handleExit);

    const reset = $(".reset");
    reset.on("click", this.handleReset);
  }

  async init() {
    const categories = await getCategories();
    this.category = categories[getFromState("category")];

    this.currentWord = this.category[getRandomInt(0, this.category.length)];
    this.chars = getChars(this.currentWord);

    this.handleGameEvents();
    this.update();
  }
}
