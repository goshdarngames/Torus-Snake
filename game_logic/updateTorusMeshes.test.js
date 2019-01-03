const test_module = require ("./updateTorusMeshes");

/****************************************************************************
 * updateTorusMeshes.test.js
 ***************************************************************************/

/****************************************************************************
 * EXPECTED TEST VALUES
 ***************************************************************************/

/****************************************************************************
 * MOCK DATA
 ***************************************************************************/

let valid_snakeParts = [ { x : 0, y : 0 }, 
                         { x : 1, y : 0 }, 
                         { x : 2, y : 0 } ];

let MockMesh = jest.fn ();

let valid_meshes = [];

beforeEach ( () =>
    function ()
    {
        //re-create the list of mock meshes each test so their mock calls
        //are reset

        valid_meshes = [];

        for ( i = 0; i < 10; i++ )
        {
            valid_meshes.push ( new MockMesh () );
        }
    });

/****************************************************************************
 * TESTS
 ***************************************************************************/

describe ( "window.babylonProject.updateTorusMeshes", () =>
{

    test ( "is defined", () =>
    {
        expect ( window.babylonProject.updateTorusMeshes )
            .toBeDefined ();
    });

    test ( "checks parameters are correct", () =>
    {
        //meshes undefined
        expect ( () => 
            window.babylonProject.updateTorusMeshes
                ( undefined, valid_snakeParts, 0 ) )
            .toThrow ( "meshes paramter should be a list of meshes with " +
                       "length >= snakeParts" );


        //snakeParts undefined
        expect ( () => 
            window.babylonProject.updateTorusMeshes
                ( valid_meshes, undefined, 0 ) )
            .toThrow ( "snakeParts should be a list of tuples" );

        //meshes.length < snakeParts.length
        expect ( () => 
            window.babylonProject.updateTorusMeshes
                ( [ valid_meshes [0] ], valid_snakeParts, 0 ) )
            .toThrow ( "meshes.length should be >= snakeParts.length" );

    });
});
