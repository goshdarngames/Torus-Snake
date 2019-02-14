const test_module = require ("./snake");

/****************************************************************************
 * snake.test.js
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

describe ( "babylonProject.snake", () =>
{
    test ( "is defined", () =>
    {
        expect ( babylonProject.snake )
            .toBeDefined ();
    });
});

describe ( "babylonProject.snake.turnAllowed", () =>
{
    test ( "is defined", () =>
    {
        expect ( babylonProject.snake.turnAllowed )
            .toBeDefined ();
    });
});

