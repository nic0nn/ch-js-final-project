export const setState = (name, value) => {
  let s = JSON.parse(localStorage.getItem("state"))
  s = { ...s, [name]: value}
  localStorage.setItem("state", JSON.stringify(s))
}

export const getFromState = (name) => {
  let s = JSON.parse(localStorage.getItem("state"))
  if (!s) {
    window.location.assign("/index.html")
    return;
  }
  return s[name]
}

export const deleteState = () => {
  localStorage.removeItem("state")
}


export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
}