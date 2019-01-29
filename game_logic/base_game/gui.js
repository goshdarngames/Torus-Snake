/****************************************************************************
 * gui.js
 *
 * Handles the creation of commonly used GUI components.
 ***************************************************************************/

( function ( babylonProject, undefined )
{

    babylonProject.createButtonPlane = function ( babylon )
    {

        let defaultOptions = 
        {
            id         : "buttonPlane",
            buttonText : "Click Here",
            planeSize  : 2
        };

        if ( babylon == undefined )
        {
            throw ( "babylon parameter is undefined" );
        }

        let plane = babylon.Mesh.CreatePlane (
            defaultOptions.id, defaultOptions.planeSize );

        let advancedTexture = 
            babylon.GUI.AdvancedDynamicTexture.CreateForMesh ( plane );

        let retVal =
        {
            buttonPlane   : plane,
            buttonTexture : advancedTexture
        };

        return retVal;
    };

} ( window.babylonProject = window.babylonProject || {} ));
