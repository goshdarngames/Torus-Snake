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

beforeEach ( () =>
{
    window.babylonProject.config =
    {
        dirUp    : { x : -1, y :  0 },
        dirDown  : { x :  1, y :  0 },
        dirLeft  : { x :  0, y :  1 },
        dirRight : { x :  0, y : -1 },

        isValidDirection : jest.fn ()
    };

    window.babylonProject.config.isValidDirection
        .mockReturnValue ( true );
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

    test ( "validates parameters", () =>
    {
        babylonProject.config.isValidDirection
            .mockReturnValueOnce ( false );

        expect ( () => babylonProject.snake.turnAllowed () )
            .toThrow ( "newDir is not valid direction" );
            
        babylonProject.config.isValidDirection
            .mockReturnValueOnce ( true );

        babylonProject.config.isValidDirection
            .mockReturnValueOnce ( false );

        expect ( () => babylonProject.snake.turnAllowed () )
            .toThrow ( "currentDir is not valid direction" );
            
    });

    test ( "returns true if directions are perpindicular", () =>
    {
        let config = window.babylonProject.config;

        let u = config.dirUp;
        let d = config.dirDown;
        let l = config.dirLeft;
        let r = config.dirRight;

        let trueTestCases = [ [ u, r ], [ u, l ], [ d, r ], [ d, l ] ];

        let falseTestCases = [ [ u, u ], [ u, d ], [ d, d ], 
                               [ r, l ], [ r, r ], [ l, l ] ];

        //test cases expected to be true:

        trueTestCases.forEach ( function ( testCase )
        {
            //test each pair of directions

            expect ( babylonProject.snake.turnAllowed ( 
                        testCase [ 0 ], testCase [ 1 ] ) )
                .toEqual ( true );

            //test the reverse of each test case

            expect ( babylonProject.snake.turnAllowed ( 
                        testCase [ 1 ], testCase [ 0 ] ) )
                .toEqual ( true );

        });

        //test cases expected to be false:

        falseTestCases.forEach ( function ( testCase )
        {
            //test each pair of directions

            expect ( babylonProject.snake.turnAllowed ( 
                        testCase [ 0 ], testCase [ 1 ] ) )
                .toEqual ( false );

            //test the reverse of each test case

            expect ( babylonProject.snake.turnAllowed ( 
                        testCase [ 1 ], testCase [ 0 ] ) )
                .toEqual ( false );

        });

    });

});

describe ( "babylonProject.snake.moveSnake", () =>
{
    test ( "is defined", () =>
    {
        expect ( babylonProject.snake.moveSnake )
            .toBeDefined ();
    });

    test ( "validates parameters", () =>
    {
        babylonProject.config.isValidDirection
            .mockReturnValueOnce ( false );

        expect ( () => babylonProject.snake.moveSnake () )
            .toThrow ( "dir is not valid direction" );
            
    });

    test ( "", () =>
    {
    });

    test ( "", () =>
    {
    });

    test ( "", () =>
    {
    });

});

describe ( "babylonProject.snake.turnSnake", () =>
{
    test ( "is defined", () =>
    {
        expect ( babylonProject.snake.turnSnake )
            .toBeDefined ();
    });

    test ( "", () =>
    {
    });

    test ( "", () =>
    {
    });

    test ( "", () =>
    {
    });

    test ( "", () =>
    {
    });

});

