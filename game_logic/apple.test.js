const test_module = require ("./apple");

/****************************************************************************
 * apple.test.js
 ***************************************************************************/

/****************************************************************************
 * MOCK DATA
 ***************************************************************************/

/****************************************************************************
 * SETUP / TEARDOWN
 ***************************************************************************/

beforeEach ( () =>
{
    babylonProject.coordinatesEqual = jest.fn ();
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

    test ( "calls and returns the value of coordinates equal", () =>
    {
        let headPos = jest.fn ();
        let applePos = jest.fn ();

        let coordEqReturn = jest.fn ();

        babylonProject.coordinatesEqual
            .mockReturnValueOnce ( coordEqReturn );

        let retVal = babylonProject.appleEaten ( headPos, applePos );

        expect ( babylonProject.coordinatesEqual )
            .toHaveBeenCalledTimes ( 1 );

        expect ( babylonProject.coordinatesEqual.mock.calls [ 0 ]  )
            .toEqual ( [ headPos, applePos ] );

        expect ( retVal )
            .toBe ( coordEqReturn );

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

describe ( "babylonProject.moveApple", () =>
{
    test ( "is defined", () =>
    {
        expect ( babylonProject.randomApplePosition )
            .toBeDefined ();
    });
});

