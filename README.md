A pokèmon inspired battler with turn based combat. The Green Knight logic works similar to the player, trying to defeat you with his attacks!
Try to win! 
- Single Attack 
- Lightning Attacks deals double the damage, but skips your after! The Green knight will take his revenge!
- The Block might defend you from the damage od the knight! Careful! {needs fixing!}
- Restart with the dedicated button or reload the page to start again!
- graphics inspired by classical nes games! 

Shoutout to nes.css creators. An awesome library to use for little gaming projects like this one.

** THIS IS A PERSONAL PROJECT MADE TO TEST MY UNDERSTANDING OF REACT NATIVE AND CANVAS WORKS. THIS GAME IS NOT MEANT TO BE USED OR BOUGHT ** 



# Base Structure

- install bootstrap
- use canvas to render sprites inside a container
- install nes.css

## Battle UI

- blue sx
- green dx
- lifebars, names
- command zone

## Combat

- turn order
- damage calculation
- state (lifebars, turns, animations on atk, animations on hit with "shake")

## Flow

- loading
- start anim
- choose atk -> anim -> calc -> end anim -> state (pv, anims)
- enemy turn
- repeat until either lifebar reaches 0
- show win/defeat screen and message
