const test_module = require ("./gui");

/****************************************************************************
 * gui.test.js
 ***************************************************************************/

/****************************************************************************
 * EXPECTED TEST VALUES
 ***************************************************************************/

let defaultOptions = 
{
    id         : "buttonPlane",
    buttonText : "Click Here",
    planeSize  : 2
};

/****************************************************************************
 * MOCK DATA
 ***************************************************************************/

let MockBabylon = jest.fn ( function ()
{
    this.GUI = 
    {
        Button : 
        {
            CreateSimpleButton : jest.fn ()
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
});

let MockAdvancedDynamicTexture = jest.fn ( function ()
{
});

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
        expect ( () => window.babylonProject.createButtonPlane () )
            .toThrow ( "babylon parameter is undefined" );
    });

    test ( "creates and returns button", () =>
    {
        let mock_babylon = new MockBabylon ();

        let retVal = 
            window.babylonProject.createButtonPlane ( mock_babylon );

        expect ( retVal )
            .toBeDefined ();

        //check button plane was created and returned

        expect ( mock_babylon.Mesh.CreatePlane )
            .toHaveBeenCalledTimes ( 1 );

        expect ( mock_babylon.Mesh.CreatePlane )
            .toHaveBeenCalledWith (
                    defaultOptions.id, defaultOptions.planeSize );

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

    });

});
