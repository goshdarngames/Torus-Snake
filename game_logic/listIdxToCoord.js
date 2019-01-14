/****************************************************************************
 * listIdxToCoord.js
 *
 * Provides a function that maps a set of 1 dimensional list indicies
 * to a two dimensional { x , y } coordinate tuple.
 ***************************************************************************/

( function ( babylonProject, undefined )
{
    babylonProject.listIdxToCoord = function ( idx, width, height )
    {
        let coord = 
        { 
            x : idx % width,
            y : Math.floor ( idx/width )
        }

        return coord;
    }

} ( window.babylonProject = window.babylonProject || {} ));
