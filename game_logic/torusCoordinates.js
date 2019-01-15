/****************************************************************************
 * listIdxToCoord.js
 *
 * Provides a function that maps a set of 1 dimensional list indicies
 * to a two dimensional { x , y } coordinate tuple.
 *
 * The tests for the module have some examples of the functions with
 * various shapes of array
 ***************************************************************************/

( function ( babylonProject, undefined )
{
    babylonProject.listIdxToCoord = function ( idx, width )
    {
        if ( idx < 0 )
        {
            throw ( "idx must be >= 0" );
        }

        if ( width < 1 )
        {
            throw ( "width must be >= 0" );
        }

        let coord = 
        { 
            x : idx % width,
            y : Math.floor ( idx/width )
        }

        return coord;
    }
    
    babylonProject.coordToListIdx = function ( coord, width )
    {
        return ( width * coord.y ) + coord.x;
    };

} ( window.babylonProject = window.babylonProject || {} ));
