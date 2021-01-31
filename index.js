const state = {
  keyboard: {
    left: false,
    right: false,
    up: false,
    down: false,
  }, 
  pacman: {
    x: 0,
    y: 0,
    width: 50,
    height: 50
  },
  game: {
    width: 1000,
    height: 500
  }
}

function setup() {
  setHeightAndWidth()
  setUpKeyboardListeners();
  setInterval(update,1000/30)
}
function setHeightAndWidth() {
  const { width, height } = state.game;
  game.setAttribute("width",width);
  game.setAttribute("height",height);
  game.setAttribute("viewBox",`0 0 ${width} ${height}`);
}

function update() {
  movePacman()
  pacman.setAttribute("x", state.pacman.x)
  pacman.setAttribute("y", state.pacman.y)
}

function movePacman() {
  const { keyboard, pacman, game } = state
  if(keyboard.left && pacman.x > 0) pacman.x -= 10
  if(keyboard.right && pacman.x < game.width - pacman.width) pacman.x += 10
  if(keyboard.up && pacman.y > 0) pacman.y -= 10
  if(keyboard.down && pacman.y < game.height - pacman.height) pacman.y += 10
  console.log("movePacman",keyboard,pacman)
}

function setUpKeyboardListeners() {
  const setEventWithResult = (keyboardEvent, value) => {
    document.addEventListener(keyboardEvent,event => {
      switch(event.key) {
        case "A":
        case "a":
          state.keyboard.left = value
        break;
        case "D":
        case "d":
          state.keyboard.right = value
        break;
        case "W":
        case "w":
          state.keyboard.up = value
        break;
        case "S":
        case "s":
          state.keyboard.down = value
        break;
      }
      console.log(keyboardEvent,event.key,state.keyboard)
    })
  }
  setEventWithResult("keydown",true)
  setEventWithResult("keyup",false)
}

window.addEventListener('DOMContentLoaded', (event) => setup());
