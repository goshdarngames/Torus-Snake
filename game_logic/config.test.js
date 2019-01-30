const test_module = require ("./config");

/****************************************************************************
 * config.test.js
 *
 * Provides tests for the configuration data.  It should not specify the
 * exact values for the data but can provide some sanity checks.
 ***************************************************************************/

/****************************************************************************
 * EXPECTED TEST VALUES
 ***************************************************************************/

/****************************************************************************
 * MOCK DATA
 ***************************************************************************/

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

describe ( "window.babylonProject.config", () =>
{
    test ( "is defined", () =>
    {
        expect ( window.babylonProject.config )
            .toBeDefined ();
    });

    test ( "defines upPos", () =>
    {
        expect ( window.babylonProject.config.upPos )
            .toBeDefined ();

        expect ( window.babylonProject.config.upPos.x )
            .toBeDefined ();

        expect ( parseFloat ( window.babylonProject.config.upPos.x ) )
            .not.toBeNaN ();

        expect ( window.babylonProject.config.upPos.y )
            .toBeDefined ();

        expect ( parseFloat ( window.babylonProject.config.upPos.y ) )
            .not.toBeNaN ();

        expect ( window.babylonProject.config.upPos.x )
            .toBeDefined ();

        expect ( parseFloat ( window.babylonProject.config.upPos.z ) )
            .not.toBeNaN ();

    });

    test ( "defines turnControlPlaneSize", () =>
    {
        expect ( parseFloat ( 
            window.babylonProject.config.turnControlPlaneSize ) )
            .not.toBeNaN ();
    });

});
