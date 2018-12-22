const startState = require ( "./startState" );

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

let MockVector3 = jest.fn ( function ()
{
    this.add = jest.fn ();
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

    this.Vector3 = jest.fn( function ()
    {
        this.add = jest.fn ();
    });
    
    this.Vector3.FromArray = function ()
    {
        return new MockVector3 ();
    }

    this.Vector3.TransformCoordinates = jest.fn ();


});

beforeEach ( () =>
{
    window.babylonProject.createVRScene = jest.fn ( function ()
    {
        return new MockScene ();
    });
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

    test ( "calling the startState function returns a function", () =>
    {
        let mock_babylon = new MockBabylon ();
        let mock_gameData = new MockGameData ();

        let retval = window.babylonProject.startState ( 
                    mock_babylon, mock_gameData );

        expect ( retval )
            .toBeInstanceOf ( Function );
        
        //The function returned should also return a function when called
        expect ( retval () )
            .toBeInstanceOf ( Function );
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
            .toBeInstanceOf ( mock_babylon.Vector3 );

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

        //check the position value was set
        let torus = mock_babylon.MeshBuilder.CreateTorus.mock.results [0]
            .value;

        expect ( torus.position )
            .toBeInstanceOf ( mock_babylon.Vector3 );

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

    });

});
