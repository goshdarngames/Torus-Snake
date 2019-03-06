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


    });

    test ( "If there are no snakeParts then all torusMeshes have their" +
           "isVisible property set to false.", () =>
    {
        let snakeParts = [];
        let applePos = jest.fn ();
        let torusMeshes = mockList ( 10 );
        let torusCoordToMeshIdx = jest.fn ();

        babylonProject.updateTorusMeshes ( 
                snakeParts, applePos, torusMeshes, torusCoordToMeshIdx ); 

        torusMeshes.forEach ( function ( torusMesh )
        {
            expect ( torusMesh.isVisible )
                .toEqual ( false );
        });

    });
});

