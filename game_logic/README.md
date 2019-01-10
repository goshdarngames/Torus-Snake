Game Logic
==========

The modules that control the behaviour of the game can be found in this
directory.  

Game Data
=========

The current state of the game is passed between functions using a data
structure called 'gameData'.  

gameData has the following properties:

    * engine - The BabylonJS engine that is rendering to the canvas.

    * torus - The mesh of the ring that surrounds the player
    
    * torusMeshes - A list of meshes, one for each vertex of the torus.
                    This list is used to draw the graphics of the snake.
    
    * snakeMat - The material used for meshes that are part of the snake's
                 body.
 
    * appleMat - The material used for the apple.

The advantage of passing the data around like this is that it makes 
mocking the current state much easier in tests.  

Modules
=======

The main modules are:

    * StartState.js: 

      The initial state of the game loop.  Performs initialization of data.

    * CreateSnakeState.js:
      
      This game loop state creates the snake data as it should
      be of the beginning of a new game.

    * SnakeMoveState.js:

      This game loop state handles the delay timer between moves.

    * updateTorusMeshes.js:

      This function changes the torus Meshes to display the current
      state of the snake.

These modules use the namespace 'window.babylonProject'.

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
