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

let MockStateData = jest.fn ( function ()
{
    this.snakeParts = jest.fn ();

    this.snakeMoveInterval = jest.fn ();

    this.snakeMoveTimer = jest.fn ();

    this.applePos = jest.fn();
    this.applePos.x = 1;
    this.applePos.y = 2;

    this.snakeMoveInterval = 0.5;
    this.snakeMoveTimer = 0.5;


    this.currentDir = jest.fn ();

});

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

    this.engine = new MockEngine ();

    this.wrapTorusCoord = jest.fn ();
    this.wrapTorusCoord.mockReturnValue ( jest.fn () );

    this.appleMat = jest.fn ();

    this.snakeMat = jest.fn ();

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
        babylon = new MockBabylon ();
        gameData = new MockGameData ();

        expect ( () => 
                window.babylonProject.gameplayState ( ))
            .toThrow ( "babylon is undefined" );
        
        expect ( () => 
                window.babylonProject.gameplayState ( babylon ))
            .toThrow ( "gameData is undefined" );

    });

    test ( "creates stateData if it is undefined", () =>
    {
        babylon = new MockBabylon ();
        gameData = new MockGameData ();

        let oldFunc = babylonProject.GameplayStateData;

        babylonProject.GameplayStateData = jest.fn ();

        oneTimeCleanUp = 
            () => { babylonProject.GameplayStateData = oldFunc; }

        babylonProject.gameplayState ( babylon, gameData );

        expect ( babylonProject.GameplayStateData )
            .toHaveBeenCalledTimes ( 1 );

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

        babylon = new MockBabylon ();
        gameData = new MockGameData ();
        stateData = new MockStateData ();

        window.babylonProject
            .gameplayState ( babylon, gameData, stateData ); 

        expect ( gameData.turnInputControls )
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

            let previousDir = gameData.currentDir;

            babylonProject.snake.turnSnake
                .mockReturnValueOnce ( jest.fn () );

            createButtonPlaneMock.calls [ testIdx ] [ 2 ].buttonCall ();

            expect ( babylonProject.snake.turnSnake )
                .toHaveBeenCalledTimes ( testIdx + 1 );

            expect ( babylonProject.snake.turnSnake )
                .toHaveBeenLastCalledWith ( 
                        testData.buttonDir, previousDir );

            expect ( gameData.currentDir )
                .toBe ( babylonProject.snake.turnSnake.mock
                        .results [ testIdx ].value );

            //scene and babylon parameters

            expect ( createButtonPlaneMock.calls [ testIdx ] [ 3 ] )
                .toBe ( gameData.scene );

            expect ( createButtonPlaneMock.calls [ testIdx ] [ 4 ] )
                .toBe ( babylon );

            //check input controls were stored in gamedata

            expect ( 
                 gameData.turnInputControls [ testData.controlName ] )
                .toBeDefined ();

            expect ( 
                 gameData.turnInputControls [ testData.controlName ] )
                .toEqual ( createButtonPlaneMock.results [ testIdx ].value );

            //check position was set

            expect ( 
                 gameData.turnInputControls [ testData.controlName ]
                    .buttonPlane.position )
                .toEqual ( testData.buttonPos );

        });

    });

    test ( "disables perpindicular move arrows", () =>
    {
        let babylon = new MockBabylon ();

        let gameData = new MockGameData ();

        let stateData = new MockStateData ();

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
                    babylon, gameData, stateData );

        let testButtonEnabled = ( dirName, callCount, enabled ) =>
        {
            let controlName = dirName+"Control";

            //plane isEnabled () function should be called

            expect ( gameData.turnInputControls
                   [ controlName ].buttonPlane.isEnabled )
               .toHaveBeenCalledTimes ( callCount );

            expect ( gameData.turnInputControls
                   [ controlName ].buttonPlane.isEnabled )
               .toHaveBeenLastCalledWith ( enabled );

            //button isEnabled and isVisible property should be set

            expect ( gameData.turnInputControls
                   [ controlName ].button.isEnabled )
               .toBe ( enabled );

            expect ( gameData.turnInputControls
                   [ controlName ].button.isVisible )
               .toBe ( enabled );

        };

        //These properties should be reset between each test case
        let resetButtonProperties = () =>
        {
            gameData.turnInputControls
                .upControl.button.isEnabled = undefined;
            
            gameData.turnInputControls
                .downControl.button.isEnabled = undefined;
            
            gameData.turnInputControls
                .leftControl.button.isEnabled = undefined;
            
            gameData.turnInputControls
                .rightControl.button.isEnabled = undefined;

            gameData.turnInputControls
                .upControl.button.isVisble = undefined;
            
            gameData.turnInputControls
                .downControl.button.isVisble = undefined;
            
            gameData.turnInputControls
                .leftControl.button.isVisble = undefined;
            
            gameData.turnInputControls
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
                gameData.currentDir = cd;

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

        let babylon = new MockBabylon ();

        let gameData = new MockGameData ();

        let stateData = new MockStateData ();

        //keep a count of how many times the move functions should have
        //been called during the test execution

        let expectedMoveCalls = 0;

        //the previous snake parts are stored so that it is possible to 
        //assert that they were passed to the moveSnake function when the
        //timer elapsed and that the snake parts property is not changed
        //if the timer does not elapse

        let previousSnakeParts = stateData.snakeParts;

        timerTestData.forEach ( function ( testData, idx )
        {
            babylonProject.snake.moveSnake.mockReturnValueOnce (
                    jest.fn () );

            stateData.snakeMoveTimer = testData.snakeMoveTimerBefore;

            //call the state function

            let retVal = babylonProject.gameplayState ( 
                        babylon, gameData, stateData );

            //render should be called every time
            expect ( gameData.scene.render )
                .toHaveBeenCalledTimes ( idx + 1 );

            //these functions should only be called when the snake move 
            //timer elapses

            if ( testData.moveFunctionsCalled )
            {
                expectedMoveCalls += 1;
            } 

            //check the snake was moved

            expect ( babylonProject.snake.moveSnake )
                .toHaveBeenCalledTimes ( expectedMoveCalls );

            expect ( babylonProject.snake.moveSnake )
                .toHaveBeenCalledWith ( 
                        stateData.currentDir,
                        previousSnakeParts,
                        gameData.wrapTorusCoord );
            
            //check the apple was moved

            expect ( gameData.wrapTorusCoord )
                .toHaveBeenCalledTimes ( expectedMoveCalls );

            expect ( gameData.wrapTorusCoord.mock
                .calls [ expectedMoveCalls -1 ] [ 0 ] )
                    .toEqual (   
                    {
                        x : stateData.applePos.x + stateData.currentDir.x,
                        y : stateData.applePos.y + stateData.currentDir.y
                    });

            let wrappedApplePos =
                gameData.wrapTorusCoord.mock
                    .results [ expectedMoveCalls -1 ].value;

            //check the torus meshes were updated

            expect ( babylonProject.updateTorusMeshes )
                .toHaveBeenCalledTimes ( expectedMoveCalls );

            expect ( babylonProject.updateTorusMeshes )
                .toHaveBeenLastCalledWith (
                      stateData.snakeParts,
                      wrappedApplePos,
                      gameData.torusMeshes,
                      gameData.torusCoordToMeshIdx,
                      gameData.snakeMat,
                      gameData.appleMat  
                      );

            //snakeParts should be the last returned value from moveSnake

            expect ( stateData.snakeParts )
                .toBe ( babylonProject.snake.moveSnake.mock
                        .results [ expectedMoveCalls - 1 ].value );

            //the return of the state function should be another function

            expect ( retVal )
                .toBeInstanceOf ( Function );
            
            //the move timer should have decreased by 0.1

            expect ( stateData.snakeMoveTimer )
                .toBeCloseTo ( testData.snakeMoveTimerAfter );

            //the move interval should be unchanged

            expect ( stateData.snakeMoveInterval )
                .toBeCloseTo ( 0.5 );
        });

    });

});

