const startState = require ( "./createSnakeState" );

/****************************************************************************
 * createSnakeState.test.js
 *
 * Verifies that the snake is created correctly.
 ***************************************************************************/

/****************************************************************************
 * EXPECTED TEST VALUES
 ***************************************************************************/

/****************************************************************************
 * MOCK DATA
 ***************************************************************************/

let MockBabylon = jest.fn ();

let MockGameData = jest.fn ();


beforeEach ( () =>
{
    window.babylonProject.snakeMoveState = jest.fn ();
})

/****************************************************************************
 * TESTS
 ***************************************************************************/

describe ( "window.babylonProject.createSnakeState", () =>
{
    test ( "is defined", () =>
    {
        expect ( window.babylonProject.createSnakeState )
            .toBeDefined ();
    });

    test ( "expects game data and babylon args to be defined", () =>
    {
        mock_babylon = new MockBabylon ();
        mock_gameData = new MockGameData ();

        expect ( () => 
                window.babylonProject.createSnakeState ( mock_babylon ))
            .toThrow ( "GameData is undefined" );


        expect ( () => 
                window.babylonProject.createSnakeState ( 
                    undefined, mock_gameData ))
            .toThrow ( "Babylon is undefined" );
    });

    test ( "defines gameData.snakeParts", () =>
    {
        mock_babylon = new MockBabylon ();
        mock_gameData = new MockGameData ();

        window.babylonProject.createSnakeState ( 
                mock_babylon, mock_gameData ); 

        expect ( mock_gameData.snakeParts )
            .toBeDefined ();

        expect ( mock_gameData.snakeParts.length )
            .toBe ( 3 );

        //check that the snake forms a line along the y axis
        mock_gameData.snakeParts.forEach ( 
        ( val, idx ) => 
        {
            expect ( val.x ).toBe ( 0 );
            expect ( val.y ).toBe ( idx );
        });          
    });

    test ( "returns a function that calls snakeMoveState", () =>
    {
        let mock_babylon = new MockBabylon ();
        let mock_gameData = new MockGameData ();

        //when the current state is called it should return a function
        //that calls the next state function

        let retVal = window.babylonProject.createSnakeState ( 
                    mock_babylon, mock_gameData );

        expect ( retVal )
            .toBeInstanceOf ( Function );

        //check the next state function was not called during the current
        //state function

        expect ( window.babylonProject.snakeMoveState )
            .not.toHaveBeenCalled ();

        //call the returned function and check the next state was called

        retVal ();

        expect ( window.babylonProject.snakeMoveState )
            .toHaveBeenCalledTimes ( 1 );
    });
});
