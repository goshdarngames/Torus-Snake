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

//creates a list of MockMeshes of n size
let ValidMeshes = function ( n )
{
    valid_meshes = [];

    for ( i = 0; i < n; i++ )
    {
        valid_meshes.push ( new MockMesh () );
    }

    return valid_meshes;
}

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
                ( ValidMeshes(1), undefined, 0 ) )
            .toThrow ( "snakeParts should be a list of tuples" );


        //meshes.length < snakeParts.length
        expect ( () => 
            window.babylonProject.updateTorusMeshes
                ( ValidMeshes(1), valid_snakeParts, 0 ) )
            .toThrow ( "meshes.length should be >= snakeParts.length" );

        //headIndex within bounds of meshes

        expect ( () => 
            window.babylonProject.updateTorusMeshes
                ( ValidMeshes( 10 ), valid_snakeParts, -1 ) )
            .toThrow ( "headIndex is not a valid index of meshes" );

        expect ( () => 
            window.babylonProject.updateTorusMeshes
                ( ValidMeshes( 10 ), valid_snakeParts, 11 ) )
            .toThrow ( "headIndex is not a valid index of meshes" );

    });
});
