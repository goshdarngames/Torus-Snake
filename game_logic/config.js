/****************************************************************************
 * config.js
 *
 * Provides access to configuration data.  Things such as object sizes,
 * colours and positions can be defined here so they can be adjusted 
 * during development.
 ***************************************************************************/

( function ( babylonProject, undefined )
{

    babylonProject.config = 
    {
        snakeMoveInitialInterval : 1200,

        //directions the snake turn buttons should move the snake
        
        dirUp    : { x :  1, y :  0 },
        dirDown  : { x : -1, y :  0 },
        dirLeft  : { x :  0, y :  1 },
        dirRight : { x :  0, y : -1 },

        //position of the up arrow button plane
        upPos : { x : 0, y : 1.5, z : 1 },

        turnControlPlaneSize :  0.3
    };

} ( window.babylonProject = window.babylonProject || {} ));
