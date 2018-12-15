/****************************************************************************
 * gameLoop.js
 *
 * This is the main game loop that is used to update objects and render
 * the scene.
 *
 * A finite state machine is used to switch between logical scenarios
 * such as the main menu or gameplay.
 *
 * The states are defined as objects in ./game_state
 ***************************************************************************/

( function ( babylonProject, undefined )
{
    /**
     * The current game state that will be updated during game loop cycles.
     *
     * The initial value is set i pageLoaded.js when the game starts.
     */
    babylonProject.currentGameState = null;

    babylonProject.gameLoop = function ()
    {
        //update state and store return value as current state
        babylonProject.currentGameState = 
            babylonProject.currentGameState.update (); 
    };

} ( window.babylonProject = window.babylonProject || {} ));
