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
        upPos : { x : 0, y : 1.5, z : 1 },

        turnControlPlaneSize :  0.3
    };

} ( window.babylonProject = window.babylonProject || {} ));
