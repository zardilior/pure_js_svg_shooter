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
3- Shooting // DONE
  - bullet svg  // success
  - detect shooting key // success
  - regulate the shooting with a timer // success
  - move the bullets and remove on screen exit // success
4- collisions // DONE
  - enemy vs bullet // success
  - hero vs enemy  // success
5- enemy shooting //DONE
  - add bullets every x seconds // success
6- HP //DONE
  - hero vs enemy bullets // success
7- Game Over
6- Left for later 
  - add HP bar
