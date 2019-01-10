/****************************************************************************
 * updateTorusMeshes.js
 *
 * Defines a function that updates a list of meshes in order to represent
 * the current state of the snake body.
 *
 * The headIndex parameter specifies which mesh should represent the head
 * of the snake.  The position of the other body parts will be calculated
 * relevant to this.
 ***************************************************************************/

( function ( babylonProject, undefined )
{
    /**
     * babylonProject.updateTorusMeshes
     * 
     * Given a list of the meshes that appear at each vertex of the 
     * torus this function will toggle isVisible on each according
     * to the current position of the snake.
     */  
    babylonProject.updateTorusMeshes = function ( gameData )
    {

        if ( gameData == undefined )
        {
            throw ( "gameData parameter is undefined" );
        }
        
        if ( gameData.snakeParts == undefined )
        {
            throw (  "gameData.snakeParts should be a list of tuples" );
        }
        
        if ( gameData.torusMeshes == undefined )
        {
            throw ( "gameData.torusMeshes should be a list of "+
                    "meshes with length >= gameData.snakeParts" );
        }

        if ( gameData.torusMeshes.length < gameData.snakeParts.length )
        {
            throw ( "gameData.torusMeshes.length should be >= "+
                    "gameData.snakeParts.length" );
        }

        gridSize = Math.sqrt ( gameData.torusMeshes.length );

        if ( !Number.isInteger ( gridSize ) )
        {
            throw  ( "gameData.torusMeshes.length should be square number" );
        }

        let torusMeshes = gameData.torusMeshes;

        //set all torusMeshes to be invisble
        torusMeshes.forEach ( 
            function ( mesh )
            {
                mesh.isVisible = false;
            });

        //set the snake torusMeshes to be visible
        gameData.snakeParts.forEach (
            function ( s )
            {
                //note:  could potentially cache these indexes to
                //       improve performance if needed

                meshIdx =  ( ( gridSize * s.x ) + s.y ) % torusMeshes.length; 

                torusMeshes [ meshIdx ].isVisible = true;

            });

    }

} ( window.babylonProject = window.babylonProject || {} ));
