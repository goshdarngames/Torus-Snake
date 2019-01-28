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
    this.GUI = new MockGUI ();
});

let MockGUI = jest.fn ( function ()
{
    this.Button = new MockButton ();

    this.AdvancedDynamicTexture = new MockAdvancedDynamicTexture ();
});

let MockButton = jest.fn ( function ()
{
    this.CreateSimpleButton = jest.fn ();
});

let MockAdvancedDynamicTexture = jest.fn ( function ()
{
    this.CreateForMesh = jest.fn ();
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

});
