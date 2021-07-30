import { getFromState } from "./../utils.js";
import HangedGame from "./HangedGame.js";

const setProfile = () => {
  $(".username").html(`<b>Jugador: </b>${getFromState("user")}`);
};

const setCategory = () => {
  $(".category").html(`<b>Categoría: </b>${getFromState("category")}`);
};

const setScore = () => {
  $(".score").html(`<b>Puntaje: </b>${getFromState("score")}`);
};

const initGame = () => {
  setProfile();
  setCategory();
  setScore();
  new HangedGame().init();
};

setProfile();
initGame();
