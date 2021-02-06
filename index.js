const state = {
  enemies: {
    nextId: 0,
    list: [],
    spawnTimer: 20 ,
    spawnInterval: 30* 2,
    speed: 2,
  },
  bullets: {
    nextId: 0,
    list: [],
    shootTimer: 5 ,
    shootLimit: 5,
    speed: 15,
  },
  keyboard: {
    left: false,
    right: false,
    up: false,
    down: false,
    shoot: false,
  }, 
  pacman: {
    x: 0,
    y: 0,
    width: 50,
    height: 50
  },
  game: {
    width: 700,
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
  updateTimers()
  updateEnemies()
  updateBullets()
  calculateCollisions()
  movePacman()
  pacman.setAttribute("x", state.pacman.x)
  pacman.setAttribute("y", state.pacman.y)
}

function calculateCollisions() {
  const enemies = state.enemies.list;
  const bullets = state.bullets.list;
  for(let enemy of enemies) {
    for(let bullet of bullets) {
      if(svgHasCollided(enemy, bullet)){
        // remove them
        enemy.removed = true 
        document.getElementById(enemy.id).remove()
        bullet.removed = true
        document.getElementById(bullet.id).remove()
      }
    }
  }
  state.enemies.list = enemies.filter(
    enemy => !enemy.removed
  )
  state.bullets.list = bullets.filter(
    bullet => !bullet.removed
  )
}

function updateTimers() {
  updateEnemyTimer()
  updateBulletTimer()
}
function updateEnemyTimer() {
  state.enemies.spawnTimer += 1;
  if (state.enemies.spawnTimer ===  state.enemies.spawnInterval){
    const x = state.game.width - 40;
    const y = state.game.height * Math.random();
    state.enemies.spawnTimer = 0
    generateEnemy(x,y);
  }
}
function updateBulletTimer() {
  state.bullets.shootTimer += 1;
  if (
    state.bullets.shootTimer > state.bullets.shootLimit &&
    state.keyboard.shoot
  ){
    state.bullets.shootTimer = 0
    generateBullet(
      state.pacman.x + state.pacman.width,
      state.pacman.y + state.pacman.height/2,
    );
  }
}
function updateBullets() {
  state.bullets.list.forEach(updateBullet)
}
function updateBullet(bullet) {
  const { list, speed } = state.bullets

  bullet.setAttribute(
    "x", 
    parseInt(
      bullet.getAttribute('x')
    ) + speed
  )
  if(bullet.getAttribute('x') > state.game.width) {
    const findIndex = list.findIndex(
      arraybullet => arraybullet.id === bullet.id
    )
    list.splice(findIndex,1)
    document.getElementById(bullet.id).remove()
  }
}
function updateEnemies() {
  state.enemies.list.forEach(updateEnemy)
}

function updateEnemy(enemy) {
  const { list, speed } = state.enemies
  enemy.setAttribute("x", enemy.getAttribute('x') - speed)
  if(enemy.getAttribute('x') < 0 - enemy.getAttribute('width')) {
    const findIndex = list.findIndex(
      arrayEnemy => arrayEnemy.id === enemy.id
    )
    list.splice(findIndex,1)
    document.getElementById(enemy.id).remove()
  }
}

function svgHasCollided(first,second) {
  const firstB = getBoundaries(first);
  const secondB = getBoundaries(second);
  return (
      between(firstB.top,secondB.top,firstB.bottom) ||
      between(firstB.top,secondB.bottom,firstB.bottom) 
    ) &&
    (
      between(firstB.left,secondB.right,firstB.right) ||
      between(firstB.left,secondB.left,firstB.right)
    )
}

function between(first,value,second) {
  return first < value && value < second
}

function getBoundaries(svg){
  const x = parseInt(svg.getAttribute('x'))
  const y = parseInt(svg.getAttribute('y'))
  const width = parseInt(svg.getAttribute('width'))
  const height = parseInt(svg.getAttribute('height'))
  
  return svgPoints = {
    top: y,
    bottom: y+height,
    left: x,
    right: x+width
  }
  
}


function movePacman() {
  const { keyboard, pacman, game } = state
  if(keyboard.left && pacman.x > 0) pacman.x -= 10
  if(keyboard.right && pacman.x < game.width - pacman.width) 
    pacman.x += 10
  if(keyboard.up && pacman.y > 0) pacman.y -= 10
  if(keyboard.down && pacman.y < game.height - pacman.height) 
    pacman.y += 10
}

function setUpKeyboardListeners() {
  const setEventWithResult = (keyboardEvent, value) => {
    document.addEventListener(keyboardEvent,event => {
      switch(event.key) {
        case "ArrowLeft":
        case "A":
        case "a":
          state.keyboard.left = value
        break;
        case "ArrowRight":
        case "D":
        case "d":
          state.keyboard.right = value
        break;
        case "ArrowUp":
        case "W":
        case "w":
          state.keyboard.up = value
        break;
        case "ArrowDown":
        case "S":
        case "s":
          state.keyboard.down = value
        break;
        case " ":
          state.keyboard.shoot = value
        break;
      }
    })
  }
  setEventWithResult("keydown",true)
  setEventWithResult("keyup",false)
}

function generateEnemy(x,y) {
  const creationContainer = document.createElement('svg');
  creationContainer.innerHTML = enemySvg;
  const enemy = creationContainer.children[0];
  enemy.setAttribute('x',x)
  enemy.setAttribute('y',y)
  enemy.id = `enemy-${state.enemies.nextId.enemy}`;
  state.enemies.nextId.enemy++;
  game.appendChild(enemy);
  state.enemies.list.push(enemy);
}

function generateBullet(x,y) {
  const creationContainer = document.createElement('svg');
  creationContainer.innerHTML = heroBulletSvg;
  const bullet = creationContainer.children[0];
  bullet.setAttribute('x',x)
  bullet.setAttribute('y',y)
  bullet.id = `bullet-${state.bullets.nextId}`;
  state.bullets.nextId++;
  game.appendChild(bullet);
  state.bullets.list.push(bullet);
}

window.addEventListener('DOMContentLoaded', (event) => setup());
