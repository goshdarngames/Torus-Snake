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

        //check that the snake forms a horizontal line
        mock_gameData.snakeParts.forEach ( 
        ( val, idx ) => 
        {
            expect ( val.x ).toBe ( idx );
            expect ( val.y ).toBe ( 0 );
        });          
    });
});
