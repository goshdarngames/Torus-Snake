const test_module = require ("./gui");

/****************************************************************************
 * gui.test.js
 ***************************************************************************/

/****************************************************************************
 * EXPECTED TEST VALUES
 ***************************************************************************/

/****************************************************************************
 * MOCK DATA
 ***************************************************************************/

let MockBabylon = jest.fn ( function ()
{
    this.GUI = 
    {
        Button : 
        {
            CreateSimpleButton : jest.fn ( function ()
            {
                return new MockButton ();
            })
        },
        AdvancedDynamicTexture :
        {
            CreateForMesh : jest.fn ( function ()
            {
                return new MockAdvancedDynamicTexture ();
            })
        }
    };

    this.Mesh =
    {
        CreatePlane : jest.fn ( function ()
        {
            return new MockMesh ();
        })
    };
});

let MockMesh = jest.fn ();

let MockButton = jest.fn ( function ()
{
    this.onPointerUpObservable = 
    {
        add : jest.fn ()
    };

});

let MockAdvancedDynamicTexture = jest.fn ( function ()
{
});

let defaultOptions = function ()
{
    retVal = 
    {
        id         : "buttonPlane",
        buttonName : "buttonPlaneButton",
        buttonText : "Click Here",
        buttonCall : jest.fn (),
        planeSize  : 2
    }

    return retVal;
};

/****************************************************************************
 * SETUP / TEARDOWN
 ***************************************************************************/

beforeEach ( () =>
{
});

//Tests can assign a function here to have it called after they exit
let oneTimeCleanUp = () => {};

afterEach ( () =>
{
    //execute the one time cleanup and then set it as an empty function
    //again
 
    oneTimeCleanUp ();

    oneTimeCleanUp  = () => {};
});

/****************************************************************************
 * TESTS
 ***************************************************************************/

describe ( "window.babylonProject.createButtonPlane", () =>
{
    test ( "is defined", () =>
    {
        expect ( window.babylonProject.createButtonPlane )
            .toBeDefined ();
    });

    test ( "validates args", () =>
    {
        let mock_babylon = new MockBabylon ();
        
        expect ( () => window.babylonProject.createButtonPlane () )
            .toThrow ( "babylon parameter is undefined" );

        expect ( () => 
            window.babylonProject.createButtonPlane ( mock_babylon ) )
            .toThrow ( "options parameter is undefined" );

        //validate options

        //id

        let opt = defaultOptions ();

        opt.id = undefined;

        expect ( () => 
            window.babylonProject.createButtonPlane ( 
                mock_babylon, opt ) )
            .toThrow ( "options.id should be a string" );

        opt.id = 123;

        expect ( () => 
            window.babylonProject.createButtonPlane ( 
                mock_babylon, opt ) )
            .toThrow ( "options.id should be a string" );

        //buttonName

        opt = defaultOptions ();

        opt.buttonName = undefined;

        expect ( () => 
            window.babylonProject.createButtonPlane ( 
                mock_babylon, opt ) )
            .toThrow ( "options.buttonName should be a string" );

        opt.buttonName = 123;

        expect ( () => 
            window.babylonProject.createButtonPlane ( 
                mock_babylon, opt ) )
            .toThrow ( "options.buttonName should be a string" );

        //buttonText

        opt = defaultOptions ();

        opt.buttonText = undefined;

        expect ( () => 
            window.babylonProject.createButtonPlane ( 
                mock_babylon, opt ) )
            .toThrow ( "options.buttonText should be a string" );

        opt.buttonText = 123;

        expect ( () => 
            window.babylonProject.createButtonPlane ( 
                mock_babylon, opt ) )
            .toThrow ( "options.buttonText should be a string" );

        //buttonCall

        opt = defaultOptions ();

        opt.buttonCall = undefined;

        expect ( () => 
            window.babylonProject.createButtonPlane ( 
                mock_babylon, opt ) )
            .toThrow ( "options.buttonCall should be a function" );

        opt.buttonCall = 123;

        expect ( () => 
            window.babylonProject.createButtonPlane ( 
                mock_babylon, opt ) )
            .toThrow ( "options.buttonCall should be a function" );

        //planeSize

        opt = defaultOptions ();

        opt.planeSize = undefined;

        expect ( () => 
            window.babylonProject.createButtonPlane ( 
                mock_babylon, opt ) )
            .toThrow ( "options.planeSize should be a number" );

        opt.planeSize = "123";

        expect ( () => 
            window.babylonProject.createButtonPlane ( 
                mock_babylon, opt ) )
            .toThrow ( "options.planeSize should be a number" );

    });

    test ( "creates and returns button", () =>
    {
        let mock_babylon = new MockBabylon ();

        let options = defaultOptions ();

        let retVal = 
            window.babylonProject.createButtonPlane ( 
                    mock_babylon, options );

        expect ( retVal )
            .toBeDefined ();

        //check button plane was created and returned

        expect ( mock_babylon.Mesh.CreatePlane )
            .toHaveBeenCalledTimes ( 1 );

        expect ( mock_babylon.Mesh.CreatePlane )
            .toHaveBeenCalledWith (
                    options.id, options.planeSize );

        expect ( retVal.buttonPlane )
            .toBeDefined ();

        expect ( retVal.buttonPlane )
            .toBe ( mock_babylon.Mesh.CreatePlane
                .mock.results [ 0 ].value ); 

        //check advanced texture was created and returned

        expect ( mock_babylon.GUI.AdvancedDynamicTexture.CreateForMesh )
            .toHaveBeenCalledTimes ( 1 );

        expect ( mock_babylon.GUI.AdvancedDynamicTexture.CreateForMesh )
            .toHaveBeenCalledWith ( retVal.buttonPlane );

        expect ( retVal.buttonTexture )
            .toBeDefined ();

        expect ( retVal.buttonTexture )
            .toBe ( mock_babylon.GUI.AdvancedDynamicTexture.CreateForMesh
                .mock.results [ 0 ].value ); 

        //check button was created and returned

        expect ( mock_babylon.GUI.Button.CreateSimpleButton )
            .toHaveBeenCalledTimes ( 1 );

        expect ( mock_babylon.GUI.Button.CreateSimpleButton )
            .toHaveBeenCalledWith ( 
                    options.buttonName, options.buttonText );

        expect ( retVal.button )
            .toBeDefined ();

        expect ( retVal.button )
            .toBe ( mock_babylon.GUI.Button.CreateSimpleButton
                .mock.results [ 0 ].value ); 

        //check buttonCall is set to the function from the options

        expect ( options.buttonCall )
            .toHaveBeenCalledTimes ( 0 );

        expect ( retVal.button.onPointerUpObservable.add )
            .toHaveBeenCalledTimes ( 1 );

        expect ( retVal.button.onPointerUpObservable.add )
            .toHaveBeenCalledWith ( options.buttonCall );

    });

});
