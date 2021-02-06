# Steps to follow

------------------------|
                    ---E|
  H ----                |
                       E| 
------------------------|

1- Character movement (SVG) // DONE
  - insert a geo shape //success
  - captured the keyboard events // success
    GameState = {
      keyboard = {
        right,left,top,down
      }
    }
  - update loop and moved the hero // success
    setInterval(update(),1000/60)

2- Enemy generation // DONE 
  - Create a timer for enemy spawn // success
  - Create the svg for the enemy // success
  - Insert an enemy at random position // success
  - enemy movement // success
  - enemy disapearing // success
3- Shooting
  - bullet svg  // success
  - detect shooting key // success
  - regulate the shooting with a timer // success
  - move the bullets and remove on screen exit // success
4- collisions
  - enemy vs bullet
  - hero vs enemy
5- enemy shooting
6- HP
  - hero vs enemy bullets 
