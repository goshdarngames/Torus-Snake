const startState = require ( "./startState" );
/****************************************************************************
 * EXPECTED TEST VALUES
 ***************************************************************************/

let expectedTorusPosition = { x : 0, y : 1, z : 0 };

let expectedTorusOptions = 
{
    diameter : 3,
    thickness : 0.75,
    tessellation : 16
};

/****************************************************************************
 * MOCK DATA
 ***************************************************************************/
let MockGameData = jest.fn ( function ()
{
    this.engine = new MockEngine ();
});

let MockEngine = jest.fn ();

let MockScene = jest.fn ();

let MockVRHelper = jest.fn ( function ()
{
    this.enableInteractions = jest.fn ();
});

let MockVector3 = jest.fn ( function (x, y, z)
{
    this.x = x;
    this.y = y;
    this.z = z;

    this.add = jest.fn ();

    this.add = jest.fn (function (other)
    {
        return new MockVector3 ( this.x + other.x,
                                 this.y + other.y,
                                 this.z + other.z );
    });
 
});    

let MockMeshBuilder = jest.fn ( function ()
{
    this.CreateTorus = jest.fn( function ()
    {
        torus =  new MockMesh ();

        //The torus mesh buffer will be read during scene creation
        //this will mock a torus with tesselation of 10
        //i.e. a 10x10x3 float buffer in a flat array
        //
        //The torus will have one extra vertex for each dimension of the
        //grid so the 10x10 vertex list should provide a 9x9 list of
        //torus meshes.
        //
        //The mesh duplicates vertices when it wraps.
                
        torus.getVerticesData = jest.fn ( function ()
        {
            vertData = [];

            for ( let i = 0; i < 300; i++ )
            {
                vertData.push ( i );
            }

            return vertData;
        });

        return torus;
    });

    this.CreateSphere = jest.fn(
    function ()
    {
        return new MockMesh ();
    });

});

let MockMesh = jest.fn ( function ()
{
    this.position = { x:0, y:0, z:0 };

    this.getWorldMatrix = jest.fn ();
});

MockBabylon = jest.fn ( function ()
{
    this.MeshBuilder = new MockMeshBuilder (); 

    this.DirectionalLight = jest.fn ();

    this.VertexBuffer = jest.fn();

    this.VertexBuffer.PositionKind = jest.fn();

    this.StandardMaterial = jest.fn ( function ( name )
    {
        this.name = name;
        this.wireframe = false;
    });

    //Mock Babylon has its own Vector3 constructor
    //this is because there were problems when trying to add
    //'static' methods to the mock.

    this.Vector3 = jest.fn( function (x, y, z)
    {
        return new MockVector3 ( x, y, z );
    });
    
    this.Vector3.FromArray = function ( array, i)
    {
        return new MockVector3 ( array[i], array[i+1], array[i+2] );
    }

    this.Vector3.TransformCoordinates = jest.fn ();

    this.Color3 = jest.fn ( function ( r, g, b )
    {
        this.r = r;
        this.g = g;
        this.b = b;
    });

});

beforeEach ( () =>
{
    window.babylonProject.createVRScene = jest.fn ( function ()
    {
        let retVal = 
        {
            scene    : new MockScene (),
            vrHelper : new MockVRHelper ()
        };

        return retVal;
    });

    window.babylonProject.createSnakeState = jest.fn ();

    window.babylonProject.listIdxToCoord = jest.fn ();

    window.babylonProject.coordToListIdx = jest.fn ();

    window.babylonProject.wrapCoordinate = jest.fn ();
})

/****************************************************************************
 * TESTS
 ***************************************************************************/

