/****************************************************************************
 * createSnakeState.js
 *
 * This state clears the board and creates a new snake.
 *
 * The snake parts are stored as list of objects in:
 *      
 *      gameData.snakeParts
 *
 * Each snake part is an object with an x and y value.  E.g:
 *
 *      { x : 1, y : 5 }
 *
 * The first value in the list represents the snake's head and the last
 * element is the tip of its tail.
 ***************************************************************************/

( function ( babylonProject, undefined )
{
    babylonProject.createSnakeState = function ( babylon, gameData )
    {
        if ( gameData == undefined )
        {
            throw new Error ( "GameData is undefined." );
        }

        if ( babylon == undefined )
        {
            throw new Error ( "Babylon is undefined." );
        }

        //create an empty list to hold the snake's body positions
        gameData.snakeParts = [];

        //create the three initial pieces in a horizontal line
        for ( let i=0; i<3; i++ )
        {
            gameData.snakeParts.push ( { x : i, y : 0 } );
        }

        //return the snake move state as the next state
        return  () => babylonProject.snakeMoveState ( babylon, gameData );
    }

} ( window.babylonProject = window.babylonProject || {} ));
