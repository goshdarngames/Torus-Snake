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
    this.scene = new MockScene ();
});

let MockEngine = jest.fn ( function ()
{
});

let MockScene = jest.fn ( function ()
{
    this.render = jest.fn();
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

    this.CreateBox = jest.fn(
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


});

beforeEach ( () =>
{
    window.babylonProject.createVRScene = jest.fn ( function ()
    {
        return new MockScene ();
    });

    window.babylonProject.createSnakeState = jest.fn ();
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

    test ( "if scene is undefined it is created ", () =>
    {
        let mock_babylon = new MockBabylon ();
        let mock_gameData = new MockGameData ();
 
        mock_gameData.scene = undefined;

        window.babylonProject.startState ( 
                     mock_babylon, mock_gameData );
 
        expect ( window.babylonProject.createVRScene )
            .toHaveBeenCalledTimes ( 1 );
 
        expect ( window.babylonProject.createVRScene )
            .toHaveBeenCalledWith ( mock_babylon, mock_gameData.engine );
 
        //expect scene to be stored in gameData
        expect ( mock_gameData.scene )
            .toBeInstanceOf ( MockScene );
        
        window.babylonProject.startState ( 
                     mock_babylon, mock_gameData );
 
        //expect scene not to be created again
        expect ( window.babylonProject.createVRScene )
            .toHaveBeenCalledTimes ( 1 );
 
    });

    test ( "if scene is found in game data then scene.render is called",
            () =>
    {
        let mock_babylon = new MockBabylon ();

        let mock_gameData = new MockGameData ();


        window.babylonProject.startState ( 
                    mock_babylon, mock_gameData );

        expect ( mock_gameData.scene.render ).toHaveBeenCalledTimes ( 1 );

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

        //check ID was firt parameter
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
            .toBeInstanceOf ( mock_babylon.StandardMaterial );

        expect ( torus.material.name )
            .toBe ( "torusMat" );

        expect ( torus.material.wireframe )
            .toBe ( true );


    });

    test ( "creates a cube for each torus vertex", () =>
    {
        let mock_babylon = new MockBabylon ();
        let mock_gameData = new MockGameData ();

        mock_gameData.scene = undefined;

        window.babylonProject.startState ( 
                    mock_babylon, mock_gameData );

        //the mesh mock will have 100 mock vertices
        expect ( mock_babylon.MeshBuilder.CreateBox )
            .toHaveBeenCalledTimes ( 100 );

        expect ( mock_gameData.torusCubes )
            .toBeDefined ();

        //check that the cubes were returned by create box
        //note:  assumes that the torus cubes are the first objects 
        //       created with the CreateBox method

        mock_babylon.MeshBuilder.CreateBox.mock.results.forEach(
            function ( result, index )
            {
                expect ( result.value )
                    .toBe ( mock_gameData.torusCubes [ index ] );
            }
        );

        //check the parameters that create box was called with

        mock_babylon.MeshBuilder.CreateBox.mock.calls.forEach(
            function ( call, index )
            {
                expect ( call [0] ).toBe ( "TorusCube"+index );

                expect ( call [1].size  )
                    .toBeCloseTo ( 0.1 );

                expect ( call [2] ).toBe ( mock_gameData.scene );

            }
        );

    });

    test ( "sets positions of torus cubes correctly", () =>
    {
        let mock_babylon = new MockBabylon ();
        let mock_gameData = new MockGameData ();

        mock_gameData.scene = undefined;

        window.babylonProject.startState ( 
                    mock_babylon, mock_gameData );

        mock_gameData.torusCubes.forEach (
            function ( cube, index )
            {
                //cubes are created from vector3 so their index needs to
                //be adjusted
                let cubeIdx = index * 3;

                expect ( cube.position.x )
                    .toBeCloseTo ( cubeIdx + expectedTorusPosition.x );

                expect ( cube.position.y )
                    .toBeCloseTo ( cubeIdx + 1 + expectedTorusPosition.y );

                expect ( cube.position.z )
                    .toBeCloseTo ( cubeIdx + 2 + expectedTorusPosition.z );

            });

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
});
