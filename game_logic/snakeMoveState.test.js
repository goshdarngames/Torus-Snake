const startState = require ( "./snakeMoveState" );

/****************************************************************************
 * snakeMoveState.test.js
 ***************************************************************************/

/****************************************************************************
 * EXPECTED TEST VALUES
 ***************************************************************************/

/****************************************************************************
 * MOCK DATA
 ***************************************************************************/

let MockBabylon = jest.fn ();

let MockGameData = jest.fn ( function ()
{
    this.snakeParts = [];
    this.scene = new MockScene ();
    this.torusMeshes = [];

    this.snakeMoveInterval = 0.5;
    this.snakeMoveTimer = 0.5;

    this.engine = new MockEngine ();
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

beforeEach ( () => 
{
    window.babylonProject.updateTorusMeshes = jest.fn ();
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

    test ( "scene.render is called and a function is returned every time "+
           "but update torus meshes is only called when delta time "+
           "causes the timer to elapse.",
            () =>
    {
        let mock_babylon = new MockBabylon ();

        let mock_gameData = new MockGameData ();


        window.babylonProject.snakeMoveState ( 
                    mock_babylon, mock_gameData );

        expect ( mock_gameData.scene.render ).toHaveBeenCalledTimes ( 1 );

        expect ( window.babylonProject.updateTorusMeshes )
            .toHaveBeenCalledTimes ( 1 );

        expect ( window.babylonProject.updateTorusMeshes )
            .toHaveBeenCalledWith ( mock_gameData );

        let retVal = window.babylonProject.snakeMoveState ( 
                    mock_babylon, mock_gameData );

        expect ( retVal )
            .toBeInstanceOf ( Function );

    });
});
