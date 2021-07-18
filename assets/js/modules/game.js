import { getFromState } from "./../utils.js";
import HangedGame from "./HangedGame.js";

const setProfile = () => {
  const username = document.querySelector(".username");
  username.innerHTML = `<b>Jugador: </b>${getFromState("user")}`
};

const setCategory = () => {
  const category = document.querySelector(".category")
  category.innerHTML = `<b>Categoría: </b>${getFromState("category")}`
}

const setScore = () => {
  const category = document.querySelector(".score")
  category.innerHTML = `<b>Puntaje: </b>${getFromState("score")}`
}

const initGame = () => {
  setProfile()
  setCategory()
  setScore()
  new HangedGame().init()
};

setProfile();
initGame();
