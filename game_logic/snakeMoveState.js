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

        window.babylonProject.updateTorusMeshes ( gameData );

        gameData.scene.render ();

        return () => babylonProject.snakeMoveState ( babylon, gameData );
    }

} ( window.babylonProject = window.babylonProject || {} ));
