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
 *
 * The y axis describes the long torus rings that  surround the player.  
 * The x-axis is along the smaller rings that form the circumference of the 
 * torus tube
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
        let snakeParts = [];

        //create the snake as a line of 3 pieces along the y axis.
        // - Note:  The y axis describes the long torus rings that 
        //          surround the player.  The x-axis is the
        //          smaller rings that form the circumference of the 
        //          torus tube

        for ( let i=0; i<3; i++ )
        {
            snakeParts.push ( { x : 0, y : i } );
        }

        //return the snake move state as the next state
        return  () => babylonProject.gameplayState ( babylon, gameData );
    }

} ( window.babylonProject = window.babylonProject || {} ));
