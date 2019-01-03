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
    }

} ( window.babylonProject = window.babylonProject || {} ));
