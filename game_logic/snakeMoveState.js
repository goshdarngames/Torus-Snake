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

        window.babylonProject.updateTorusMeshes (
                gameData.torusMeshes,
                gameData.snakeParts,
                0 );

        gameData.scene.render ();

        return () => babylonProject.snakeMoveState ( babylon, gameData );
    }

} ( window.babylonProject = window.babylonProject || {} ));
