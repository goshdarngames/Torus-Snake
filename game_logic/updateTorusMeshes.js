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
    babylonProject.updateTorusMeshes =  
        function 
        (
             meshes, 
             snakeParts, 
             headIndex 
        )
    {

        if ( snakeParts == undefined )
        {
            throw (  "snakeParts should be a list of tuples" );
        }
        
        if ( meshes == undefined )
        {
            throw ( "meshes paramter should be a list of meshes with " +
                    "length >= snakeParts" );
        }

        if ( meshes.length < snakeParts.length )
        {
            throw ( "meshes.length should be >= snakeParts.length" );
        }

        if ( headIndex < 0 || headIndex >= meshes.length )
        {
            throw ( "headIndex is not a valid index of meshes" );
        }

        meshSize = Math.sqrt ( meshes.length );

        if ( !Number.isInteger ( meshSize ) )
        {
            throw  ( "meshes.length should be square number" );
        }

        //set all meshes to be invisble
        meshes.forEach ( 
            function ( mesh )
            {
                mesh.isVisible = false;
            });

        //set the snake meshes to be visible
        snakeParts.forEach (
            function ( s )
            {
                //note:  could potentially cache these indexes to
                //       improve performance if needed

                meshIdx =  ( ( meshSize * s.x ) + s.y ) % meshes.length; 

                meshes [ meshIdx ].isVisible = true;

            });

    }

} ( window.babylonProject = window.babylonProject || {} ));
