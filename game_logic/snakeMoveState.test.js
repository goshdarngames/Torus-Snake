const startState = require ( "./snakeMoveState" );

/****************************************************************************
 * snakeMoveState.test.js
 ***************************************************************************/

/****************************************************************************
 * SETUP / TEARDOWN
 ***************************************************************************/

beforeEach ( () =>
{
    window.babylonProject.updateTorusMeshes = jest.fn ();

    window.babylonProject.config =
    {
        upPos : { x : 1, y : 1, z : 1 }
    };

    window.babylonProject.createButtonPlane = jest.fn ( function ()
    {
        retVal = 
        {
            buttonPlane   : new MockMesh (),
            button        : jest.fn (),
            buttonTexture : jest.fn ()
        };

        return retVal;
    });
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
 * EXPECTED TEST VALUES
 ***************************************************************************/

//This test data is used to check that the move function is called when
//the timer elapses and that the timer values are set correctly each time

let timerTestData = [
    { 
        snakeMoveTimerBefore : 0,
        moveFunctionsCalled  : true,
        snakeMoveTimerAfter  : 0.5
    }, 

    { 
        snakeMoveTimerBefore : 0.1,
        moveFunctionsCalled  : true,
        snakeMoveTimerAfter  : 0.5
    }, 

    { 
        snakeMoveTimerBefore : 0.2,
        moveFunctionsCalled  : false,
        snakeMoveTimerAfter  : 0.1
    }, 

    { 
        snakeMoveTimerBefore : 0.3,
        moveFunctionsCalled  : false,
        snakeMoveTimerAfter  : 0.2
    }, 

    { 
        snakeMoveTimerBefore : 0.4,
        moveFunctionsCalled  : false,
        snakeMoveTimerAfter  : 0.3
    } ] 


/****************************************************************************
 * MOCK DATA
 ***************************************************************************/

let MockBabylon = jest.fn ( function ()
{
    this.Mesh = new MockMesh ();

    this.Vector3 = jest.fn ( function ( x, y, z )
    {
        this.x = x;
        this.y = y;
        this.z = z;
    });
});

let MockMesh = jest.fn ( function ()
{
    this.position = jest.fn ();
});

let MockGameData = jest.fn ( function ()
{
    this.snakeParts = [];
    this.scene = new MockScene ();
    this.torusMeshes = [];

    this.applePos = { x : 1, y : 0 };

    this.snakeMoveInterval = 0.5;
    this.snakeMoveTimer = 0.5;

    this.engine = new MockEngine ();

    this.wrapTorusCoord = jest.fn ( function ( coord )
    {
        return coord;
    });

     

    this.currentDir = { x : 0, y : 1 };
});

let MockScene = jest.fn ( function ()
{
    this.render = jest.fn();
});

let MockEngine = jest.fn ( function ()
{
    this.getDeltaTime = jest.fn( function ()
    {
        return 0.1;
    });
});

/****************************************************************************
 * TESTS
 ***************************************************************************/

describe ( "window.babylonProject.snakeMoveState", () =>
{
    test ( "is defined", () =>
    {
        expect ( window.babylonProject.snakeMoveState )
            .toBeDefined ();
    });

    test ( "expects game data and babylon args to be defined", () =>
    {
        mock_babylon = new MockBabylon ();
        mock_gameData = new MockGameData ();

        expect ( () => 
                window.babylonProject.snakeMoveState ( mock_babylon ))
            .toThrow ( "gameData is undefined" );


        expect ( () => 
                window.babylonProject.snakeMoveState ( 
                    undefined, mock_gameData ))
            .toThrow ( "babylon is undefined" );

        mock_gameData = new MockGameData ();
        mock_gameData.snakeParts = undefined;

        expect ( () =>
                window.babylonProject.snakeMoveState (
                    mock_babylon, mock_gameData ))
            .toThrow ( "gameData.snakeParts is undefined" );

        mock_gameData = new MockGameData ();
        mock_gameData.snakeMoveInterval = undefined;

        expect ( () =>
                window.babylonProject.snakeMoveState (
                    mock_babylon, mock_gameData ))
            .toThrow ( "gameData.snakeMoveInterval is undefined" );
        
        mock_gameData = new MockGameData ();
        mock_gameData.snakeMoveTimer = undefined;

        expect ( () =>
                window.babylonProject.snakeMoveState (
                    mock_babylon, mock_gameData ))
            .toThrow ( "gameData.snakeMoveTimer is undefined" );
        
    });

    test ( "defines turnInputControls if it is undefined", () =>
    {
        mock_babylon = new MockBabylon ();
        mock_gameData = new MockGameData ();

        window.babylonProject.snakeMoveState ( mock_babylon, mock_gameData ); 

        expect ( mock_gameData.turnInputControls )
            .toBeDefined ();

        expect ( window.babylonProject.createButtonPlane )
            .toHaveBeenCalledTimes ( 1 );

        let createButtonPlaneMock = 
            window.babylonProject.createButtonPlane.mock;

        //verify up arrow

        configUp = window.babylonProject.config.upPos;

        expect ( createButtonPlaneMock.calls [ 0 ] )
            .toEqual ( [ mock_babylon, 
                    {
                        id         : "upButtonPlane",
                        buttonName : "upButton",
                        buttonText : "U" 
                    }] );

        expect ( mock_gameData.turnInputControls.upControl )
            .toBeDefined ();

        expect ( mock_gameData.turnInputControls.upControl )
            .toEqual ( createButtonPlaneMock.results [ 0 ].value );

        expect ( mock_gameData.turnInputControls.upControl
                .buttonPlane.position )
            .toEqual ( 
                new mock_babylon.Vector3 (
                           configUp.x,
                           configUp.y,
                           configUp.z ) );

    });

    test ( "scene.render is called and a function is returned every time "+
           "but update torus meshes is only called when delta time "+
           "causes the timer to elapse.",
            () =>
    {

        let mock_babylon = new MockBabylon ();

        let mock_gameData = new MockGameData ();

        //keep a count of how many times the move functions should have
        //been called during the test execution

        let expectedMoveCalls = 0;

        //mock the movesnake function and set the function to be restored
        //after

        let oldMoveFunc = window.babylonProject.moveSnake 

        window.babylonProject.moveSnake = jest.fn ( 
        function ( dir, snakeParts, wrapFunc )
        {
            return snakeParts;
        });

        oneTimeCleanUp  = () => 
        {
            window.babylonProject.moveSnake = oldMoveFunc;
        };

        timerTestData.forEach ( function ( testData, idx )
        {
            mock_gameData.snakeMoveTimer = testData.snakeMoveTimerBefore;

            let retVal = window.babylonProject.snakeMoveState ( 
                        mock_babylon, mock_gameData );

            //render should be called every time
            expect ( mock_gameData.scene.render )
                .toHaveBeenCalledTimes ( idx + 1 );

            //these functions should only be called when the snake move 
            //timer elapses

            if ( testData.moveFunctionsCalled )
            {
                expectedMoveCalls += 1;
            } 

            expect ( window.babylonProject.updateTorusMeshes )
                .toHaveBeenCalledTimes ( expectedMoveCalls );

            expect ( window.babylonProject.updateTorusMeshes )
                .toHaveBeenCalledWith ( mock_gameData );

            expect ( window.babylonProject.moveSnake )
                .toHaveBeenCalledTimes ( expectedMoveCalls );

            //the apple' y position should change each time

            expect ( mock_gameData.applePos.y )
                .toEqual ( expectedMoveCalls );

            //the return of the state function should be another function

            expect ( retVal )
                .toBeInstanceOf ( Function );
            
            //the move timer should have decreased by 0.1

            expect ( mock_gameData.snakeMoveTimer )
                .toBeCloseTo ( testData.snakeMoveTimerAfter );

            //the move interval should be unchanged

            expect ( mock_gameData.snakeMoveInterval )
                .toBeCloseTo ( 0.5 );
        });

    });

    test ( "snakeParts is correct after move.", () =>
    {
        let mock_babylon = new MockBabylon ();

        let mock_gameData = new MockGameData ();

        mock_gameData.snakeParts = [
            { x : 0, y : 0 },
            { x : 0, y : 1 },
            { x : 0, y : 2 }
        ];

        //snake parts length is unchanged

        expect ( mock_gameData.snakeParts.length )
            .toEqual ( 3 );

    });
});

describe ( "window.babylonProject.moveSnake", () =>
{
    test ( "is defined", () =>
    {
        expect ( window.babylonProject.moveSnake )
            .toBeDefined ();
    });

    test ( "updates snakePart values as expected", () =>
    {
        let dir = { x : 0, y : -1 };

        let startSnake = [ { x : 0, y : 0 },
                           { x : 0, y : 1 },
                           { x : 1, y : 1 },
                           { x : 1, y : 2 },
                           { x : 2, y : 2 } ];

        //deep copy data into snakeParts

        let snakeParts = startSnake.map ( 
                p => 
                { 
                    return { x : p.x, y : p.y };
                });

        //wrap function returns its param so it can be checked if this
        //result was stored in the output

        let wrapFunc = jest.fn ( function ( coord )
        {
            return coord;
        });

        //execute the test function
        
        let newSnake = 
            window.babylonProject.moveSnake ( dir, snakeParts, wrapFunc );

        //length unchanged
        
        expect ( newSnake.length )
            .toEqual ( startSnake.length );

        //head should be (0,0)

        expect ( newSnake [ 0 ] )
            .toEqual ( { x : 0, y : 0 } );

        //subseqent snake parts should be the result of:
        //  snakeParts [ n ] = snakeParts [ n - 1 ] + dir

        newSnake.forEach ( function ( value, idx, arr )
        {
            if ( idx == 0 )
            {
                return;
            }

            let prevCoord = arr [ idx - 1 ];

            let sumCoord = 
                { x : dir.x + prevCoord.x, y : dir.y + prevCoord.y };
        });
    });
});
