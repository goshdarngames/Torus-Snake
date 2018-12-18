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
        this.CreateBox = jest.fn(
            function ()
            {
                return new MockBox ();
            });
    });

let MockBox = jest.fn (
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
        expect ( window.babylonProject.StartState )
            .toBeDefined ();
    });

    test ( "instance has an update function", () =>
    {
        let mock_babylon = new MockBabylon ();
        let mock_engine = new MockEngine ();

        let startState = 
            new window.babylonProject.StartState ( 
                    mock_babylon, mock_engine );

        expect ( startState.update ).toBeDefined ();
    });

    test ( "error is thrown if engine or babylon is undefined", () =>
    {
        let mock_babylon = new MockBabylon ();
        let mock_engine = new MockEngine ();

        expect (() =>
                {
                    new window.babylonProject.StartState (mock_babylon)
                })
            .toThrow ("Engine is undefined.");

        expect (() =>
                {
                    new window.babylonProject.StartState (
                            undefined, mock_engine )
                })
            .toThrow ("Babylon is undefined.");
    });

    test ( "createVRScene is called during constructor "+
           "with babylon and engine as paramters", () =>
    {
       let mock_babylon = new MockBabylon ();
       let mock_engine = new MockEngine ();

       let startState = 
            new window.babylonProject.StartState ( 
                    mock_babylon, mock_engine );

       expect ( window.babylonProject.createVRScene )
           .toHaveBeenCalledTimes ( 1 );

       expect ( window.babylonProject.createVRScene )
           .toHaveBeenCalledWith ( mock_babylon, mock_engine );
    });

    test ( "instance.update() returns instance of StartState", () =>
    {
        let mock_babylon = new MockBabylon ();
        let mock_engine = new MockEngine ();

        let startState = 
            new window.babylonProject.StartState ( 
                    mock_babylon, mock_engine );

        expect ( startState.update () )
            .toBeInstanceOf (
                 window.babylonProject.StartState  );

    });


    test ( "creates instance of Directional Light", () =>
    {
        let mock_babylon = new MockBabylon ();
        let mock_engine = new MockEngine ();

        let startState = 
            new window.babylonProject.StartState ( 
                    mock_babylon, mock_engine );

        expect ( mock_babylon.DirectionalLight )
          .toHaveBeenCalledTimes ( 1 ); 

    });

});
