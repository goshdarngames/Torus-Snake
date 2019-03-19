/****************************************************************************
 * apple.js
 *
 * $DESCRIPTION
 ***************************************************************************/

( function ( babylonProject, undefined )
{

    babylonProject.appleEaten = function ( headPos, applePos )
    {
        return false;
    };

    babylonProject.randomApplePosition = 
        function ( width, height, snakeParts )
    {
        return { x : 2, y : 1 };
    };

} ( window.babylonProject = window.babylonProject || {} ));
