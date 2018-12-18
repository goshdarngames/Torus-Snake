/****************************************************************************
 * startState.js
 *
 * When the page is loaded the initial state that the game loop will
 * enter into will be babylonProject.StartState
 *
 * The StartState object should have an update function that returns the
 * next state.  
 ***************************************************************************/

( function ( babylonProject, undefined )
{
    /**
     * StartState ( babylon )
     *
     * Constructor function for the first state the game will enter into
     * when the page is loaded.
     *
     * The update function should return the next state - it should return
     * 'this' if the state is not changing.
     */
    babylonProject.StartState = function ( babylon, engine )
    {
        if ( engine == undefined )
        {
            throw new Error ( "Engine is undefined." );
        }

        if ( babylon == undefined )
        {
            throw new Error ( "Babylon is undefined." );
        }

        let scene = babylonProject.createVRScene ( babylon, engine );

        this.update = function ()
        {
            scene.render ();

            return this;
        };
    }; 

} ( window.babylonProject = window.babylonProject || {} ));