describe ( "window.babylonProject.GameplayStateData", () =>
{
    test ( "is defined", () =>
    {
        expect ( window.babylonProject.GameplayStateData )
            .toBeDefined ();
    });

    test ( "returns an object with expected properties", () =>
    {
        let retVal = new babylonProject.GameplayStateData ();

        // snake was created

        expect ( babylonProject.snake.createSnake )
            .toHaveBeenCalledTimes ( 1 );

        expect ( babylonProject.snake.createSnake )
            .toHaveBeenCalledWith ( babylonProject.config.dirLeft, 3 );

        expect ( retVal.snakeParts )
            .toBe ( babylonProject.snake.createSnake
                    .mock.results [ 0 ].value );

        //snake move timer and interval

        expect ( retVal.snakeMoveInterval )
            .toEqual ( babylonProject.config.snakeMoveInitialInterval );

        expect ( retVal.snakeMoveTimer )
            .toEqual ( babylonProject.config.snakeMoveInitialInterval );

        //apple position

        expect ( retVal.applePos )
            .toEqual ( { x : 2, y : 1 } );

        //current direction

        expect ( retVal.currentDir )
            .toEqual ( babylonProject.config.dirLeft  );

        //turn input controls

        expect ( retVal.turnInputControls )
            .toBeDefined ();

        //turn button callback
        // - should call turnSnake and store its return as currentDir

        expect ( retVal.turnButtonCallback )
            .toBeInstanceOf ( Function );

        let prevDir = retVal.currentDir;
        let buttonDir = jest.fn ();
        let turnSnakeRet = jest.fn ();

        babylonProject.snake.turnSnake.mockReturnValueOnce ( turnSnakeRet );

        retVal.turnButtonCallback ( buttonDir );

        expect ( babylonProject.snake.turnSnake )
            .toHaveBeenCalledTimes ( 1 );

        expect ( babylonProject.snake.turnSnake )
            .toHaveBeenLastCalledWith ( buttonDir, prevDir );

        expect ( retVal.currentDir )
            .toBe ( turnSnakeRet );
    });

});


