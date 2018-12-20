/****************************************************************************
 * startState.js
 * 
 * The ./base_game/ functions define a gameLoop that expects a function
 * with no paramters each tick.
 *
 * On page load babylonProject.startState ( babylon, engine ) is set to be
 * called.
 *
 * When called it is expected to update the game state and return a 
 * function pointer that can be called with no parameters on the next
 * update.
 *
 * By default the startState will check if the scene paramter has been
 * provided and create one if not.  The function will update the state
 * and then use the javascript arrow notation to return a function
 * pointer that will call:
 *      babylonProject.startState ( babylon, engine, scene )
 *
 * See ./base_game/gameLoop.js for more information.
 ***************************************************************************/

( function ( babylonProject, undefined )
{
    /**
     * babylonProject.startState ( babylon )
     *
     * Updates the game's state and returns a function that can be 
     * called with no paramters for the next update.
     */
    babylonProject.startState = function ( babylon, engine, scene )
    {
        if ( engine == undefined )
        {
            throw new Error ( "Engine is undefined." );
        }

        if ( babylon == undefined )
        {
            throw new Error ( "Babylon is undefined." );
        }

        if ( scene == undefined )
        {
            scene = babylonProject.createVRScene ( babylon, engine );
        
            let light = new  babylon.DirectionalLight (
                    "light", new babylon.Vector3 ( 0, 0.5, 1.0 ), scene  );

            light.position = new babylon.Vector3 ( 0, 5, 2 );

            let torus_options = 
            {
                diameter : 10,
                thickness : 2
            }

            let torus = babylon.MeshBuilder.CreateTorus (
                    "torus", torus_options, scene );

            torus.position = new babylon.Vector3 ( 0, 2, 0 );

            return () => 
                babylonProject.startState ( 
                        babylon, engine, scene  );
        }

        scene.render ();

        return () => babylonProject.startState ( babylon, engine, scene );
    }; 

} ( window.babylonProject = window.babylonProject || {} ));
