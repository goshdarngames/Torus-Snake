/****************************************************************************
 * snakeMoveState.js
 *
 * Checks if the snake has moved and updates the grid squares if so.
 ***************************************************************************/

( function ( babylonProject, undefined )
{
    babylonProject.snakeMoveState = function ( babylon, gameData )
    {
        if ( gameData == undefined )
        {
            throw new Error ( "gameData is undefined." );
        }

        if ( babylon == undefined )
        {
            throw new Error ( "babylon is undefined." );
        }

        if ( gameData.snakeParts == undefined )
        {
            throw new Error ( "gameData.snakeParts is undefined." );
        }

        if ( gameData.snakeMoveInterval == undefined )
        {
            throw new Error ( "gameData.snakeMoveInterval is undefined." );
        }

        if ( gameData.snakeMoveTimer  == undefined )
        {
            throw new Error ( "gameData.snakeMoveTimer is undefined." );
        }

        //check if move timer has elapsed and move if so

        gameData.snakeMoveTimer -= gameData.engine.getDeltaTime ();

        if ( gameData.snakeMoveTimer <= 0 )
        {
            window.babylonProject.updateTorusMeshes ( gameData );

            gameData.snakeMoveTimer = gameData.snakeMoveInterval;
        } 

        //render the scene and return next state

        gameData.scene.render ();

        return () => babylonProject.snakeMoveState ( babylon, gameData );
    }

    /**
     * babylonProject.moveSnake 
     *
     * Moves the snake in the specified direction.
     *
     * Parameters:
     * - dir        : The { x, y } with the desired direction
     * - snakeParts : The list of { x, y } coordinates of the snake's body
     * - wrapFunc   : The function that should be used to wrap the 
     *                coordinates around the torus shape.  Usually expects
     *                the gameData.wrapTorusCoords defined in startState 
     */
    babylonProject.moveSnake = function ( dir, snakeParts, wrapFunc )
    {
    };

} ( window.babylonProject = window.babylonProject || {} ));
