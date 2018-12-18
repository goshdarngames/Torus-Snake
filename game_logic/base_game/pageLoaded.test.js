const pageLoaded = require ( "./pageLoaded" );

/****************************************************************************
 * MOCK DATA
 ***************************************************************************/

MockDoc = jest.fn ( 
    function ()
    {
        this.querySelector = jest.fn( 
                function()
                {
                    return  jest.fn();
                });
    });
    
MockBabylon = jest.fn (
   function ()
   {
       this.Engine = jest.fn (
               function ()
               {
                   this.runRenderLoop = jest.fn()
               });
   });


beforeEach ( ()=>
{
    window.babylonProject.startState =
        jest.fn ( function ()
                {
                    return jest.fn ();
                });

    window.babylonProject.GameLoop = 
        jest.fn ( function ( startState ) 
                {
                    this.update = function ()
                    {
                        return 1;
                    } 
                });
});
 
/****************************************************************************
 * TESTS
 ***************************************************************************/

describe ( "window.babylonProject.pageLoaded" , () =>
{
    test ( "is defined", () =>
    {
        expect ( window.babylonProject.pageLoaded ).toBeDefined ();
    });

    test ( "calls query selector on document ref parameter", () =>
    {
        let mock_doc = new MockDoc ();

        let mock_babylon = new MockBabylon ();

        window.babylonProject.pageLoaded ( mock_doc, mock_babylon );

        expect ( mock_doc.querySelector ).toHaveBeenCalledTimes ( 1 );

        expect ( mock_doc.querySelector )
            .toHaveBeenCalledWith ( "#renderCanvas" );
        
    });

    test ( "calls window.babylonProject.createBabylonEngine",
            () =>
    {
        let mock_doc = new MockDoc ();

        let mock_babylon = new MockBabylon ();
        
        //A reference to the existing function is stored so that it can
        //be mocked without changing its functionaliy
        // - This allows jest to count how many times it has been called
        let createBabylonEngineFunc = 
            window.babylonProject.createBabylonEngine;
      
        //create mocked function using existing functionality 
        window.babylonProject.createBabylonEngine = 
            jest.fn ( createBabylonEngineFunc );

        window.babylonProject.pageLoaded ( mock_doc, mock_babylon );

        expect ( window.babylonProject.createBabylonEngine )
            .toHaveBeenCalledTimes ( 1 );
        
        //restore old function
        window.babylonProject.createBabylonEngine = createBabylonEngineFunc; 
    });

    test ( "passes canvas from documentRef.querySelector to "+
           "window.babylonProject.createBabylonEngine",
            () =>
    {
        let mock_doc = new MockDoc ();
        
        //capture return value of query selector to compare later
        let canvas = mock_doc.querySelector ("#canvas");

        //set query selector to return same value again
        mock_doc.querySelector.mockReturnValueOnce ( canvas );

        let mock_babylon = new MockBabylon ();
        
        //A reference to the existing function is stored so that it can
        //be mocked without changing its functionaliy
        // - This allows jest to inspect the parameters it was called with
        let createBabylonEngineFunc = 
            window.babylonProject.createBabylonEngine;
      
        //create mocked function using existing functionality 
        window.babylonProject.createBabylonEngine = 
            jest.fn ( createBabylonEngineFunc );

        window.babylonProject.pageLoaded ( mock_doc, mock_babylon );
    
        //check that the engine creation function was called with the
        //canvas captured earlier
        expect ( window.babylonProject.createBabylonEngine )
            .toHaveBeenCalledWith ( mock_babylon, canvas );
        
        //restore old function
        window.babylonProject.createBabylonEngine = createBabylonEngineFunc; 
    });


    test ( "calls runRenderLoop on the engine instance created.",
            () =>
    {
        let mock_doc = new MockDoc ();

        let mock_babylon = new MockBabylon ();

        //store an engine instance returned by the factory function
        engineInstance = 
            window.babylonProject.createBabylonEngine (
                    mock_babylon, jest.fn() );
      
        //store old engine creation method
        let createBabylonEngineFunc = 
            window.babylonProject.createBabylonEngine;

        //override the engine creation function 
        window.babylonProject.createBabylonEngine = 
            jest.fn ( createBabylonEngineFunc  );
 

        //mock return value to return the stored instance
        window.babylonProject.createBabylonEngine.
            mockReturnValueOnce ( engineInstance );



        window.babylonProject.pageLoaded ( mock_doc, mock_babylon );

        expect ( engineInstance.runRenderLoop )
            .toHaveBeenCalledTimes ( 1 );

        //check that the render loop was called with a function
        expect ( engineInstance.runRenderLoop.mock.calls [0][0] )
            .toBeInstanceOf ( Function );

        //try and call the function inside ( expecting state function )
        expect ( engineInstance.runRenderLoop.mock.calls [0][0] () )
            .toBeDefined ();

        //restore the old version of the engine creation function
        window.babylonProject.createBabylonEngine = createBabylonEngineFunc;
 
    });

    test ( "creates an instance of babylonProject.GameLoop", () =>
    {
        let mock_doc = new MockDoc ();

        let mock_babylon = new MockBabylon ();

        window.babylonProject.pageLoaded ( mock_doc, mock_babylon );

        expect ( window.babylonProject.GameLoop )
            .toHaveBeenCalledTimes ( 1 );

        //check that gameloop was called with a function
        expect ( window.babylonProject.GameLoop.mock.calls [0][0] )
            .toBeInstanceOf ( Function );

        //try and call the function inside ( expecting state function )
        expect ( window.babylonProject.GameLoop.mock.calls [0][0] () )
            .toBeDefined ();
    });

});

describe ( "window.babylonProject.createBabylonEngineInstance", () =>
{
    test ( "is defined", () =>
    {
        expect ( window.babylonProject.createBabylonEngine )
            .toBeDefined ();
    });

    test ( "returns instance of babylon.Engine", () =>
    {
        let mock_babylon = new MockBabylon ();
        
        let mock_canvas = jest.fn ();

        expect ( window.babylonProject.createBabylonEngine ( 
                    mock_babylon,
                    mock_canvas   ) )
            .toBeInstanceOf ( mock_babylon.Engine );
    });

    test ( "calls Engine constructor with (canvas, true) params", () =>
    {
        let mock_babylon = new MockBabylon ();
        
        let mock_canvas = 1234;

        window.babylonProject.createBabylonEngine ( 
                    mock_babylon,
                    mock_canvas   );

        expect ( mock_babylon.Engine )
            .toHaveBeenCalledWith ( mock_canvas, true );
    });

    test ( "throws an error is canvas is undefined", () =>
    {
        let mock_babylon = new MockBabylon ();
        
        let mock_canvas = undefined;
        
        expect ( () => 
                {

                    window.babylonProject.createBabylonEngine ( 
                        mock_babylon,
                        mock_canvas   );
                }).toThrow ();

    });


});
