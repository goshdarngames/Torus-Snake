const test_module = require ("./listIdxToCoord");

/****************************************************************************
 * listIdxToCoord.js
 *
 * Tests the mapping of list indexes to coordinates with a variety
 * of array sizes and shapes.
 ***************************************************************************/

/****************************************************************************
 * MOCK DATA
 ***************************************************************************/

//A collection of lists with different shapes
//The lists are all 1-dimensional lists but laying them out like this
//should help understand the expected results.

let listA = [ 0, 1, 2,
              3, 4, 5,
              6, 7, 8 ];

let listB = [ 0, 1,
              2, 3,
              4, 5,
              6, 7,
              8, 9 ];

let listC = [ 0, 1, 2 ];

let listD = [ 0,
              1,
              2 ];

//This list of data represents the values the test function will
//call the listIdxToCoord function with and what results it should

let testCallData = [

    //first index
    { idx : 0, width : 3, list : listA, coord : { x:0, y:0 }},
    { idx : 0, width : 2, list : listB, coord : { x:0, y:0 }},
    { idx : 0, width : 3, list : listC, coord : { x:0, y:0 }},
    { idx : 0, width : 1, list : listD, coord : { x:0, y:0 }},

    //middle index
    { idx : 4, width : 3, list : listA, coord : { x:1, y:1 }},
    { idx : 4, width : 2, list : listB, coord : { x:0, y:2 }},
    { idx : 1, width : 3, list : listC, coord : { x:1, y:0 }},
    { idx : 1, width : 1, list : listD, coord : { x:0, y:1 }},

    //final index
    { idx : 8, width : 3, list : listA, coord : { x:2, y:2 }},
    { idx : 9, width : 2, list : listB, coord : { x:1, y:4 }},
    { idx : 2, width : 3, list : listC, coord : { x:2, y:0 }},
    { idx : 2, width : 1, list : listD, coord : { x:0, y:2 }},
];

/****************************************************************************
 * TESTS
 ***************************************************************************/

describe ( "window.babylonProject.listIdxToCoord", () =>
{
    test ( "is defined", () =>
    {
        expect ( window.babylonProject.listIdxToCoord )
            .toBeDefined ();
    });


    test ( "test function with valid paramters from testCallData", () =>
    {
        testCallData.forEach ( function ( testData )
        {
            let idx = testData.idx;
            let width = testData.width;

            let ret = 
                window.babylonProject.listIdxToCoord ( idx, width );

            expect ( ret.x ).toBe ( testData.coord.x );
            expect ( ret.y ).toBe ( testData.coord.y );
        });
    });

    test ( "test function with out of bounds data", () =>
    {
        expect ( () =>
                window.babylonProject.listIdxToCoord ( -1, 2 ) )
            .toThrow ( "idx must be >= 0" );

        expect ( () =>
                window.babylonProject.listIdxToCoord ( 1, 0 ) )
            .toThrow ( "width must be >= 0" );

    });
});

describe ( "window.babylonProject.coordToListIdx", () =>
{
    test ( "is defined", () =>
    {
        expect ( window.babylonProject.coordToListIdx )
            .toBeDefined ();
    });

    test ( "test function with valid paramters from testCallData", () =>
    {
        testCallData.forEach ( function ( testData )
        {
            let coord = testData.coord;
            let width = testData.width;

            let ret = 
                window.babylonProject.coordToListIdx ( coord, width );

            expect ( ret ).toBe ( testData.idx );

        });
    });
});
