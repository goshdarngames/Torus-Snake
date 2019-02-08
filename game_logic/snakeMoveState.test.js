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
        dirUp    : { x : -1, y :  0 },
        dirDown  : { x :  1, y :  0 },
        dirLeft  : { x :  0, y :  1 },
        dirRight : { x :  0, y : -1 },

        isValidDirection : jest.fn (),

        upPos    : { x : -1, y :  0 },
        downPos  : { x :  1, y :  0 },
        leftPos  : { x :  0, y :  1 },
        rightPos : { x :  0, y : -1 },

        upPos : { x : 1, y : 1, z : 1 },

        turnControlPlaneSize : 5
    };

    window.babylonProject.config.isValidDirection
       .mockReturnValue ( true ); 

    window.babylonProject.createButtonPlane = jest.fn ( function ()
    {
        retVal = 
        {
            buttonPlane   : new MockMesh (),
            button        : new MockButton (),
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

    this.isEnabled = jest.fn ();
});

let MockButton = jest.fn ( function ()
{
    this.isEnabled = true;
    this.isVisible = true;
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

    this.currentDir = window.babylonProject.config.dirUp;
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
        
        mock_gameData = new MockGameData ();
        mock_gameData.currentDir = undefined;

        expect ( () =>
                window.babylonProject.snakeMoveState (
                    mock_babylon, mock_gameData ))
            .toThrow ( "gameData.currentDir is undefined" );
        
        mock_gameData = new MockGameData ();
        
        window.babylonProject.config.isValidDirection
            .mockReturnValueOnce ( false );

        expect ( () =>
                window.babylonProject.snakeMoveState (
                    mock_babylon, mock_gameData ))
            .toThrow ( "gameData.currentDir is not valid direction" );
        
    });

    test ( "defines turnInputControls if it is undefined", () =>
    {
        //shorter name for config

        let config = window.babylonProject.config;
        
        //test cases

        let testCases = 
        [
            { 
                buttonDir   : config.dirUp,
                buttonName  : "up",
                buttonText  : "U",
                controlName : "upControl",
                buttonPos   : config.upPos
            },

            { 
                buttonDir   : config.dirDown,
                buttonName  : "down",
                buttonText  : "D",
                controlName : "downControl",
                buttonPos   : config.downPos
            },


            { 
                buttonDir   : config.dirLeft,
                buttonName  : "left",
                buttonText  : "L",
                controlName : "leftControl",
                buttonPos   : config.leftPos
            },

            { 
                buttonDir   : config.dirRight,
                buttonName  : "right",
                buttonText  : "R",
                controlName : "rightControl",
                buttonPos   : config.rightPos
            }
        ];

        //mock data

        mock_babylon = new MockBabylon ();
        mock_gameData = new MockGameData ();

        //replace turnSnake with a mock function so the button callback
        //can be tested

        let oldTurnSnake = window.babylonProject.turnSnake;

        window.babylonProject.turnSnake = jest.fn ();

        oneTimeCleanUp = () => 
            window.babylonProject.turnSnake = oldTurnSnake;

        //executing the function for the first time should cause the
        //buttons to be created

        window.babylonProject.snakeMoveState ( mock_babylon, mock_gameData ); 

        expect ( mock_gameData.turnInputControls )
            .toBeDefined ();

        expect ( window.babylonProject.createButtonPlane )
            .toHaveBeenCalledTimes ( 4 );

        let createButtonPlaneMock = 
            window.babylonProject.createButtonPlane.mock;

        testCases.forEach ( function ( testData, testIdx )
        {

            expect ( createButtonPlaneMock.calls [ testIdx ] [ 0 ] )
                .toBe ( testData.buttonName ); 

            expect ( createButtonPlaneMock.calls [ testIdx ] [ 1 ] )
                .toEqual ( 
                {
                    size : config.turnControlPlaneSize
                } );

            expect ( 
                createButtonPlaneMock.calls [ testIdx ] [ 2 ].buttonText )
                .toEqual ( testData.buttonText );

            //test buttonCall

            expect ( 
                createButtonPlaneMock.calls [ testIdx ] [ 2 ].buttonCall )
                .toBeInstanceOf ( Function );

            createButtonPlaneMock.calls [ testIdx ] [ 2 ].buttonCall ();

            expect ( window.babylonProject.turnSnake )
                .toHaveBeenCalledTimes ( testIdx + 1 );

            expect ( window.babylonProject.turnSnake )
                .toHaveBeenLastCalledWith ( 
                        testData.buttonDir, mock_gameData );

            //scene and babylon parameters

            expect ( createButtonPlaneMock.calls [ testIdx ] [ 3 ] )
                .toBe ( mock_gameData.scene );

            expect ( createButtonPlaneMock.calls [ testIdx ] [ 4 ] )
                .toBe ( mock_babylon );

            //check input controls were stored in gamedata

            expect ( 
                 mock_gameData.turnInputControls [ testData.controlName ] )
                .toBeDefined ();

            expect ( 
                 mock_gameData.turnInputControls [ testData.controlName ] )
                .toEqual ( createButtonPlaneMock.results [ testIdx ].value );

            //check position was set

            expect ( 
                 mock_gameData.turnInputControls [ testData.controlName ]
                    .buttonPlane.position )
                .toEqual ( testData.buttonPos );

        });

    });

    test ( "disables perpindicular move arrows", () =>
    {
        let mock_babylon = new MockBabylon ();

        let mock_gameData = new MockGameData ();

        let config = window.babylonProject.config;

        let u = config.dirUp;
        let d = config.dirDown;
        let l = config.dirLeft;
        let r = config.dirRight;

        let allDirs = [ u, d, l, r ];
        
        let testCases = [
            {
                currentDir : [ u, d ],
                enabled    : [ "right", "left" ],
                disabled   : [ "up",    "down" ]
            },

            {
                currentDir : [ r, l ],
                enabled    : [ "up",    "down" ],
                disabled   : [ "right", "left" ]
            }

        ];

        let updateFunc = 
            window.babylonProject.snakeMoveState ( 
                    mock_babylon, mock_gameData );

        let testButtonEnabled = ( dirName, callCount, enabled ) =>
        {
            let controlName = dirName+"Control";

            //plane isEnabled () function should be called

            expect ( mock_gameData.turnInputControls
                   [ controlName ].buttonPlane.isEnabled )
               .toHaveBeenCalledTimes ( callCount );

            expect ( mock_gameData.turnInputControls
                   [ controlName ].buttonPlane.isEnabled )
               .toHaveBeenLastCalledWith ( enabled );

            //button isEnabled and isVisible property should be set

            expect ( mock_gameData.turnInputControls
                   [ controlName ].button.isEnabled )
               .toBe ( enabled );

            expect ( mock_gameData.turnInputControls
                   [ controlName ].button.isVisible )
               .toBe ( enabled );

        };

        //These properties should be reset between each test case
        let resetButtonProperties = () =>
        {
            mock_gameData.turnInputControls
                .upControl.button.isEnabled = undefined;
            
            mock_gameData.turnInputControls
                .downControl.button.isEnabled = undefined;
            
            mock_gameData.turnInputControls
                .leftControl.button.isEnabled = undefined;
            
            mock_gameData.turnInputControls
                .rightControl.button.isEnabled = undefined;

            mock_gameData.turnInputControls
                .upControl.button.isVisble = undefined;
            
            mock_gameData.turnInputControls
                .downControl.button.isVisble = undefined;
            
            mock_gameData.turnInputControls
                .leftControl.button.isVisble = undefined;
            
            mock_gameData.turnInputControls
                .rightControl.button.isVisble = undefined;

        };

        //keeps track of how many times isEnabled should have been called
        //on the buttons - starts at one because it is called during that
        //first call to the state
        let isEnabledCallCount = 1;

        //loop through each test case
        testCases.forEach ( function ( testData )
        {
            //each test case specifies two current directions to set
            testData.currentDir.forEach ( function ( cd )
            {
                //set the current direction
                mock_gameData.currentDir = cd;

                resetButtonProperties ();

                //update the current state and store the returned function
                //for the next testcase
                updateFunc = updateFunc ();

                //expect isEnabled to have been called on all 4 buttons
                isEnabledCallCount += 1;

                //these direction controls should be enabled
                testData.enabled.forEach ( function ( dirName )
                {
                    testButtonEnabled ( dirName, isEnabledCallCount, true );
                });
                
                //these direction controls should be enabled
                testData.disabled.forEach ( function ( dirName )
                {
                    testButtonEnabled ( dirName, isEnabledCallCount, false );
                });
                
                
            });
        });
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
                .toEqual ( expectedMoveCalls * mock_gameData.currentDir.y );

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

describe ( "window.babylonProject.turnSnake", () =>
{
    test ( "is defined", () =>
    {
        expect ( window.babylonProject.turnSnake )
            .toBeDefined ();
    });

    test ( "validates parameters", () =>
    {
        //is valid direction returns true by default

        window.babylonProject.config.isValidDirection
            .mockReturnValueOnce ( false );

        expect ( () => window.babylonProject.turnSnake () )
            .toThrow ( "newDir is not a valid direction" );
        
        expect ( () => window.babylonProject.turnSnake ( ) )
            .toThrow ( "gameData.currentDir is not defined" );
        
        expect ( () => window.babylonProject.turnSnake ( undefined, 123 ) )
            .toThrow ( "gameData.currentDir is not defined" );
        
    });

    test ( "changes direction if newDir is perpindicular to currentDir", 
            () =>
    {
        let config = window.babylonProject.config;

        let u = config.dirUp;
        let d = config.dirDown;
        let l = config.dirLeft;
        let r = config.dirRight;

        let perpindicular = ( a, b ) => 
            ( ( ( a == u || a == d ) && ( b == r || b == l ) ) ||
              ( ( a == r || a == l ) && ( b == u || b == d ) ) );

        let allDirs = [ u, d, l, r ];

        let mock_gameData = new MockGameData ();

        //test all directions and check only perpindicular combinations
        //cause currentDir to change
        allDirs.forEach ( function ( a )
        {
            allDirs.forEach ( function ( b ) 
            {
                mock_gameData.currentDir = b;

                window.babylonProject.turnSnake ( a, mock_gameData );

                if ( perpindicular ( a, b ) )
                {
                   expect ( mock_gameData.currentDir ) .toBe ( a );
                }
                else
                {
                   expect ( mock_gameData.currentDir ) .toBe ( b );
                }
            });
        });
    });
});
