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

    this.applePos = { x : 2, y : 2 };

    this.torusMeshes = ValidMeshes ( 25 );

    this.snakeMat = jest.fn ();

    this.torusCoordToMeshIdxCallCount = 0;

    this.torusCoordToMeshIdx = jest.fn ( function ()
    {
        return this.torusCoordToMeshIdxCallCount++;
    });
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

        //replace enable/disable functions with mocks
        let oldDisableFunc = babylonProject.disableTorusMesh;
        let oldEnableFunc = babylonProject.enableTorusMesh;

        babylonProject.disableTorusMesh = jest.fn ();
        babylonProject.enableTorusMesh = jest.fn ();

        //set oneTimeCleanUp to restore functions
        
        oneTimeCleanUp = () => 
        {
            babylonProject.disableTorusMesh = oldDisableFunc; 
            babylonProject.enableTorusMesh = oldEnableFunc;
        }

        window.babylonProject.updateTorusMeshes ( mock_gameData );

        //Check that every torus mesh was disabled

        expect ( babylonProject.disableTorusMesh )
            .toHaveBeenCalledTimes ( 25 );

        babylonProject.disableTorusMesh.mock.calls.forEach ( 
            function ( call, idx )
            {
                expect ( call [ 0 ] )
                    .toBe ( idx );

                expect ( call [ 1 ] )
                    .toBe ( mock_gameData );

            });

        //check the first 5 calls to the coordinate mapping function are
        //the snake parts

        expect ( mock_gameData.torusCoordToMeshIdx )
            .toHaveBeenCalledTimes ( 6 );

        mock_gameData.torusCoordToMeshIdx.mock.calls.forEach (
            function ( call, idx )
            {
                if ( idx < 5 )
                {
                    expect ( call [ 0 ] )
                        .toBe ( mock_gameData.snakeParts [ idx ]);
                }
            });

        //expect enableTorusMesh to have been called 5 times with each
        //call referencing the meshIdx for a snakePart

        expect ( babylonProject.enableTorusMesh )
            .toHaveBeenCalledTimes ( 6 );

        babylonProject.enableTorusMesh.mock.calls.forEach ( 
            function ( call, idx )
            {
                if ( idx > 4 )
                {
                    return;
                }

                //check that the idx was the result of converting
                //a torus coord ( from the snake ) to a meshIdx
                expect ( call [ 0 ] )
                    .toBe ( mock_gameData.torusCoordToMeshIdx.mock.
                        results [ idx ].value );

                expect ( call [ 1 ] )
                    .toBe ( mock_gameData.snakeMat );

                expect ( call [ 2 ] )
                    .toBe ( mock_gameData );

            });

    });

    test ( "sets apple mesh as visible", () =>
    {
        let mock_gameData = new MockGameData ();

        //replace enable/disable functions with mocks
        let oldDisableFunc = babylonProject.disableTorusMesh;
        let oldEnableFunc = babylonProject.enableTorusMesh;

        babylonProject.disableTorusMesh = jest.fn ();
        babylonProject.enableTorusMesh = jest.fn ();

        //set oneTimeCleanUp to restore functions
        
        oneTimeCleanUp = () => 
        {
            babylonProject.disableTorusMesh = oldDisableFunc; 
            babylonProject.enableTorusMesh = oldEnableFunc;
        }

        window.babylonProject.updateTorusMeshes ( mock_gameData );

        //expect the 6th call to the coord to mesh function to be the apple

        let idxCall = mock_gameData.torusCoordToMeshIdx.mock.calls [ 5 ];

        expect ( idxCall [ 0 ] ).toBe ( mock_gameData.applePos );

        let appleIdx = mock_gameData.torusCoordToMeshIdx.mock
            .results [ 5 ].value;

        //expect the final call to enableTorusMesh to be the apple

        let call = babylonProject.enableTorusMesh.mock.calls [ 5 ];

        expect ( call [ 0 ] ).toBe ( appleIdx );
        expect ( call [ 1 ] ).toBe ( mock_gameData.appleMat );
        expect ( call [ 2 ] ).toBe ( mock_gameData );

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

describe ( "window.babylonProject.enableTorusMesh", () =>
{
    test ( "is defined", () =>
    {
        expect ( window.babylonProject.enableTorusMesh )
            .toBeDefined ();
    });

    test ( "validates parameters", () =>
    {
        expect ( () => window.babylonProject.enableTorusMesh ( 
                    0, undefined, undefined ) )
            .toThrow ( "gameData is undefined" );

        let mock_gameData = new MockGameData ();
        
        mock_gameData.torusMeshes = undefined;

        expect ( () => window.babylonProject.enableTorusMesh ( 
                    0, undefined, mock_gameData ) )
            .toThrow ( "gameData.torusMeshes is undefined" );

        mock_gameData = new MockGameData ();

        expect ( () => window.babylonProject.enableTorusMesh ( 
                    -1, undefined, mock_gameData ) )
            .toThrow ( "meshIdx outside torus mesh list range" );

        mock_gameData = new MockGameData ();

        expect ( () => window.babylonProject.enableTorusMesh ( 
                    54, undefined, mock_gameData ) )
            .toThrow ( "meshIdx outside torus mesh list range" );

        expect ( () => window.babylonProject.enableTorusMesh ( 
                    0, undefined, mock_gameData ) )
            .toThrow ( "material undefined" );

    });

    test ( "sets the mesh at meshIdx isVisible property to true "+
           "and sets material.", () =>
    {
        let mock_gameData = new MockGameData ();

        let mock_material = jest.fn ();

        window.babylonProject.enableTorusMesh ( 
                7, mock_material, mock_gameData );

        //check idx 7 was changed and others are unaffected

        mock_gameData.torusMeshes.forEach ( 
            function ( mesh, idx )
            {
                if ( idx != 7 )
                {
                    expect ( mesh.isVisible ).not.toBeDefined ();
                    expect ( mesh.material ).not.toBeDefined ();
                }
                else
                {
                    expect ( mesh.isVisible ).toBe ( true );
                    expect ( mesh.material ).toBe ( mock_material );
                }
            });
    });
});
