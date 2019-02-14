/****************************************************************************
 * snake.js
 *
 * Defines functions used to manipulate the snake data structure.
 *
 * Snakes are defined as a list of coordinate positions.
 *
 * The coorindates are offsets from the head of the snake so:
 *   - Snake head is always   :  { x : 0, y : 0 }
 *   - Adjacent part would be :  { x : 1, y : 0 }
 ***************************************************************************/

( function ( babylonProject, undefined )
{
    //empty object is used to contain other snake functions in a namespace
    babylonProject.snake = {};

    babylonProject.snake.turnAllowed = function ( newDir, currentDir )
    {
    };

} ( window.babylonProject = window.babylonProject || {} ));
