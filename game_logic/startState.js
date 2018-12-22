/****************************************************************************
 * startState.js
 * 
 * The ./base_game/ functions define a gameLoop that expects a function
 * with no paramters each tick.
 *
 * On page load babylonProject.startState ( babylon, gameData ) is set to be
 * called.
 *
 * When called it is expected to update the game state and return a 
 * function pointer that can be called with no parameters on the next
 * update.
 *
 * By default the startState will expect the gameData to have a property
 * 'gameData.engine' that contains an instance of the BabylonJS engine 
 * created by the page loaded function.
 *
 * if gameData.scene has not beed defined the function will create it 
 * and the game objects needed.  Any extra data needed for the game will
 * be stored in gameData.
 *
 * The function will update the state and then use the javascript 
 * arrow notation to return a function pointer that can be called with no
 * paramters for the next update tick of the game loop.
 *      
 * See ./base_game/gameLoop.js for more information.
 ***************************************************************************/

( function ( babylonProject, undefined )
{
    /**
     * babylonProject.startState ( babylon, gameData)
     *
     * Updates the game's state and returns a function that can be 
     * called with no paramters for the next update.
     */
    babylonProject.startState = function ( babylon, gameData )
    {
        if ( gameData == undefined )
        {
            throw new Error ( "GameData is undefined." );
        }

        if ( gameData.engine == undefined )
        {
            throw new Error ( "Engine is undefined." );
        }

        if ( babylon == undefined )
        {
            throw new Error ( "Babylon is undefined." );
        }

        if ( gameData.scene == undefined )
        {
            //private procedure used to initialize all the game objects
            initializeGameData ( babylon, gameData );
        }

        gameData.scene.render ();

        return () => babylonProject.startState ( babylon, gameData );
    }; 

    /************************************************************************
     * PRIVATE FUNCTIONS
     ***********************************************************************/

    let initializeGameData = function ( babylon, gameData )
    {
       //create the VR scene using base_game/ createVRScene function
       gameData.scene =
           babylonProject.createVRScene ( babylon, gameData.engine );

       //create light
       gameData.light = new babylon.DirectionalLight (
               "light", 
               new babylon.Vector3 ( 0, 0.5, 1.0 ), 
               gameData.scene  );

       gameData.light.position = new babylon.Vector3 ( 0, 5, 2 );

       //Create torus
       torus_options = 
       {
           diameter : 10,
           thickness : 2
       }

       gameData.torus = babylon.MeshBuilder.CreateTorus (
               "torus", torus_options, gameData.scene );

       gameData.torus.position = new babylon.Vector3 ( 0, 2, 0 );

       //set torus material and make wireframe
       gameData.torus.material =
           new babylon.StandardMaterial ( "torusMat", gameData.scene );

       gameData.torus.material.wireframe = true;

       //create a cube for every vertex of the torus
       
       let torusVD = gameData.torus
           .getVerticesData ( babylon.VertexBuffer.PositionKind ) ;

       gameData.torusCubes = [];

       //loop through vertex position buffer 3 spaces at a time 
       //in order to read position data as float3[]

       for ( let i = 0; i < torusVD.length; i += 3 )
       {
           let cube = babylon.MeshBuilder.CreateBox (
                   `TorusCube${i}`,
                   { size : 0.1 },
                   gameData.scene );

           let vertexPos = babylon.Vector3.FromArray ( torusVD, i );

           cube.position = vertexPos.add (
                  gameData.torus.position,  );

//           cube.position = babylon.Vector3.TransformCoordinates ( 
//                  vertexPos, gameData.torus.getWorldMatrix () ); 

           gameData.torusCubes.push ( cube );
       }
       

    }
} ( window.babylonProject = window.babylonProject || {} ));
