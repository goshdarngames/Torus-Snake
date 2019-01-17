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
        function ( mesh, idx )
        {
            babylonProject.disableTorusMesh ( idx, gameData );
        });

        //set the snake torusMeshes to be visible
        gameData.snakeParts.forEach (
        function ( s )
        {
            let meshIdx = gameData.torusCoordToMeshIdx ( s );

            babylonProject.enableTorusMesh ( 
                    meshIdx, gameData.snakeMat, gameData );
        });
    }

    babylonProject.disableTorusMesh = function ( meshIdx, gameData )
    {
        if ( gameData == undefined )
        {
            throw ( "gameData is undefined" );
        }

        if ( gameData.torusMeshes == undefined )
        {
            throw ( "gameData.torusMeshes is undefined" );
        }

        if ( meshIdx < 0 || meshIdx > gameData.torusMeshes.length )
        {
            throw ( "meshIdx outside torus mesh list range" );
        }

        gameData.torusMeshes [ meshIdx ].isVisible = false;

    }

    babylonProject.enableTorusMesh = function ( meshIdx, material, gameData )
    {
        if ( gameData == undefined )
        {
            throw ( "gameData is undefined" );
        }

        if ( gameData.torusMeshes == undefined )
        {
            throw ( "gameData.torusMeshes is undefined" );
        }

        if ( meshIdx < 0 || meshIdx > gameData.torusMeshes.length )
        {
            throw ( "meshIdx outside torus mesh list range" );
        }

        if ( material == undefined )
        {
            throw ( "material undefined" );
        }

        gameData.torusMeshes [ meshIdx ].isVisible = true;

        gameData.torusMeshes [ meshIdx ].material = material;
    }

} ( window.babylonProject = window.babylonProject || {} ));
