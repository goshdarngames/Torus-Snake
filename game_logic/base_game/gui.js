/****************************************************************************
 * gui.js
 *
 * Handles the creation of commonly used GUI components.
 ***************************************************************************/

( function ( babylonProject, undefined )
{

    babylonProject.createButtonPlane = function ( babylon, options )
    {
        if ( babylon == undefined )
        {
            throw ( "babylon parameter is undefined" );
        }

        if ( options == undefined )
        {
            throw ( "options parameter is undefined" );
        }

        let plane = babylon.Mesh.CreatePlane (
            options.id, options.planeSize );

        let advancedTexture = 
            babylon.GUI.AdvancedDynamicTexture.CreateForMesh ( plane );

        let button = 
            babylon.GUI.Button.CreateSimpleButton ( 
                    options.buttonName, options.buttonText );

        button.onPointerUpObservable.add ( options.buttonCall );

        let retVal =
        {
            buttonPlane   : plane,
            button        : button,
            buttonTexture : advancedTexture
        };

        return retVal;
    };

} ( window.babylonProject = window.babylonProject || {} ));
