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
                         { x : 1, y : 1 }, 
                         { x : 1, y : 2 }, 
                         { x : 2, y : 2 } ];

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
        //snakeParts undefined
        expect ( () => 
            window.babylonProject.updateTorusMeshes
                ( undefined, undefined, 0 ) )
            .toThrow ( "snakeParts should be a list of tuples" );

        //meshes undefined
        expect ( () => 
            window.babylonProject.updateTorusMeshes
                ( undefined, valid_snakeParts, 0 ) )
            .toThrow ( "meshes paramter should be a list of meshes with " +
                       "length >= snakeParts" );

        //meshes.length < snakeParts.length
        expect ( () => 
            window.babylonProject.updateTorusMeshes
                ( ValidMeshes( 4 ), valid_snakeParts, 0 ) )
            .toThrow ( "meshes.length should be >= snakeParts.length" );

        //meshes.length is a square number
        expect ( () => 
            window.babylonProject.updateTorusMeshes
                ( ValidMeshes( 13 ), valid_snakeParts, 0 ) )
            .toThrow ( "meshes.length should be square number" );

        //headIndex within bounds of meshes

        expect ( () => 
            window.babylonProject.updateTorusMeshes
                ( ValidMeshes( 9 ), valid_snakeParts, -1 ) )
            .toThrow ( "headIndex is not a valid index of meshes" );

        expect ( () => 
            window.babylonProject.updateTorusMeshes
                ( ValidMeshes( 9 ), valid_snakeParts, 11 ) )
            .toThrow ( "headIndex is not a valid index of meshes" );

    });

    test ( "sets snake meshes as visible and others as not", () =>
    {
        meshes = ValidMeshes ( 25 );

        //the mesh is assumed to be square so size is the root of that
        meshSize = 5;

        window.babylonProject
            .updateTorusMeshes ( meshes, valid_snakeParts, 5);

        valid_snakeParts.forEach ( 
            function ( s )
            {
                meshIdx =  ( ( meshSize * s.x ) + s.y ) % meshes.length; 

                expect ( 
                    meshes [ meshIdx ]
                        .isVisible )
                    .toBe ( true )
                
                //set the visibility to false after so next check can 
                //test that all cells are invisible

                meshes [ meshIdx ].isVisible = false;

            });

        //expect all meshes isVisible to be false after checking snake
        //snake cells

        meshes.forEach ( 
            function ( mesh )
            {
                expect ( mesh.isVisible ).toBe ( false );
            });

    });
});
