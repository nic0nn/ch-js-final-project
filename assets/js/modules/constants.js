
const superheroes = [ "batman", "robin", "superman", "thor"]
const comidas = [ "canelones", "ñoquis", "fideos", "arroz" ]
const dispositivos = [ "computadora", "microfono", "camara", "teclado" ]
const todas = [ ...superheroes, ...comidas, ...dispositivos ]

export const CATEGORIES = {
  superheroes,
  comidas,
  dispositivos,
  todas
}

export const BODY_PARTS = [
  "head",
  "body",
  "right-arm",
  "left-arm",
  "right-leg",
  "left-leg",
];

export const MAX_ATTEMPTS = BODY_PARTS.length