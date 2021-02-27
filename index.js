
function getInitialState() {
  return {
    interval: null,
    enemies: {
      nextId: 0,
      list: [],
      spawnTimer: 20 ,
      spawnInterval: 60,
      height:40,
      speed: 2,
      shootingInterval: 300,
      initialShootingInterval: 280,
    },
    enemyBullets: {
      nextId: 0,
      list: [],
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
      life: 3,
      x: 0,
      y: 0,
      width: 50,
      height: 50,
      hasDied: false,
    },
    game: {
      width: 700,
      height: 500
    }
  }
}

let state = getInitialState();

function alignGameOverMessage(x,y) {
  gameOverMessage.setAttribute('x',x)
  gameOverMessage.setAttribute('y',y)
}

function showGameOver() {
  gameOverMessage.style.visibility = "initial"
  game.style.backgroundColor = "#aaa"
}
function hideGameOver() {
  gameOverMessage.style.visibility = "hidden"
  game.style.backgroundColor = "#ccc"
}

function cleanUpInterval() {
  clearInterval(state.interval)
}
function cleanUpHtml() {
  clearEnemies()
  clearBullets()
  clearEnemyBullets()
}

function clearEnemies() {
  state.enemies.list.forEach(
    enemy => document.getElementById(enemy.id).remove()
  )
}

function clearBullets() {
  state.bullets.list.forEach(
    bullet => document.getElementById(bullet.id).remove()
  )
}

function clearEnemyBullets() {
  state.enemyBullets.list.forEach(
    enemyBullets => document.getElementById(enemyBullets.id).remove()
  )
}

function restart() {
  document.onclick = function() {};
  cleanUpHtml();
  hideGameOver()
  state = getInitialState()
  pacman.style.opacity = 1
  setup()
}

function gameOver() {
  cleanUpInterval();
  showGameOver()
  document.onclick = restart;
  //state = getInitialState();
}

function setup() {
  setHeightAndWidth()
  setUpKeyboardListeners();
  alignGameOverMessage(state.game.width/2, state.game.height/2);
  state.interval = setInterval(update,1000/30)
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
  updateEnemyBullets()
  calculateCollisions()
  movePacman()
  pacman.setAttribute("x", state.pacman.x)
  pacman.setAttribute("y", state.pacman.y)
}

function calculateCollisions() {
  calculateBulletVSEnemyCollisions()
  calculateHeroVSEnemyCollisions()
  calculateHeroVSEnemyBulletCollisions()
}

function calculateBulletVSEnemyCollisions() {
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

function calculateHeroVSEnemyCollisions() {
  const enemies = state.enemies.list;
  for(let enemy of enemies) {
    if(svgHasCollided(enemy, pacman)){
      // remove them
      enemy.removed = true 
      document.getElementById(enemy.id).remove()
      state.pacman.hasDied = true
    }
  }
  state.enemies.list = enemies.filter(
    enemy => !enemy.removed
  )
  if(state.pacman.hasDied) {
    pacmanDies()
  }
}
function pacmanDies() {
  pacman.style.opacity = 0;
  state.pacman.hasDied = true;
  gameOver()
}

function calculateHeroVSEnemyBulletCollisions() {
  const enemyBullets = state.enemyBullets.list;
  let wasHit = false
  for(let enemyBullet of enemyBullets) {
    if(svgHasCollided(enemyBullet, pacman)){
      // remove them
      enemyBullet.removed = true 
      document.getElementById(enemyBullet.id).remove()
      wasHit = true
    }
  }
  state.enemyBullets.list = enemyBullets.filter(
    enemyBullet => !enemyBullet.removed
  )
  if(wasHit) {
    console.log("wasHit life: ",state.pacman.life)
    state.pacman.life -=1
    if(state.pacman.life < 1) {
      pacmanDies()
    }
  }
}

function updateTimers() {
  updateEnemyTimer()
  updateBulletTimer()
}

function updateEnemyTimer() {
  state.enemies.spawnTimer += 1;
  if (state.enemies.spawnTimer ===  state.enemies.spawnInterval){
    const x = state.game.width;
    const y = (state.game.height - state.enemies.height) * Math.random();
    state.enemies.spawnTimer = 0
    generateEnemy(x,y);
  }
}

function updateBulletTimer() {
  state.bullets.shootTimer += 1;
  if (
    state.bullets.shootTimer > state.bullets.shootLimit &&
    state.keyboard.shoot && 
    !state.pacman.hasDied
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
function updateEnemyBullets() {
  state.enemyBullets.list.forEach(updateEnemyBullet)
}

function updateEnemyBullet(bullet) {
  const { list, speed } = state.enemyBullets

  const x = parseInt(bullet.getAttribute('x'))
  const width = parseInt(bullet.getAttribute('width'))

  bullet.setAttribute(
    "x", x - speed
  )
  if(x + width < 0) {
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
  const { list, speed, shootingInterval } = state.enemies
  enemy.setAttribute("x", enemy.getAttribute('x') - speed)
  // shouldRemoveEnemy?
  if(enemy.getAttribute('x') < 0 - enemy.getAttribute('width')) {
    const findIndex = list.findIndex(
      arrayEnemy => arrayEnemy.id === enemy.id
    )
    list.splice(findIndex,1)
    document.getElementById(enemy.id).remove()
  }
  // shooting
  enemy.custom.timer++
  if(enemy.custom.timer > shootingInterval) {
    generateEnemyBullet(
      enemy.getAttribute('x'),
      enemy.getAttribute('y') + enemy.getAttribute('height')/2
    )
    enemy.custom.timer = 0
  }
}

function svgHasCollided(first,second) {
  const firstB = getBoundaries(first);
  const secondB = getBoundaries(second);
  return (
      between(firstB.top,secondB.top,firstB.bottom) ||
      between(firstB.top,secondB.bottom,firstB.bottom) ||
      between(secondB.top,firstB.top,secondB.bottom) ||
      between(secondB.top,firstB.bottom,secondB.bottom) 
    ) &&
    (
      between(firstB.left,secondB.right,firstB.right) ||
      between(firstB.left,secondB.left,firstB.right) ||
      between(secondB.left,firstB.right,secondB.right) ||
      between(secondB.left,firstB.left,secondB.right)
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
  enemy.id = `enemy-${state.enemies.nextId}`;
  enemy.custom = {
    timer: state.enemies.initialShootingInterval 
  }
  state.enemies.nextId++;
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

function generateEnemyBullet(x,y) {
  const creationContainer = document.createElement('svg');
  creationContainer.innerHTML = enemyBulletSvg;
  const bullet = creationContainer.children[0];
  const width = parseInt(bullet.getAttribute("width"))
  bullet.setAttribute('x',x - width)
  bullet.setAttribute('y',y)
  bullet.id = `enemy-bullet-${state.enemyBullets.nextId}`;
  state.enemyBullets.nextId++;
  game.appendChild(bullet);
  state.enemyBullets.list.push(bullet);
}

window.addEventListener('DOMContentLoaded', (event) => setup());
