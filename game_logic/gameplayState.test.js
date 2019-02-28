const startState = require ( "./gameplayState" );

/****************************************************************************
 * gameplayState.test.js
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

        turnControlPlaneSize : 5,

        snakeMoveInitialInterval : 4
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

    window.babylonProject.snake = {};

    window.babylonProject.snake.turnAllowed = jest.fn ();

    window.babylonProject.snake.turnSnake = jest.fn ();

    window.babylonProject.snake.moveSnake = jest.fn ();

    window.babylonProject.snake.growSnake = jest.fn ();
    
    window.babylonProject.snake.createSnake = jest.fn ();
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
    this.snakeParts = jest.fn ();
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

describe ( "window.babylonProject.gameplayState", () =>
{
    test ( "is defined", () =>
    {
        expect ( window.babylonProject.gameplayState )
            .toBeDefined ();
    });

    test ( "expects game data and babylon args to be defined", () =>
    {
        mock_babylon = new MockBabylon ();
        mock_gameData = new MockGameData ();

        expect ( () => 
                window.babylonProject.gameplayState ( mock_babylon ))
            .toThrow ( "gameData is undefined" );


        expect ( () => 
                window.babylonProject.gameplayState ( 
                    undefined, mock_gameData ))
            .toThrow ( "babylon is undefined" );

        mock_gameData = new MockGameData ();
        mock_gameData.snakeParts = undefined;

        expect ( () =>
                window.babylonProject.gameplayState (
                    mock_babylon, mock_gameData ))
            .toThrow ( "gameData.snakeParts is undefined" );

        mock_gameData = new MockGameData ();
        mock_gameData.snakeMoveInterval = undefined;

        expect ( () =>
                window.babylonProject.gameplayState (
                    mock_babylon, mock_gameData ))
            .toThrow ( "gameData.snakeMoveInterval is undefined" );
        
        mock_gameData = new MockGameData ();
        mock_gameData.snakeMoveTimer = undefined;

        expect ( () =>
                window.babylonProject.gameplayState (
                    mock_babylon, mock_gameData ))
            .toThrow ( "gameData.snakeMoveTimer is undefined" );
        
        mock_gameData = new MockGameData ();
        mock_gameData.currentDir = undefined;

        expect ( () =>
                window.babylonProject.gameplayState (
                    mock_babylon, mock_gameData ))
            .toThrow ( "gameData.currentDir is undefined" );
        
        mock_gameData = new MockGameData ();
        
        window.babylonProject.config.isValidDirection
            .mockReturnValueOnce ( false );

        expect ( () =>
                window.babylonProject.gameplayState (
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

        window.babylonProject.gameplayState ( mock_babylon, mock_gameData ); 

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
            //The function should call turn snake and store the result
            //in gameData.currentDir

            expect ( 
                createButtonPlaneMock.calls [ testIdx ] [ 2 ].buttonCall )
                .toBeInstanceOf ( Function );

            let previousDir = mock_gameData.currentDir;

            babylonProject.snake.turnSnake
                .mockReturnValueOnce ( jest.fn () );

            createButtonPlaneMock.calls [ testIdx ] [ 2 ].buttonCall ();

            expect ( babylonProject.snake.turnSnake )
                .toHaveBeenCalledTimes ( testIdx + 1 );

            expect ( babylonProject.snake.turnSnake )
                .toHaveBeenLastCalledWith ( 
                        testData.buttonDir, previousDir );

            expect ( mock_gameData.currentDir )
                .toBe ( babylonProject.snake.turnSnake.mock
                        .results [ testIdx ].value );

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
            window.babylonProject.gameplayState ( 
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
           "but update torus meshes, and move snake/apple are only " +
           "called when delta time causes the timer to elapse.",
            () =>
    {

        let mock_babylon = new MockBabylon ();

        let mock_gameData = new MockGameData ();

        //keep a count of how many times the move functions should have
        //been called during the test execution

        let expectedMoveCalls = 0;

        //the previous snake parts are stored so that it is possible to 
        //assert that they were passed to the moveSnake function when the
        //timer elapsed and that the snake parts property is not changed
        //if the timer does not elapse

        let previousSnakeParts = mock_gameData.snakeParts;

        timerTestData.forEach ( function ( testData, idx )
        {
            babylonProject.snake.moveSnake.mockReturnValueOnce (
                    jest.fn () );

            mock_gameData.snakeMoveTimer = testData.snakeMoveTimerBefore;

            let retVal = window.babylonProject.gameplayState ( 
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

            expect ( window.babylonProject.snake.moveSnake )
                .toHaveBeenCalledTimes ( expectedMoveCalls );

            expect ( window.babylonProject.snake.moveSnake )
                .toHaveBeenCalledWith ( 
                        mock_gameData.currentDir,
                        previousSnakeParts,
                        mock_gameData.wrapTorusCoord );

            //snakeParts should be the last returned value from moveSnake

            expect ( mock_gameData.snakeParts )
                .toBe ( babylonProject.snake.moveSnake.mock
                        .results [ expectedMoveCalls - 1 ].value );

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

});

describe ( "window.babylonProject.gameplayStateData", () =>
{
    test ( "is defined", () =>
    {
        expect ( window.babylonProject.gameplayStateData )
            .toBeDefined ();
    });

    test ( "returns an object with expected properties", () =>
    {
        let retVal = new babylonProject.gameplayStateData ();

        expect ( babylonProject.snake.createSnake )
            .toHaveBeenCalledTimes ( 1 );

        expect ( babylonProject.snake.createSnake )
            .toHaveBeenCalledWith ( babylonProject.config.dirLeft, 3 );

        expect ( retVal.snakeParts )
            .toBe ( babylonProject.snake.createSnake
                    .mock.results [ 0 ].value );

        expect ( retVal.snakeMoveInterval )
            .toEqual ( babylonProject.config.snakeMoveInitialInterval );

        expect ( retVal.snakeMoveTimer )
            .toEqual ( babylonProject.config.snakeMoveInitialInterval );

        expect ( retVal.applePos )
            .toEqual ( { x : 2, y : 1 } );

        expect ( retVal.currentDir )
            .toEqual ( babylonProject.config.dirLeft  );

    });

});