describe ( "window.babylonProject.startState", () =>
{
    test ( "is defined", () =>
    {
        expect ( window.babylonProject.startState )
            .toBeDefined ();
    });


    test ( "error is thrown if babylon, gamedata or engine is undefined",
            () =>
    {
        let mock_babylon = new MockBabylon ();
        let mock_gameData = new MockGameData ();
         
        expect (() =>
                {
                    window.babylonProject.startState (
                            mock_babylon, undefined )
                })
            .toThrow ("GameData is undefined.");

        expect (() =>
                {
                    window.babylonProject.startState (
                            undefined, mock_gameData )
                })
            .toThrow ("Babylon is undefined.");
        expect (() =>
                {
                    window.babylonProject
                        .startState (mock_babylon, jest.fn())
                })
            .toThrow ("Engine is undefined.");
    });

    test ( "scene is created ", () =>
    {
        let mock_babylon = new MockBabylon ();
        let mock_gameData = new MockGameData ();
 
        mock_gameData.scene = undefined;
        mock_gameData.vrHelper = undefined;

        window.babylonProject.startState ( 
                     mock_babylon, mock_gameData );
 
        expect ( window.babylonProject.createVRScene )
            .toHaveBeenCalledTimes ( 1 );
 
        expect ( window.babylonProject.createVRScene )
            .toHaveBeenCalledWith ( mock_babylon, mock_gameData.engine );
 
        let createVRSceneResult = 
            window.babylonProject.createVRScene.mock.results [ 0 ].value;

        //expect scene to be stored in gameData
        expect ( mock_gameData.scene )
            .toBe ( createVRSceneResult.scene ); 
        
        //expect vrHelper to be stored in gameData
        expect ( mock_gameData.vrHelper )
            .toBe ( createVRSceneResult.vrHelper ); 
        
        //expect enable interactions to have been called on vrHelper
        expect ( mock_gameData.vrHelper.enableInteractions )
            .toHaveBeenCalledTimes ( 1 );
 
    });

    test ( "creates instance of Directional Light "+
           "and sets its position.", () =>
    {
        let mock_babylon = new MockBabylon ();
        let mock_gameData = new MockGameData ();

        mock_gameData.scene = undefined;

        window.babylonProject.startState ( 
                    mock_babylon, mock_gameData );

        expect ( mock_babylon.DirectionalLight )
          .toHaveBeenCalledTimes ( 1 ); 

        //check ID was first parameter
        expect ( mock_babylon.DirectionalLight.mock.calls[0][0] )
            .toBe ( "light" );

        //check the position value was set
        let light = mock_babylon.DirectionalLight.mock.instances [0];

        expect ( light.position )
            .toBeInstanceOf ( MockVector3 );

    });


    test ( "creates instance of Torus mesh"+
           "and sets its position and material.", () =>
    {
        let mock_babylon = new MockBabylon ();
        let mock_gameData = new MockGameData ();

        mock_gameData.scene = undefined;

        window.babylonProject.startState ( 
                    mock_babylon, mock_gameData );

        expect ( mock_babylon.MeshBuilder.CreateTorus )
            .toHaveBeenCalledTimes ( 1 ); 

        //check ID was first parameter
        expect ( mock_babylon.MeshBuilder.CreateTorus.mock.calls [0][0] )
            .toBe ( "torus" );

        //check the expected options were the second paramter

        torusOptionsCall =
            mock_babylon.MeshBuilder.CreateTorus.mock.calls [0][1];
        
        expect ( torusOptionsCall.diameter )
            .toBe ( expectedTorusOptions.diameter );

        expect ( torusOptionsCall.thickness )
            .toBe ( expectedTorusOptions.thickness );

        expect ( torusOptionsCall.tessellation )
            .toBe ( expectedTorusOptions.tessellation );

        //check the scene was the third paramter
        expect ( mock_babylon.MeshBuilder.CreateTorus.mock.calls [0][2] )
            .toBe ( mock_gameData.scene );

        //check the position value was set
        let torus = mock_babylon.MeshBuilder.CreateTorus.mock.results [0]
            .value;

        expect ( torus.position )
            .toBeInstanceOf ( MockVector3 );

        expect ( torus.position.x ).toBe ( expectedTorusPosition.x );
        expect ( torus.position.y ).toBe ( expectedTorusPosition.y );
        expect ( torus.position.z ).toBe ( expectedTorusPosition.z );

        //check the material was set
        expect ( mock_babylon.StandardMaterial )
            .toHaveBeenCalled ();

        expect ( torus.material )
            .toBe ( mock_gameData.torusMat );

        expect ( torus.material.wireframe )
            .toBe ( true );


    });

    test ( "creates a mesh for each torus vertex excluding "+
           "the duplicate vertices where the mesh wraps.", () =>
    {
        let mock_babylon = new MockBabylon ();
        let mock_gameData = new MockGameData ();

        mock_gameData.scene = undefined;

        window.babylonProject.startState ( 
                    mock_babylon, mock_gameData );

        //the torus mesh with have 100 vertices ( 10 ^ 2 )
        //there will be duplicate meshes along each axis so the 
        //torusMeshes list should have ( 9 ^ 2 ) elements

        expect ( mock_babylon.MeshBuilder.CreateSphere )
            .toHaveBeenCalledTimes ( 81 );

        expect ( mock_gameData.torusMeshes )
            .toBeDefined ();

        //check that the meshes were returned by create sphere
        //note:  assumes that the torus meshes are the first objects 
        //       created with the CreateSphere method

        mock_babylon.MeshBuilder.CreateSphere.mock.results.forEach(
            function ( result, index )
            {
                expect ( result.value )
                    .toBe ( mock_gameData.torusMeshes [ index ] );
            }
        );

        //check the parameters that create box was called with

        mock_babylon.MeshBuilder.CreateSphere.mock.calls.forEach(
            function ( call, index )
            {
                expect ( call [0] ).toBe ( "TorusMesh"+index );

                expect ( call [1].diameter  )
                    .toBeCloseTo ( 0.1 );

                expect ( call [2] ).toBe ( mock_gameData.scene );

            }
        );

    });

    test ( "sets positions of torus meshes correctly", () =>
    {
        let mock_babylon = new MockBabylon ();
        let mock_gameData = new MockGameData ();

        mock_gameData.scene = undefined;

        window.babylonProject.startState ( 
                    mock_babylon, mock_gameData );

        expect ( mock_gameData.torusMeshes.length )
            .toEqual ( 81 );

        //The mock torus mesh is composed of values 0..99 in a 1D list
        //Each of these is converted into babylon vector3 values
        //so for each row of 10 torus vertices there are 30 values for
        //each vector component
        let valuesPerRow = 30;

        //The previous x value is stored so that the order of x values
        //can be checked ( e.g. check that the last value in each
        //column was skipped )
        //
        //Start at -6 because it would be the prevX for 0
        let prevX = -6;

        mock_gameData.torusMeshes.forEach (
        function ( mesh, idx )
        {
            //There should be no multiples of 10 as first vector value
            //i.e. The last column of vertices was skipped

            expect ( mesh.position.x >= 0 )
                .toBeTruthy ();

            expect ( ( mesh.position.x + 1 ) % valuesPerRow )
                .not.toEqual ( 0 );

            //The three vector components should be ( n, n+1, n+2 )
            //where n is the torusPositon + vertex position data

            //isolate the vertex data
            let vertex =
            {
                x : mesh.position.x - expectedTorusPosition.x, 
                y : mesh.position.y - expectedTorusPosition.y, 
                z : mesh.position.z - expectedTorusPosition.z
            }

            expect ( vertex.y )
                .toEqual ( vertex.x + 1 );

            expect ( vertex.z )
                .toEqual ( vertex.x + 2 );

            //check x values to asset the last value of each row was 
            //skipped

            if ( ( prevX + 6 ) % valuesPerRow == 0 )
            {
                expect ( vertex.x )
                    .toEqual ( prevX + 6 );
            }
            else
            {
                expect ( vertex.x )
                    .toEqual ( prevX + 3 );
            }

            prevX = vertex.x;

        });

    });

    test ( "initializes material data", () =>
    {
        let mock_babylon = new MockBabylon ();
        let mock_gameData = new MockGameData ();

        mock_gameData.scene = undefined;

        window.babylonProject.startState ( 
                    mock_babylon, mock_gameData );

        //expected number of materials
        expect ( mock_babylon.StandardMaterial )
            .toHaveBeenCalledTimes ( 3 );

        //torus material
        expect ( mock_gameData.torusMat )
            .toBeDefined ();

        expect ( mock_gameData.torusMat )
            .toBeInstanceOf ( mock_babylon.StandardMaterial );

        expect ( mock_gameData.torusMat.name )
            .toBe ( "torusMat" );

        //snake material
        expect ( mock_gameData.snakeMat )
            .toBeDefined ();

        expect ( mock_gameData.snakeMat )
            .toBeInstanceOf ( mock_babylon.StandardMaterial );

        expect ( mock_gameData.snakeMat.name )
            .toBe ( "snakeMat" );

        expect ( mock_gameData.snakeMat.diffuseColor )
            .toBeInstanceOf ( mock_babylon.Color3 );

        expect ( mock_gameData.snakeMat.diffuseColor.r )
            .toBe ( 0 );

        expect ( mock_gameData.snakeMat.diffuseColor.g )
            .toBe ( 255 );

        expect ( mock_gameData.snakeMat.diffuseColor.b )
            .toBe ( 0 );

        //apple material
        expect ( mock_gameData.appleMat )
            .toBeDefined ();

        expect ( mock_gameData.appleMat )
            .toBeInstanceOf ( mock_babylon.StandardMaterial );

        expect ( mock_gameData.appleMat.name )
            .toBe ( "appleMat" );

        expect ( mock_gameData.appleMat.diffuseColor )
            .toBeInstanceOf ( mock_babylon.Color3 );

        expect ( mock_gameData.appleMat.diffuseColor.r )
            .toBe ( 255 );

        expect ( mock_gameData.appleMat.diffuseColor.g )
            .toBe ( 0 );

        expect ( mock_gameData.appleMat.diffuseColor.b )
            .toBe ( 0 );

    });

    test ( "returns a function that calls createSnakeState", () =>
    {
        let mock_babylon = new MockBabylon ();
        let mock_gameData = new MockGameData ();

        //when the current state is called it should return a function
        //that calls the next state function

        let retVal = window.babylonProject.startState ( 
                    mock_babylon, mock_gameData );

        expect ( retVal )
            .toBeInstanceOf ( Function );

        //check the next state function was not called during the current
        //state function

        expect ( window.babylonProject.createSnakeState )
            .not.toHaveBeenCalled ();

        //call the returned function and check the next state was called

        retVal ();

        expect ( window.babylonProject.createSnakeState )
            .toHaveBeenCalledTimes ( 1 );
    });

    test ( "creates mapping functions for torus and snake indexes", () =>
    {

        let mock_babylon = new MockBabylon ();
        let mock_gameData = new MockGameData ();

        window.babylonProject.startState ( mock_babylon, mock_gameData );

        //mesh list idx -> coordinates
       
        expect ( mock_gameData.meshIdxToTorusCoord )
            .toBeDefined ();

        expect ( mock_gameData.meshIdxToTorusCoord )
            .toBeInstanceOf ( Function );

        //call the stored function 
        mock_gameData.meshIdxToTorusCoord ( 0 );
        
        expect ( window.babylonProject.listIdxToCoord )
            .toHaveBeenCalledTimes ( 1 );

        //check correct parameters are passed to the function 
        mock_gameData.meshIdxToTorusCoord ( 5 );
        
        expect ( window.babylonProject.listIdxToCoord )
            .toHaveBeenCalledTimes ( 2 );

        expect ( window.babylonProject.listIdxToCoord )
            .toHaveBeenLastCalledWith ( 5, 9, 81 );

        //coordinates -> mesh list idx
       
        expect ( mock_gameData.torusCoordToMeshIdx )
            .toBeDefined ();

        expect ( mock_gameData.torusCoordToMeshIdx )
            .toBeInstanceOf ( Function );

        //call the stored function 
        mock_gameData.torusCoordToMeshIdx ( 0 );
        
        expect ( window.babylonProject.coordToListIdx )
            .toHaveBeenCalledTimes ( 1 );

        //check correct parameters are passed to the function 

        let testCoord = { x : 1, y : 1 };

        mock_gameData.torusCoordToMeshIdx ( testCoord );
        
        expect ( window.babylonProject.coordToListIdx )
            .toHaveBeenCalledTimes ( 2 );

        expect ( window.babylonProject.coordToListIdx )
            .toHaveBeenLastCalledWith ( testCoord, 9, 81 );

        //wrap coordinates function

        expect ( mock_gameData.wrapTorusCoord )
            .toBeDefined ();

        expect ( mock_gameData.wrapTorusCoord )
            .toBeInstanceOf ( Function );

        //call the stored function

        mock_gameData.wrapTorusCoord ( testCoord );

        expect ( window.babylonProject.wrapCoordinate )
            .toHaveBeenCalledTimes ( 1 );
        
        expect ( window.babylonProject.wrapCoordinate )
            .toHaveBeenCalledWith ( testCoord, 9, 9 ); 
    });

    test ( "initializes applePos as { x:2, y:1 }", () =>
    {

        let mock_babylon = new MockBabylon ();
        let mock_gameData = new MockGameData ();

        window.babylonProject.startState ( mock_babylon, mock_gameData );

        expect ( mock_gameData.applePos ).toBeDefined ();

        expect ( mock_gameData.applePos.x ).toBe ( 2 );
        expect ( mock_gameData.applePos.y ).toBe ( 1 );

    });

    test ( "initializes snakeMoveInterval and snakeMoveTimer", () =>
    {

        let mock_babylon = new MockBabylon ();
        let mock_gameData = new MockGameData ();

        window.babylonProject.startState ( mock_babylon, mock_gameData );

        expect ( mock_gameData.snakeMoveInterval ).toBe ( 750 );
        expect ( mock_gameData.snakeMoveTimer ).toBe ( 750 );

    });

    test ( "initializes directions", () =>
    {

        let mock_babylon = new MockBabylon ();
        let mock_gameData = new MockGameData ();

        window.babylonProject.startState ( mock_babylon, mock_gameData );

        expect ( mock_gameData.dirLeft  ).toEqual ( { x :  0, y :  1 } );
        expect ( mock_gameData.dirRight ).toEqual ( { x :  0, y : -1 } );
        expect ( mock_gameData.dirUp    ).toEqual ( { x : -1, y :  0 } );
        expect ( mock_gameData.dirDown  ).toEqual ( { x :  1, y :  0 } );

        expect ( mock_gameData.currentDir ).toEqual ( { x : 0, y : 1 } );

    });

});
