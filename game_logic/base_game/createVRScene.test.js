const createVRScene = require ("./createVRScene");

/****************************************************************************
 * MOCK DATA
 ***************************************************************************/
MockBabylon = jest.fn (
    function ()
    {
        this.Scene = jest.fn (
                function ()
                {
                    this.createDefaultEnvironment = jest.fn ();
                    this.createDefaultVRExperience = jest.fn ();
                });
    });

MockEngine = jest.fn (
    
    function ()
    {

    });


/****************************************************************************
 * TESTS
 ***************************************************************************/

describe ( "window.babylonProject.createVRScene", () =>
{
    test ( "is defined", () =>
    {
        expect ( window.babylonProject.createVRScene ).toBeDefined ();
    });

    test ( "returns instance of BABYLON.Scene", () =>
    {
        mockBabylon = new MockBabylon ();
        mockEngine = new MockEngine ();

        returnValue = window.babylonProject.createVRScene (
                mockBabylon,
                mockEngine    );

        expect ( returnValue ).toBeInstanceOf ( mockBabylon.Scene );
    });

    test ( "passed engine to Scene constructor", () =>
    {
        mockBabylon = new MockBabylon ();
        mockEngine = new MockEngine ();

        window.babylonProject.createVRScene (
                mockBabylon,
                mockEngine    );

        expect ( mockBabylon.Scene )
            .toBeCalledWith ( mockEngine );
    });


    test ( "calls scene.createDefaultEnvironment", () =>
    {
        mockBabylon = new MockBabylon ();
        mockEngine = new MockEngine ();

        let scene = window.babylonProject.createVRScene (
                mockBabylon,
                mockEngine    );

        expect ( scene.createDefaultEnvironment )
            .toBeCalledTimes ( 1 );
    });
  
    test ( "calls scene.createDefaultVRExperience", () =>
    {
        mockBabylon = new MockBabylon ();
        mockEngine = new MockEngine ();

        let scene =  window.babylonProject.createVRScene (
                mockBabylon,
                mockEngine    );

        expect ( scene.createDefaultVRExperience )
            .toBeCalledTimes ( 1 );
    });
    

})
