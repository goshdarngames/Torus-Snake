const test_module = require ("./snake");
!!

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

    test ( "validates direction parameters", () =>
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

    test ( "validates direction parameters", () =>
    {
        babylonProject.config.isValidDirection
            .mockReturnValueOnce ( false );

        expect ( () => babylonProject.snake.moveSnake () )
            .toThrow ( "dir is not valid direction" );
            
    });

    test ( "returns new array of same length and each item in the array"+
           "has been offset according to movement dir and wrapped", () =>
    {
        let snakeParts =  [ { x : 0, y : 0 },
                            { x : 2, y : 1 },
                            { x : 2, y : 2 },
                            { x : 3, y : 3 },
                            { x : 3, y : 4 },
                            { x : 3, y : 5 } ];

        let dir = babylonProject.config.dirUp;

        let wrapFunc = jest.fn ();

        wrapFunc.mockReturnValue ( {} );

        let newSnake = babylonProject.snake
            .moveSnake ( dir, snakeParts, wrapFunc );

        expect ( newSnake )
            .toBeInstanceOf ( Array );

        expect ( newSnake )
            .not.toBe ( snakeParts );

        expect ( newSnake.length )
            .toEqual ( snakeParts.length );

        expect ( wrapFunc )
            .toHaveBeenCalledTimes ( snakeParts.length - 1 );

        newSnake.forEach ( function ( val, idx )
        {
            if ( idx == 0 )
            {
                //head should be ( 0, 0 )
                expect ( newSnake [ idx ] )
                    .toEqual ( { x : 0, y : 0 } );

            }
            else
            {
                //wrapFunc should have been called with the sum of dir
                //and the previous snakePart

                expect ( wrapFunc.mock.calls [ idx - 1 ] [ 0 ] )
                    .toEqual ( { x : dir.x + snakeParts [ idx - 1 ].x,
                                 y : dir.y + snakeParts [ idx - 1 ].y } );

                //value in array should be result of wrapFunc
                expect ( newSnake [ idx ] )
                    .toEqual ( wrapFunc.mock.results [ idx - 1 ].value );

            }
        });
    });

});

describe ( "babylonProject.snake.turnSnake", () =>
{
    test ( "is defined", () =>
    {
        expect ( babylonProject.snake.turnSnake )
            .toBeDefined ();
    });

    test ( "returns newDir if turnAllowed returns true", () =>
    {
        let oldFunc = babylonProject.snake.turnAllowed;

        babylonProject.snake.turnAllowed = jest.fn ();

        oneTimeCleanUp = 
            () => { babylonProject.snake.turnAllowed = oldFunc; } 

        babylonProject.snake.turnAllowed.mockReturnValueOnce ( true );

        let newDir = jest.fn (); 

        let currentDir = jest.fn (); 

        expect ( babylonProject.snake.turnSnake ( newDir, currentDir ) )
            .toBe ( newDir );

    });

    test ( "returns currentDir if turnAllowed returns false", () =>
    {
        let oldFunc = babylonProject.snake.turnAllowed;

        babylonProject.snake.turnAllowed = jest.fn ();

        oneTimeCleanUp = 
            () => { babylonProject.snake.turnAllowed = oldFunc; } 

        babylonProject.snake.turnAllowed.mockReturnValueOnce ( false );

        let newDir = jest.fn (); 

        let currentDir = jest.fn (); 

        expect ( babylonProject.snake.turnSnake ( newDir, currentDir ) )
            .toBe ( currentDir );

    });

});

