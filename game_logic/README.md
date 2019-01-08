Game Logic
==========

The modules that control the behaviour of the game can be found in this
directory.  

The files specific to the game of Simon Says are found in:
    ./simon_says/

These modules use the namespace 'window.simonSays'.

Modules that are not specific to any game are found in:
    ./base_game/

These modules use the namespace 'window.babylonProject'.

The single point of access from the HTML file that contains the canvas
can be found in:
    
     ./base_game/jQueryDomFunctions.js

It defines the document ready function which simply passes the external
dependencies of the project to the page loaded function found in:

    ./base_game/pageLoaded.js

The page loaded function performs some initialization and starts the game
loop with the initial state defined in:

    ./startState.js

The pageLoaded function will set startState as the first state function
to be called by the game loop.

The following parameters will be passed to the startState function:

    - babylon: The instance of the babylon library object.  Commonly
               referred to by the global BABYLON - it is explicitly
               passed as a dependency parameter in this project.

    - gameData: A data structure for holding the current game state.
                The page loaded function will only set one value:

    - gameData.engine:  The BabylonJS engine instance that is currently
                        rendering to the canvas.

Game Loop Finite State Machine
==============================

The project uses a finite state machine to encode the various states the
game could be in.  Some example states would be the Main Menu, Gameplay
and Game Over screen.

A Game State is an object with an update() function.  The update function
is called once per tick of the game loop and should be used to advance the
by a single time step and return the new game state.

In a normal update call of a game state the object would check for 
collisions, update the positions of all game objects and then return itself.

If the player were to die the state would construct the Game Over state and
return that.

The initial state that the game enters into when the page is loaded can
be found in:
   
    ./startScene.js

The game loop is found in:
    
    ./base_game/gameLoop.js

The game loop is called repeatedly using Babylon's runRenderLoop function.
