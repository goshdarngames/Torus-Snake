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

let mockList = function ( length )
{
    let list = []

    for ( let i = 0; i < length; i++ )
    {
        list.push ( jest.fn () );
    }
     return list;
}

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

    test ( "validates parameters", () =>
    {
        let snakeParts = mockList ( 5 );
        let applePos = jest.fn ();
        let torusMeshes = mockList ( 10 );
        let torusCoordToMeshIdx = jest.fn ();
        let snakeMat = jest.fn ();
        let appleMat = jest.fn ();

        expect ( () => 
            window.babylonProject.updateTorusMeshes () )
            .toThrow ( "snakeParts parameter is undefined" );

        expect ( () => 
            window.babylonProject.updateTorusMeshes ( snakeParts ))
            .toThrow ( "applePos parameter is undefined" );

        expect ( () => 
            window.babylonProject.updateTorusMeshes ( 
                snakeParts, applePos ))
            .toThrow ( "torusMeshes parameter is undefined" );

        expect ( () => 
            window.babylonProject.updateTorusMeshes ( 
                snakeParts, applePos, torusMeshes ))
            .toThrow ( "torusCoordToMeshIdx parameter is undefined" );

        expect ( () => 
            window.babylonProject.updateTorusMeshes ( 
                snakeParts, applePos, torusMeshes, torusCoordToMeshIdx  ))
            .toThrow ( "snakeMat parameter is undefined" );

        expect ( () => 
            window.babylonProject.updateTorusMeshes ( 
                snakeParts, applePos, torusMeshes, torusCoordToMeshIdx,
                snakeMat  ))
            .toThrow ( "appleMat parameter is undefined" );


    });

    test ( "If there are no snakeParts then all torusMeshes have their" +
           "isVisible property set to false.", () =>
    {
        let snakeParts = [];
        let applePos = jest.fn ();
        let torusMeshes = mockList ( 10 );
        let torusCoordToMeshIdx = jest.fn ();
        let snakeMat = jest.fn ();
        let appleMat = jest.fn ();


        babylonProject.updateTorusMeshes ( 
                snakeParts, applePos, torusMeshes, torusCoordToMeshIdx,
                snakeMat, appleMat ); 

        torusMeshes.forEach ( function ( torusMesh )
        {
            expect ( torusMesh.isVisible )
                .toEqual ( false );
        });

    });

    test ( "The torusCoordToMeshIdx function is called once for each "+
           "member of snakeParts and the corresponding torusMesh isVisible "+
           "property is set to false.", () =>
    {
        let snakeParts = mockList ( 5 );
        let applePos = jest.fn ();
        let torusMeshes = mockList ( 10 );
        let torusCoordToMeshIdx = jest.fn ();
        let snakeMat = jest.fn ();
        let appleMat = jest.fn ();


        //have torusCoordToMeshIdx return a different index for each
        //snakePart

        snakeParts.forEach ( function ( val, idx )
        {
            torusCoordToMeshIdx.mockReturnValueOnce ( idx );
        });

        babylonProject.updateTorusMeshes ( 
                snakeParts, applePos, torusMeshes, torusCoordToMeshIdx,
                snakeMat, appleMat ); 

        expect ( torusCoordToMeshIdx )
            .toHaveBeenCalledTimes ( snakeParts.length );

        torusCoordToMeshIdx.mock.calls.forEach ( function ( call, idx )
        {
            expect ( call [ 0 ] )
                .toBe ( snakeParts [ idx ] );
        });

        torusMeshes.forEach ( function ( torusMesh, idx )
        {
            let expectVisible = ( idx < snakeParts.length ); 

            expect ( torusMesh.isVisible )
                .toEqual ( expectVisible );

        });

    });

});

