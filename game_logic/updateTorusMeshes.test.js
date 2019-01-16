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

let MockGameData = jest.fn ( function ()
{
    this.snakeParts = valid_snakeParts;

    this.torusMeshes = ValidMeshes ( 25 );

    this.snakeMat = jest.fn ();
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

    test ( "checks that gameData has expected properties", () =>
    {
        let mock_gameData = new MockGameData ();

        //game data undefined
        expect ( () => 
            window.babylonProject.updateTorusMeshes ( undefined ))
            .toThrow ( "gameData parameter is undefined" );

        //snakeParts undefined
        mock_gameData = new MockGameData ();

        mock_gameData.snakeParts = undefined;

        expect ( () => 
            window.babylonProject.updateTorusMeshes ( mock_gameData ))
            .toThrow ( "gameData.snakeParts should be a list of "+
                       "tuples" );

        //meshes undefined
        mock_gameData = new MockGameData ();

        mock_gameData.torusMeshes = undefined;

        expect ( () => 
            window.babylonProject.updateTorusMeshes ( mock_gameData ))
            .toThrow ( "gameData.torusMeshes should be a list "+
                       "of meshes with length >= gameData.snakeParts" );

        //meshes.length < snakeParts.length
        mock_gameData = new MockGameData ();
        
        mock_gameData.torusMeshes = ValidMeshes ( 2 );

        expect ( () => 
            window.babylonProject.updateTorusMeshes ( mock_gameData ))
            .toThrow ( "gameData.torusMeshes.length should "+
                       "be >= gameData.snakeParts.length" );

        //torusMeshes.length is a square number
        mock_gameData = new MockGameData ();

        mock_gameData.torusMeshes = ValidMeshes ( 6 );

        expect ( () => 
            window.babylonProject.updateTorusMeshes ( mock_gameData ))
            .toThrow ( "gameData.torusMeshes.length should "+
                       "be square number" );

    });

    test ( "sets snake meshes as visible and others as not", () =>
    {
        let mock_gameData = new MockGameData ();

        //the mesh is assumed to be square so size is the root of that
        gridSize = 5;

        let torusMeshes = mock_gameData.torusMeshes;

        window.babylonProject.updateTorusMeshes ( mock_gameData );

        valid_snakeParts.forEach ( 
            function ( s )
            {
                meshIdx =  ( ( gridSize * s.x ) + s.y ) % torusMeshes.length; 

                expect ( torusMeshes [ meshIdx ].isVisible )
                    .toBe ( true )
                
                expect ( torusMeshes [ meshIdx ].material )
                    .toBe ( mock_gameData.snakeMat );

                //set the visibility to false after so next check can 
                //test that all cells are invisible

                torusMeshes [ meshIdx ].isVisible = false;

            });

        //expect all meshes isVisible to be false after checking snake
        //snake cells

        torusMeshes.forEach ( 
            function ( mesh )
            {
                expect ( mesh.isVisible ).toBe ( false );
            });

    });
});


describe ( "window.babylonProject.disableTorusMesh", () =>
{
    test ( "is defined", () =>
    {
        expect ( window.babylonProject.disableTorusMesh )
            .toBeDefined ();
    });

    test ( "validates parameters", () =>
    {
        expect ( () => window.babylonProject.disableTorusMesh ( 
                    0, undefined ) )
            .toThrow ( "gameData is undefined" );

        let mock_gameData = new MockGameData ();
        
        mock_gameData.torusMeshes = undefined;

        expect ( () => window.babylonProject.disableTorusMesh ( 
                    0, mock_gameData ) )
            .toThrow ( "gameData.torusMeshes is undefined" );

        mock_gameData = new MockGameData ();

        expect ( () => window.babylonProject.disableTorusMesh ( 
                    -1, mock_gameData ) )
            .toThrow ( "meshIdx outside torus mesh list range" );

        mock_gameData = new MockGameData ();

        expect ( () => window.babylonProject.disableTorusMesh ( 
                    54, mock_gameData ) )
            .toThrow ( "meshIdx outside torus mesh list range" );

    });

    test ( "sets the mesh at meshIdx isVisible property to false", () =>
    {
        let mock_gameData = new MockGameData ();

        window.babylonProject.disableTorusMesh ( 7, mock_gameData );

        //check idx 7 is visible was set and others are undefined

        mock_gameData.torusMeshes.forEach ( 
            function ( mesh, idx )
            {
                if ( idx != 7 )
                {
                    expect ( mesh.isVisible ).not.toBeDefined ();
                }
                else
                {
                    expect ( mesh.isVisible ).toBe ( false );
                }
            });
    });
});
