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

    /**
     * babylonProject.snake.turnAllowed ( newDir, currentDir )
     *
     * Returns true if the snake is allowed to turn towards newDir
     * from currentDir.
     *
     * Only perpindicular movement is allowed.
     */
    babylonProject.snake.turnAllowed = function ( newDir, currentDir )
    {
        let config = window.babylonProject.config;

        let u = config.dirUp;
        let d = config.dirDown;
        let l = config.dirLeft;
        let r = config.dirRight;

        //check perpindicular for up or down
        let vertical =
            ( newDir == u     || newDir == d ) && 
            ( currentDir == l || currentDir == r );
        
        //check perpindicular for left or right
        let horizontal =
            ( newDir == r     || newDir == l ) && 
            ( currentDir == u || currentDir == d );

        return ( vertical || horizontal );
        
    };

} ( window.babylonProject = window.babylonProject || {} ));
