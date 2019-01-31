/****************************************************************************
 * gui.js
 *
 * Handles the creation of commonly used GUI components.
 ***************************************************************************/

( function ( babylonProject, undefined )
{

    babylonProject.createButtonPlane = 
        function ( babylon, planeOptions, buttonOptions )
    {
        if ( babylon == undefined )
        {
            throw ( "babylon parameter is undefined" );
        }

        if ( planeOptions == undefined )
        {
            throw ( "planeOptions parameter is undefined" );
        }

        if ( buttonOptions == undefined )
        {
            throw ( "buttonOptions parameter is undefined" );
        }

        let plane = babylon.MeshBuilder.CreatePlane ( planeOptions );

        let advancedTexture = 
            babylon.GUI.AdvancedDynamicTexture.CreateForMesh ( plane );

        let button = 
            babylon.GUI.Button.CreateSimpleButton ( 
                    buttonOptions.buttonName, buttonOptions.buttonText );

        button.onPointerUpObservable.add ( buttonOptions.buttonCall );

        let retVal =
        {
            buttonPlane   : plane,
            button        : button,
            buttonTexture : advancedTexture
        };

        return retVal;
    };

} ( window.babylonProject = window.babylonProject || {} ));
