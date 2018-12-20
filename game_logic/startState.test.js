const startState = require ( "./startState" );

/****************************************************************************
 * MOCK DATA
 ***************************************************************************/

let MockEngine = jest.fn (
    function ()
    {
    });

let MockScene = jest.fn (
    function ()
    {
        this.render = jest.fn();
    });

let MockMeshBuilder = jest.fn (
    function ()
    {
        this.CreateTorus = jest.fn(
            function ()
            {
                return new MockTorus ();
            });
    });

let MockTorus = jest.fn (
    function ()
    {
        this.position = { x:0, y:0, z:0 };
    });

MockBabylon = jest.fn (
    function ()
    {
        this.MeshBuilder = new MockMeshBuilder (); 

        this.DirectionalLight = jest.fn ();

        this.Vector3 = jest.fn ();
    });

beforeEach ( () =>
{
    window.babylonProject.createVRScene = jest.fn (
            function ()
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


    test ( "error is thrown if engine or babylon is undefined", () =>
    {
        let mock_babylon = new MockBabylon ();
        let mock_engine = new MockEngine ();

        expect (() =>
                {
                    window.babylonProject.startState (mock_babylon)
                })
            .toThrow ("Engine is undefined.");

        expect (() =>
                {
                    window.babylonProject.startState (
                            undefined, mock_engine )
                })
            .toThrow ("Babylon is undefined.");
    });

    test ( "if scene is undefined it is created ", () =>
    {
       let mock_babylon = new MockBabylon ();
       let mock_engine = new MockEngine ();

       window.babylonProject.startState ( 
                    mock_babylon, mock_engine );

       expect ( window.babylonProject.createVRScene )
           .toHaveBeenCalledTimes ( 1 );

       expect ( window.babylonProject.createVRScene )
           .toHaveBeenCalledWith ( mock_babylon, mock_engine );

       //call startState again with mock scene
       window.babylonProject.startState ( 
                    mock_babylon, mock_engine, new MockScene () );

       //expect scene not to be created again
       expect ( window.babylonProject.createVRScene )
           .toHaveBeenCalledTimes ( 1 );

    });

    test ( "if startState is called with scene then scene.render is called",
            () =>
    {
        let mock_babylon = new MockBabylon ();
        let mock_engine = new MockEngine ();
        let mock_scene = new MockScene ();


       window.babylonProject.startState ( 
                    mock_babylon, mock_engine, mock_scene );

       expect ( mock_scene.render ).toHaveBeenCalledTimes ( 1 );

    });

    test ( "calling the startState function returns a function", () =>
    {
        let mock_babylon = new MockBabylon ();
        let mock_engine = new MockEngine ();

        let retval = window.babylonProject.startState ( 
                    mock_babylon, mock_engine );

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
        let mock_engine = new MockEngine ();

        window.babylonProject.startState ( 
                    mock_babylon, mock_engine );

        expect ( mock_babylon.DirectionalLight )
          .toHaveBeenCalledTimes ( 1 ); 

        //check ID was firt parameter
        expect ( mock_babylon.DirectionalLight.mock.calls[0][0] )
            .toBe ( "light" );

        //check the position value was set
        let light = mock_babylon.DirectionalLight.mock.instances [0];

        expect ( light.position )
            .toBeInstanceOf ( mock_babylon.Vector3 );

    });


    test ( "creates instance of Torus mesh"+
           "and sets its position.", () =>
    {
        let mock_babylon = new MockBabylon ();
        let mock_engine = new MockEngine ();

        window.babylonProject.startState ( 
                    mock_babylon, mock_engine );

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

    });
});
