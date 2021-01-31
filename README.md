# Steps to follow

------------------------|
                    ---E|
  H ----                |
                       E| 
------------------------|

1- Character movement (SVG)
  - insert a geo shape //success
    <circle>
    </circle>
  - captured the keyboard events // success
    GameState = {
      keyboard = {
        right,left,top,down
      }
    }
  - update loop and moved the shape // success
    setInterval(update(),1000/60)

2- Enemy generation
3- character shooting
4- enemy dying
5- enemy shooting
6- HP
