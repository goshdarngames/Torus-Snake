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
});

let MockScene = jest.fn ( function ()
{
    this.render = jest.fn();
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
    });

    test ( "scene.render is called",
            () =>
    {
        let mock_babylon = new MockBabylon ();

        let mock_gameData = new MockGameData ();


        window.babylonProject.snakeMoveState ( 
                    mock_babylon, mock_gameData );

        expect ( mock_gameData.scene.render ).toHaveBeenCalledTimes ( 1 );

    });


    test ( "calls babylonProject,updateTorusMeshes", () =>
    {
        mock_babylon = new MockBabylon ();
        mock_gameData = new MockGameData ();

        window.babylonProject.snakeMoveState ( mock_babylon, mock_gameData ); 

        expect ( window.babylonProject.updateTorusMeshes )
            .toHaveBeenCalledTimes ( 1 );

        expect ( window.babylonProject.updateTorusMeshes )
            .toHaveBeenCalledWith ( mock_gameData );


    });

    test ( "returns a function", () =>
    {
        let mock_babylon = new MockBabylon ();
        let mock_gameData = new MockGameData ();

        //when the current state is called it should return a function
        //that calls the next state function

        let retVal = window.babylonProject.snakeMoveState ( 
                    mock_babylon, mock_gameData );

        expect ( retVal )
            .toBeInstanceOf ( Function );

    });
});
