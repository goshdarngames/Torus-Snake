const test_module = require ("./apple");

/****************************************************************************
 * apple.test.js
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

describe ( "babylonProject.appleEaten", () =>
{
    test ( "is defined", () =>
    {
        expect ( babylonProject.appleEaten )
            .toBeDefined ();
    });
});

describe ( "babylonProject.randomApplePosition", () =>
{
    test ( "is defined", () =>
    {
        expect ( babylonProject.randomApplePosition )
            .toBeDefined ();
    });
});

